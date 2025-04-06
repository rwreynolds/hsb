import axios from 'axios';

const API_URL = '/api';

// Send a message to the assistant
export const sendMessage = async (message, threadId = null, assistantId = null) => {
  try {
    // Debug logging
    console.log('Sending message with params:', {
      message,
      thread_id: threadId,
      assistant_id: assistantId
    });
    
    const response = await axios.post(`${API_URL}/chat`, {
      message,
      thread_id: threadId,
      assistant_id: assistantId
    });
    
    console.log('API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Get messages from a specific thread
export const getThreadMessages = async (threadId) => {
  try {
    const response = await axios.get(`${API_URL}/threads/${threadId}`);
    return response.data.messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Get all threads
export const getThreads = async () => {
  try {
    const response = await axios.get(`${API_URL}/threads`);
    return response.data.threads;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Get all available assistants
export const getAssistants = async () => {
  try {
    const response = await axios.get(`${API_URL}/assistants`);
    return response.data.assistants;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};