import ChatHistory from './ChatHistory';

export default function ChatContainer({ messages }) {
  return (
    <div className="chat-container">
      {/* Scrollable Chat History */}
      <ChatHistory messages={messages} />
    </div>
  );
}
