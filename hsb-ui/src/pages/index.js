// src/pages/index.js
import { useState } from 'react';
import ChatContainer from '@/components/ChatContainer';
import ChatInput from '@/components/ChatInput';
import AssistantSelector from '@/components/AssistantSelector';
import { sendMessage } from '@/services/api';

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
  
  // New state for selected assistant
  const [selectedAssistant, setSelectedAssistant] = useState(null);
  const [pageTitle, setPageTitle] = useState("Ham Shack Buddy"); // Default title
  
 // Handle assistant selection
const handleSelectAssistant = (assistant) => {
  console.log('Changing assistant to:', assistant);
  
  // Reset conversation when changing assistants
  setHistoryMessages([]);
  setCurrentMessage(null);
  setPreviousUserMessage(null);
  
  // IMPORTANT: Reset the thread ID when changing assistants
  setThreadId(null);
  
  // Update selected assistant and page title
  setSelectedAssistant(assistant);
  setPageTitle(assistant.name || "AI Assistant");
  
  console.log(`Selected assistant: ${assistant.name} (${assistant.id})`);
};

  const handleSendMessage = async (message) => {
    // Verify if an assistant is selected
    if (!message.trim() || !selectedAssistant) {
      if (!selectedAssistant) {
        alert("Please select an assistant first");
      }
      return;
    }
  
    // Debug logging
    console.log('Selected assistant:', selectedAssistant);
    console.log('Sending message with assistant ID:', selectedAssistant.id);
  
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
      // Use the API service to send the message with selected assistant ID
      const data = await sendMessage(message, threadId, selectedAssistant.id);
      console.log('Backend response:', data);
  
      // Capture thread_id if it's the first message
      if (data.thread_id && !threadId) {
        setThreadId(data.thread_id);
      }
      
      // Set assistant response as current message (paired with user message in previousUserMessage)
      setCurrentMessage({ role: 'assistant', content: data.response });
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Set error message as current
      setCurrentMessage({
        role: 'assistant',
        content: 'Error: Unable to process your message.',
      });
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
        <h1>{pageTitle}</h1>
        <p>{selectedAssistant?.description || "Your AI Assistant"}</p>
        
        {/* Add the AssistantSelector component here */}
        <div className="assistant-selector-container">
          <AssistantSelector 
            onSelectAssistant={handleSelectAssistant} 
            currentAssistantId={selectedAssistant?.id}
          />
        </div>
        
        {!selectedAssistant && (
          <p className="assistant-prompt">Please select an assistant to begin chatting</p>
        )}
      </header>
      
      <ChatContainer
        historyMessages={historyMessages}
        currentMessage={currentMessage}
        previousUserMessage={previousUserMessage}
        onHideHistory={handleHideHistory}
      />
      
      <footer className="chat-input-footer">
        <ChatInput 
          onSendMessage={handleSendMessage} 
          disabled={loading || !selectedAssistant} 
          placeholder={selectedAssistant ? "Type your message here..." : "Select an assistant first"}
        />
        <p className="disclaimer">
          AI-generated content. Verify info independently. Not a substitute for licensed guidance.
        </p>
      </footer>
    </div>
  );
}