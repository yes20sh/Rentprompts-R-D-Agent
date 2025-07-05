export default function ModelSelector({ model, setModel }) {
  const models = ['Gemini-2.0-flash', 'gpt-4o-mini'];

  return (
    <select
      value={model}
      onChange={(e) => setModel(e.target.value)}
      className="border border-gray-300 rounded-full px-3 py-1 text-sm shadow-sm"
    >
      {models.map((m) => (
        <option key={m} value={m}>{m}</option>
      ))}
    </select>
  );
}
