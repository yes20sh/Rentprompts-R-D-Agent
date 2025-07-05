import ChatHeader from '../components/ChatHeader';
import ChatHistory from '../components/ChatHistory';
import ChatForm from '../components/ChatForm';
import useChatLogic from '../hooks/useChatLogic';

export default function ChatPage() {
  const chat = useChatLogic();

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <ChatHeader {...chat} />
      <main className="flex-1 flex flex-col items-center px-2 sm:px-4 py-6 relative bg-white">
        <ChatHistory messages={chat.chatHistory} />
        <ChatForm {...chat} />
      </main>
    </div>
  );
}
