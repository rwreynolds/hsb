import { useState } from 'react';

export default function ChatInput({ onSendMessage, disabled, placeholder = "Type your message here..." }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || disabled) return;
    
    onSendMessage(message);
    setMessage('');
  };

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
      />
      <button type="submit" disabled={disabled || !message.trim()}>
        {disabled ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
}