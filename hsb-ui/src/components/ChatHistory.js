import { useState, useRef, useEffect } from 'react';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import ChatMessage from './ChatMessage';

export default function ChatHistory({ historyMessages = [], currentMessage, previousUserMessage, onHideHistory }) {
  const [isHistoryVisible, setIsHistoryVisible] = useState(true);
  const [selectedMessageIndex, setSelectedMessageIndex] = useState(null);
  const historyRef = useRef(null);
  const messagesEndRef = useRef({});

  const toggleHistoryVisibility = () => {
    setIsHistoryVisible((prev) => !prev);
    onHideHistory?.(!isHistoryVisible);
  };

  const scrollToMessage = (index) => {
    if (messagesEndRef.current[index]) {
      // Use native scrollIntoView for more consistent behavior
      messagesEndRef.current[index].scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest',
        inline: 'start'
      });
      setSelectedMessageIndex(index);
    }
  };

  // Filter out only user messages for the index list
  const userMessages = historyMessages.filter((msg, index) => 
    index % 2 === 0 && msg.role === 'user'
  );

  return (
    <div className="chat-history-container">
      {/* Toggle Button for History */}
      <button className="toggle-button" onClick={toggleHistoryVisibility}>
        {isHistoryVisible ? 'Hide Chat History' : 'Show Chat History'}
      </button>

      {/* Only show the full history layout when history is visible */}
      {isHistoryVisible && (
        <div className="chat-history-content" ref={historyRef}>
          {/* Message Index List */}
          <div className="message-index-list">
            <h4>Chat History Index</h4>
            {userMessages.length > 0 ? (
              <ul>
                {userMessages.map((msg, index) => (
                  <li 
                    key={`index-${index}`}
                    onClick={() => scrollToMessage(index * 2)}
                    className={selectedMessageIndex === index * 2 ? 'selected' : ''}
                  >
                    {msg.content.length > 50 
                      ? `${msg.content.substring(0, 50)}...` 
                      : msg.content}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No chat history</p>
            )}
          </div>

          {/* Chat History Area */}
          <SimpleBar 
            className="chat-history-scroll"
            style={{ 
              maxHeight: '200px', 
              width: '100%', 
              overflowY: 'auto' 
            }}
          >
            <div className="chat-history">
              {Array.isArray(historyMessages) && historyMessages.length > 0 ? (
                historyMessages.map((message, index) => (
                  <div 
                    key={`history-${index}`}
                    ref={el => messagesEndRef.current[index] = el}
                  >
                    <ChatMessage message={message} />
                  </div>
                ))
              ) : (
                <div className="empty-chat">
                  <p>No previous messages.</p>
                </div>
              )}
            </div>
          </SimpleBar>
        </div>
      )}

      {/* Current Message Area - Shows both user message and response when available */}
      <div className="current-message">
        {previousUserMessage && currentMessage?.role === 'assistant' ? (
          <>
            <ChatMessage message={previousUserMessage} />
            <ChatMessage message={currentMessage} />
          </>
        ) : currentMessage ? (
          <ChatMessage message={currentMessage} />
        ) : (
          <div className="empty-chat">
            <p>No current message.</p>
          </div>
        )}
      </div>
    </div>
  );
}