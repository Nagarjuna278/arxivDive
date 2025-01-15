import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PaperListScreen from './screens/PaperListScreen';
import PDFViewerScreen from './screens/PDFViewerScreen';

const App = () => {
  console.log("inside APP");
  const [selectedPaper, setSelectedPaper] = useState(null);

  // Callback function to handle paper selection
  const handlePaperSelect = (paper) => {
    setSelectedPaper(paper);
  };

  return (
    <Router>
      <div style={styles.container}>
        {/* Left Panel: Paper List */}
        <div style={styles.paperList}>
          <PaperListScreen onPaperSelect={handlePaperSelect} />
        </div>

        {/* Right Panel: PDF Viewer */}
        <div style={styles.pdfViewerSection}>
          {selectedPaper ? (
            <PDFViewerScreen url={selectedPaper.url} title={selectedPaper.title} />
          ) : (
            <p>Select a paper to view its PDF.</p>
          )}
        </div>
      </div>
    </Router>
  );
};

const styles = {
  container: {
    display: 'flex',
    height: '100vh', // Full height of the viewport
  },
  paperList: {
    width: '60%', // Set width to 60% of the screen
    overflowY: 'auto', // Enable scrolling if content overflows
    // borderRight: '1px solid #ccc', // Optional: add a border between sections
    padding: '10px', // Optional: padding for better spacing
  },
  pdfViewerSection: {
    width: '40%', // Fixed width for PDF viewer
    // borderLeft: '1px solid #ccc',
    overflow: 'hidden',
    padding: '10px',
  },
};

export default App;