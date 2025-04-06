// src/pages/index.js
import { useState } from 'react';
import ChatContainer from '@/components/ChatContainer';
import ChatInput from '@/components/ChatInput';

export async function getStaticProps() {
  try {
    // Try to connect with a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch('http://127.0.0.1:5000/api/ping', {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      props: {
        apiStatus: data,
      },
      revalidate: 10,
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    // Return null for apiStatus but don't fail the build
    return {
      props: {
        apiStatus: null,
      },
      revalidate: 10, // Try again after 10 seconds
    };
  }
}

export default function Home({ apiStatus }) {
  const [historyMessages, setHistoryMessages] = useState([]); // Stores all previous messages
  const [currentMessage, setCurrentMessage] = useState(null); // Stores the current message
  const [previousUserMessage, setPreviousUserMessage] = useState(null); // Stores the user message for pairing
  const [loading, setLoading] = useState(false);
  const [threadId, setThreadId] = useState(null); // Store the thread ID for session memory

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    // Create the user message
    const userMessage = { role: 'user', content: message };
    
    // If there's a complete pair in current message (previous user message + assistant response),
    // move them to history before starting a new conversation
    if (currentMessage && currentMessage.role === 'assistant' && previousUserMessage) {
      setHistoryMessages(prev => [...prev, previousUserMessage, currentMessage]);
      setPreviousUserMessage(null);
    } else if (currentMessage && currentMessage.role === 'assistant') {
      // Handle edge case where somehow we have an assistant message without a user message
      setHistoryMessages(prev => [...prev, currentMessage]);
    }
    
    // Set the new user message as current and remember it for pairing
    setCurrentMessage(userMessage);
    setPreviousUserMessage(userMessage);
    setLoading(true);

    try {
      // Send message to the backend
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, thread_id: threadId }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      console.log('Backend response:', data);

      // Capture thread_id if it's the first message
      if (data.thread_id && !threadId) {
        setThreadId(data.thread_id);
      }
      
      // Set assistant response as current message (paired with user message in previousUserMessage)
      setCurrentMessage({ role: 'assistant', content: data.response });
      
      // Note: We don't move anything to history here - we wait until the next message
      // to move both user message and assistant response as a pair
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Set error message as current
      setCurrentMessage({
        role: 'assistant',
        content: 'Error: Unable to process your message.',
      });
      // Same approach - we'll move this pair to history on next message
    } finally {
      setLoading(false);
    }
  };

  // Function to handle hiding/showing chat history (optional)
  const handleHideHistory = (isHidden) => {
    console.log('Chat history visibility changed:', !isHidden);
  };

  return (
    <div className="container">
      <header>
        <h1>Ham Shack Buddy</h1>
        <p>Your AI Amateur Radio Assistant</p>
        <p className="elmer-note">
          CQ CQ! Ham Shack Buddy is your AI Elmer, but it's still just a bot. Double-check your info before keying up!
        </p>
      </header>
      <ChatContainer
        historyMessages={historyMessages}
        currentMessage={currentMessage}
        previousUserMessage={previousUserMessage}
        onHideHistory={handleHideHistory}
      />
      <footer className="chat-input-footer">
        <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
        <p className="disclaimer">
          AI-generated content. Verify info independently. Not a substitute for licensed guidance.
        </p>
      </footer>
    </div>
  );
}