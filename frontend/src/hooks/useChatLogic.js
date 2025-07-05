import { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import { extractTextFromPDF, extractTextFromDocx } from '../utils/fileUtils';

const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL;

export default function useChatLogic() {
  const [chatHistory, setChatHistory] = useState([]);
  const [pendingFileText, setPendingFileText] = useState('');
  const [model, setModel] = useState('Gemini-2.0-flash');
  const [deepWebSearch, setDeepWebSearch] = useState(false);
  const [summarizer, setSummarizer] = useState(false);
  const welcomeAddedRef = useRef(false);

  const addMessage = (message, sender = 'user', isHTML = false) => {
    const msg = { sender, message, isHTML };
    setChatHistory(prev => [...prev, msg]);
  };

  const sendMessage = async (msg) => {
    if (!msg && !pendingFileText) return;

    addMessage(msg, 'user');

    // Add spinner
    const spinner = { sender: 'ai', message: '<i class="fas fa-spinner fa-spin"></i> Thinking…', isHTML: true };
    setChatHistory(prev => [...prev, spinner]);

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          extractedText: pendingFileText,
          model,
          deepWebSearch,
          summarizer,
          history: chatHistory.slice(-2),
        }),
      });

      const data = await res.json();

      // Determine response text
      const rawReply =
        data.reply ||
        data.output ||
        (typeof data === 'string' ? data : Object.values(data)[0]) ||
        '⚠️ Unexpected response from server.';

      // Convert Markdown to HTML
      const replyHTML = marked.parse(rawReply);

      // Replace spinner with response
      setChatHistory(prev => [
        ...prev.slice(0, -1),
        { sender: 'ai', message: replyHTML, isHTML: true },
      ]);
    } catch (err) {
      // Replace spinner with error message
      setChatHistory(prev => [
        ...prev.slice(0, -1),
        {
          sender: 'ai',
          message: '❌ Could not reach the server. Check that n8n is running.',
          isHTML: false,
        },
      ]);
    }

    setPendingFileText('');
    setDeepWebSearch(false);
    setSummarizer(false);
  };

  const handleFiles = async (files) => {
    let combinedText = '';

    for (const file of files) {
      let text = '';
      try {
        if (file.type === 'application/pdf') {
          text = await extractTextFromPDF(file);
        } else if (file.name.endsWith('.docx')) {
          text = await extractTextFromDocx(file);
        } else if (file.type === 'text/plain') {
          text = await file.text();
        } else {
          addMessage('❌ Unsupported file type.', 'ai');
          continue;
        }
      } catch (e) {
        addMessage(`❌ Error: ${e.message}`, 'ai');
        continue;
      }

      addMessage(`📎 Uploaded: ${file.name}`, 'user');
      combinedText += `\n\n${text}`;
    }

    setPendingFileText(combinedText.trim());
  };

  useEffect(() => {
    if (!welcomeAddedRef.current) {
      const welcome = "👋 Hi! I'm your R&D AI Assistant. Ask me anything or upload a file.";
      addMessage(welcome, 'ai');
      welcomeAddedRef.current = true;
    }
  }, []);

  return {
    chatHistory,
    sendMessage,
    model,
    setModel,
    deepWebSearch,
    setDeepWebSearch,
    summarizer,
    setSummarizer,
    handleFiles,
  };
}
