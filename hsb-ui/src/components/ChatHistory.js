// filepath: /Users/mrrobot/VSCodeProjects/openai-assistants/hsb/hsb-ui/src/components/ChatHistory.js
import { useState } from 'react';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import ChatMessage from './ChatMessage';
 
export default function ChatHistory({ messages }) {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  return (
    <div className="chat-history-container">
      {/* Toggle Button */}
      <button className="toggle-button" onClick={toggleVisibility}>
        {isVisible ? 'Hide Chat History' : 'Show Chat History'}
      </button>

      {/* Conditionally Render Chat History */}
      {isVisible && (
        <SimpleBar style={{ maxHeight: '400px', width: '100%' }} className="chat-history">
          {messages.length === 0 ? (
            <div className="empty-chat">
              <p>No messages yet. Start a conversation!</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))
          )}
        </SimpleBar>
      )}
    </div>
  );
}