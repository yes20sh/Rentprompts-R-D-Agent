import { useState, useRef, useEffect } from 'react';

export default function ChatForm({
  sendMessage,
  deepWebSearch,
  setDeepWebSearch,
  summarizer,
  setSummarizer,
  handleFiles,
}) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() !== '') {
      sendMessage(input);
      setInput('');
    }
  };

  // Auto-grow textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  return (
    <div className="w-full bg-white border-t border-gray-200 px-2 sm:px-4 py-3 sticky bottom-0 z-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl mx-auto bg-white border border-gray-300 rounded-xl px-3 py-3 shadow-md"
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          rows={1}
          placeholder="Ask something or upload a file..."
          className="w-full text-sm text-gray-700 resize-none border-none focus:ring-0 focus:outline-none overflow-hidden"
        />

        <div className="flex flex-wrap gap-2 justify-between items-center mt-3">
          <div className="flex flex-wrap gap-2 items-center">
            <input
              type="file"
              multiple
              hidden
              id="fileInput"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <label
              htmlFor="fileInput"
              className="cursor-pointer px-3 py-1 bg-gray-100 rounded-md text-gray-600 hover:bg-gray-200 text-sm"
            >
              📎 Upload
            </label>
            <button
              type="button"
              onClick={() => setDeepWebSearch(!deepWebSearch)}
              className={`px-3 py-1 rounded-md text-sm ${
                deepWebSearch ? 'bg-gradient-to-tr from-purple-500 to-orange-400 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              🌐 Web Search
            </button>
            <button
              type="button"
              onClick={() => setSummarizer(!summarizer)}
              className={`px-3 py-1 rounded-md text-sm ${
                summarizer ? 'bg-gradient-to-tr from-purple-500 to-orange-400 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              💡 Summarize
            </button>
          </div>

          <button
            type="submit"
            className="bg-gradient-to-tr from-purple-500 to-orange-400 px-4 py-2 text-white text-sm rounded-md mt-2 sm:mt-0"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
