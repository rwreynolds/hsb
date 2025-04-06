// filepath: /Users/mrrobot/VSCodeProjects/openai-assistants/hsb/hsb-ui/src/pages/index.js
import { useState } from 'react';
import ChatContainer from '@/components/ChatContainer';
import ChatInput from '@/components/ChatInput';

export async function getStaticProps() {
  try {
    const response = await fetch('http://127.0.0.1:5000/api/ping'); // Correct endpoint
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      props: {
        apiStatus: data,
      },
      revalidate: 10, // Revalidate every 10 seconds (optional)
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        apiStatus: null,
      },
    };
  }
}

export default function Home({ apiStatus }) {
  const [historyMessages, setHistoryMessages] = useState([]); // Stores all previous messages
  const [currentMessage, setCurrentMessage] = useState(null); // Stores the current message
  const [loading, setLoading] = useState(false);
  const [threadId, setThreadId] = useState(null); // Store the thread ID for session memory

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    // Move the current message to history
    if (currentMessage) {
      setHistoryMessages((prev) => [...prev, currentMessage]);
    }

    // Set the new user message as the current message
    setCurrentMessage({ role: 'user', content: message });
    setLoading(true);

    try {
      // Send message to the backend
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, thread_id: threadId }), // Include thread_id if it exists
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      console.log('Backend response:', data); // Debugging log

      // Capture the thread_id from the response if it's the first message
      if (data.thread_id && !threadId) {
        setThreadId(data.thread_id);
      }

      // Set the assistant's response as the current message
      setCurrentMessage({ role: 'assistant', content: data.response });
    } catch (error) {
      console.error('Error sending message:', error);
      setCurrentMessage({
        role: 'assistant',
        content: 'Error: Unable to process your message.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!apiStatus) {
    return <div>Error: Unable to connect to the backend API.</div>;
  }

  return (
    <div className="container">
      <header>
        <h1>Ham Shack Buddy</h1>
        <p>Your AI Amateur Radio Assistant</p>
        <p className="elmer-note">
          CQ CQ! Ham Shack Buddy is your AI Elmer, but it’s still just a bot. Double-check your info before keying up!
        </p>
      </header>
      <ChatContainer
        historyMessages={historyMessages}
        currentMessage={currentMessage} // Pass currentMessage correctly
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