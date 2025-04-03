import axios from 'axios';

const API_URL = '/api';

// Send a message to the assistant
export const sendMessage = async (message, threadId = null) => {
  try {
    const response = await axios.post(`${API_URL}/chat`, {
      message,
      thread_id: threadId
    });
    
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
