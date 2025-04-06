// Modified ChatHistory.js component to show both messages in current area

import { useState } from 'react';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import ChatMessage from './ChatMessage';

export default function ChatHistory({ historyMessages = [], currentMessage, previousUserMessage, onHideHistory }) {
  const [isHistoryVisible, setIsHistoryVisible] = useState(true);

  const toggleHistoryVisibility = () => {
    setIsHistoryVisible((prev) => !prev);
    onHideHistory?.(!isHistoryVisible);
  };

  return (
    <div className="chat-history-container">
      {/* Toggle Button for History */}
      <button className="toggle-button" onClick={toggleHistoryVisibility}>
        {isHistoryVisible ? 'Hide Chat History' : 'Show Chat History'}
      </button>

      {/* History Area - only shown when isHistoryVisible is true */}
      {isHistoryVisible && (
        <SimpleBar style={{ maxHeight: '200px', width: '100%' }} className="chat-history">
          {Array.isArray(historyMessages) && historyMessages.length > 0 ? (
            historyMessages.map((message, index) => (
              <ChatMessage key={`history-${index}`} message={message} />
            ))
          ) : (
            <div className="empty-chat">
              <p>No previous messages.</p>
            </div>
          )}
        </SimpleBar>
      )}

      {/* Current Message Area - Shows both user message and response when available */}
      <div className="current-message">
        {previousUserMessage && currentMessage?.role === 'assistant' ? (
          // Show both user message and assistant response
          <>
            <ChatMessage message={previousUserMessage} />
            <ChatMessage message={currentMessage} />
          </>
        ) : currentMessage ? (
          // Show just the current message
          <ChatMessage message={currentMessage} />
        ) : (
          // Empty state
          <div className="empty-chat">
            <p>No current message.</p>
          </div>
        )}
      </div>
    </div>
  );
}