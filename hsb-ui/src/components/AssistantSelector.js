import { useState, useEffect } from 'react';
import { getAssistants } from '@/services/api';

export default function AssistantSelector({ onSelectAssistant, currentAssistantId }) {
  const [assistants, setAssistants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Fetch assistants when component mounts
    const fetchAssistants = async () => {
      try {
        setLoading(true);
        const assistantsList = await getAssistants();
        console.log('Fetched assistants:', assistantsList);
        setAssistants(assistantsList);
        setError(null);
      } catch (error) {
        console.error('Error fetching assistants:', error);
        setError('Failed to load assistants. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAssistants();
  }, []);
  
  const handleChange = (e) => {
    const selectedId = e.target.value;
    // Find the selected assistant object
    const selectedAssistant = assistants.find(assistant => assistant.id === selectedId);
    
    if (selectedAssistant) {
      console.log('Selected assistant:', selectedAssistant);
      onSelectAssistant(selectedAssistant);
    }
  };
  
  if (loading) {
    return <div className="assistant-selector loading">Loading assistants...</div>;
  }
  
  if (error) {
    return <div className="assistant-selector error">{error}</div>;
  }
  
  return (
    <div className="assistant-selector">
      <label htmlFor="assistant-select">Select an assistant:</label>
      <select 
        id="assistant-select" 
        onChange={handleChange}
        value={currentAssistantId || ''}
      >
        <option value="" disabled>Choose an assistant</option>
        {assistants.map((assistant) => (
          <option key={assistant.id} value={assistant.id}>
            {assistant.name} ({assistant.model})
          </option>
        ))}
      </select>
    </div>
  );
}