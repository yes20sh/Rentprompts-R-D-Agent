import { useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';

export default function ChatHistory({ messages }) {
  const bottomRef = useRef(null);

  const formatMessage = (msg) => {
    if (msg.isHTML) {
      return DOMPurify.sanitize(msg.message); // safely render HTML
    } else {
      return DOMPurify.sanitize(msg.message).replace(/\n/g, '<br/>');
    }
  };

  // Auto-scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div
      className="w-full max-w-3xl flex-1 overflow-y-auto space-y-4 mb-2 border border-gray-200 rounded-xl p-3 sm:p-4"
      style={{ maxHeight: '72vh' }}
    >
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[80%] px-4 py-2 rounded-lg shadow-sm whitespace-pre-wrap break-words ${
              msg.sender === 'user'
                ? 'bg-gradient-to-tr from-purple-500 to-orange-400 text-white'
                : 'bg-gray-100 text-gray-800'
            }`}
            dangerouslySetInnerHTML={{ __html: formatMessage(msg) }}
          />
        </div>
      ))}
      <div ref={bottomRef} /> {/* Scroll anchor */}
    </div>
  );
}
