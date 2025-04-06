// filepath: /Users/mrrobot/VSCodeProjects/openai-assistants/hsb/hsb-ui/src/components/ChatHistory.js
import { useState } from 'react';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import ChatMessage from './ChatMessage';

export default function ChatHistory({ historyMessages = [], currentMessage, onHideHistory }) {
  console.log('Current message in ChatHistory:', currentMessage); // Debugging log

  const [isHistoryVisible, setIsHistoryVisible] = useState(true);

  const toggleHistoryVisibility = () => {
    setIsHistoryVisible((prev) => !prev);
    onHideHistory?.(!isHistoryVisible); // Notify parent about visibility change if callback exists
  };

  return (
    <div className="chat-history-container">
      {/* Toggle Button for History */}
      <button className="toggle-button" onClick={toggleHistoryVisibility}>
        {isHistoryVisible ? 'Hide Chat History' : 'Show Chat History'}
      </button>

      {/* History Area */}
      {isHistoryVisible && (
        <SimpleBar style={{ maxHeight: '200px', width: '100%' }} className="chat-history">
          {Array.isArray(historyMessages) && historyMessages.length === 0 ? (
            <div className="empty-chat">
              <p>No previous messages.</p>
            </div>
          ) : (
            historyMessages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))
          )}
        </SimpleBar>
      )}

      {/* Current Message Area */}
      <div className="current-message">
        {currentMessage ? (
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