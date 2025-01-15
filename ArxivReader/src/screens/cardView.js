import React, { useState } from 'react';
import '../styles/CardView.css'
import { getBaseUrl } from './services/api';
const CardView = ({ papers, selectedPaper, handlePaperSelection }) => {
  const [summary, setSummary] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState({});

  const handleSubmit = async (textToSummarize, itemId) => {
    setError(null);
    setLoading((prevLoading) => ({ ...prevLoading, [itemId]: true }));

    try {
      const response = await fetch(`${getBaseUrl(8000)}/summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: textToSummarize }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSummary((previousSummaries) => ({
        ...previousSummaries,
        [itemId]: data.summary[0].summary_text,
      }));
    } catch (err) {
      console.error('Error fetching summary:', err);
      setError(err.message);
    } finally {
      setLoading((prevLoading) => ({ ...prevLoading, [itemId]: false }));
    }
  };
  return (
    <div className="paperList">
      {papers.map((item) => (
        <div key={item.id} className="card">
          <button
            onClick={() => handlePaperSelection(item)}
            className={`title ${selectedPaper && selectedPaper.id === item.id ? 'selected' : ''}`}
          >
            {item.title}
          </button>
          <p>Authors: {item.authors.join(', ')}</p>
          <p>{summary[item.id] ? summary[item.id] : item.summary}</p>
          <p>Published: {item.published}</p>
          <div
            onClick={() => handleSubmit(item.summary, item.id)}
            className={`symbol ${loading[item.id] ? 'glowing' : ''}`}
          >
            {loading[item.id] ? (
              <span className="spinner"></span>
            ) : summary[item.id] ? (
              <span className="checkmark">✔</span>
            ) : (
              <span className="symbolText">★</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardView;
