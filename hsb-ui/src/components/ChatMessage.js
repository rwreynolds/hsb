export default function ChatMessage({ message }) {
  const { role, content } = message;
  
  return (
    <div className={`chat-message ${role}`}>
      <div className="message-bubble">
        <div className="message-sender">
          {role === 'user' ? 'You' : 'Ham Shack Buddy'}
        </div>
        <div className="message-content">
          {content}
        </div>
      </div>
    </div>
  );
}
