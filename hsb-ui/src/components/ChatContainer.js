// src/components/ChatContainer.js
import ChatHistory from './ChatHistory';

export default function ChatContainer({ historyMessages = [], currentMessage, previousUserMessage, onHideHistory }) {
  return (
    <div className="chat-container">
      {/* Scrollable Chat History */}
      <ChatHistory 
        historyMessages={historyMessages} 
        currentMessage={currentMessage}
        previousUserMessage={previousUserMessage}
        onHideHistory={onHideHistory}
      />
    </div>
  );
}