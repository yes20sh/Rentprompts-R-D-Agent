import ModelSelector from './ModelSelector';

export default function ChatHeader({ model, setModel }) {
  return (
    <header className="w-full py-4 border-b border-gray-200 bg-white flex justify-between items-center px-4 sm:px-6">
      <h1 className="text-base sm:text-lg font-semibold text-gray-800">R&D AI Assistant</h1>
      <ModelSelector model={model} setModel={setModel} />
    </header>
  );
}
