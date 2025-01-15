import React, { useState, useEffect } from 'react';
import { getBaseUrl } from './services/api';
const PaperCard = ({ paperId }) => {
  const [paperInfo, setPaperInfo] = useState(null);

  useEffect(() => {
    const fetchPaperInfo = async () => {
      try {
        const response = await fetch(`${getBaseUrl(8000)}/paper/${paperId}`);
        const data = await response.json();
        console.log(data);
        setPaperInfo(data);
      } catch (error) {
        console.error(`Error fetching paper info for ${paperId}:`, error);
      }
    };

    fetchPaperInfo();
  }, [paperId]);

  if (!paperInfo) {
    return <div>Loading...</div>;
  }

  // Construct the citation
  const citation = `${paperInfo.results[0].title}, ${new Date(
    paperInfo.results[0].published
  ).toLocaleDateString()}`;

  // Construct the URL with a custom path
  const paperUrl = `/paper/${paperId}`; // Custom path for your application

  return (
    <div style={styles.citation}>
      <a href={paperUrl} style={styles.link}>
        {citation}
      </a>
    </div>
  );
};

const Recommend = ({ obj }) => {
  if (obj.similar_ids.length === 0) {
    return <div>No Recommendations</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Recommended Papers</h2>
      <div style={styles.citationContainer}>
        {obj.similar_ids.map((paperId) => (
          <PaperCard key={paperId} paperId={paperId} />
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontSize: '14px',
    // padding: '10px', // Add some padding around the container
  },
  header: {
    fontSize: '16px',
    marginBottom: '10px', // Add some margin below the header
  },
  citationContainer: {
    display: 'flex',
    flexDirection: 'column', // Display citations in a vertical list
    gap: '8px', // Add space between citations
  },
  citation: {
    padding: '2px 0', // Add padding to each citation
  },
  link: {
    color: '#007bff', // Blue color for hyperlinks
    textDecoration: 'none', // Remove underline
  },
};

export default Recommend;