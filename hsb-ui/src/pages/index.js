import { useState, useEffect } from 'react';
import Head from 'next/head';
import ChatInput from '@/components/ChatInput';
import ChatHistory from '@/components/ChatHistory';
import { sendMessage, getThreadMessages } from '@/services/api';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [threadId, setThreadId] = useState(null);

  useEffect(() => {
    // Load thread ID from localStorage if available
    const savedThreadId = localStorage.getItem('threadId');
    if (savedThreadId) {
      setThreadId(savedThreadId);
      fetchMessages(savedThreadId);
    }
  }, []);

  const fetchMessages = async (threadId) => {
    if (!threadId) return;
    
    try {
      const threadMessages = await getThreadMessages(threadId);
      setMessages(threadMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    setLoading(true);

    try {
      // Send message to API
      const response = await sendMessage(message, threadId);
      
      // Store thread ID for future use
      if (response.thread_id && !threadId) {
        setThreadId(response.thread_id);
        localStorage.setItem('threadId', response.thread_id);
      }
      
      // Add assistant response to chat
      setMessages(prev => [...prev, { role: 'assistant', content: response.response }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again later.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Ham Shack Buddy</title>
      </Head>
      
      <div className="container">
        <header>
          <h1>Ham Shack Buddy</h1>
          <p>Your AI Amateur Radio Assistant</p>
        </header>
        
        <div className="chat-container">
          <ChatHistory messages={messages} />
          <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
        </div>
      </div>
    </>
  );
}
