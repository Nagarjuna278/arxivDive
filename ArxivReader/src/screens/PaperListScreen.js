import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Recommend from './Recommend';
import CardView from './cardView'; // Import the CardView component
import { fetchPapers, fetchPaperRecommendations } from './services/api'; // Import API functions
import { styles } from '../styles/styles'; // Import styles

const PaperListScreen = ({ onPaperSelect }) => {
  // State management
  const [papers, setPapers] = useState([]);
  const [recommendedPapers, setRecommendedPapers] = useState(null);
  const [currentPath, setCurrentPath] = useState('');
  const [selectedPaper, setSelectedPaper] = useState(null);

  // Hooks for navigation and location
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch papers when the path changes
  useEffect(() => {
    const initializePapers = async () => {
      console.log('Fetching papers...');
      const fetchedPapers = await fetchPapers(location.pathname);
      setPapers(fetchedPapers);
      setCurrentPath(location.pathname);

      // Select the first paper by default
      if (fetchedPapers.length > 0) {
        handlePaperSelection(fetchedPapers[0]);
      }
    };

    initializePapers();
  }, [location.pathname]);

  // Handle paper selection
  const handlePaperSelection = async (paper) => {
    onPaperSelect(paper); // Notify App.js about the selected paper
    const recommendations = await fetchPaperRecommendations(paper.id);
    setRecommendedPapers(recommendations);
    setSelectedPaper(paper)
  };

  const pageurl=``;

  // Handle search form submission
  const handleSearch = (event) => {
    event.preventDefault();
    const searchValue = event.target.search.value.trim();
    if (searchValue) {
      navigate(`/search/${encodeURIComponent(searchValue)}`);
    }
  };

  return (
    <div style={styles.bodyContainer}>
      {/* Navbar with Search Bar */}
      <div style={styles.navbar}>
        <h1 style={styles.logo}> ArXiv Papers</h1>
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type="text"
            name="search"
            placeholder="Search papers..."
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchButton}>
            Search
          </button>
        </form>
      </div>

      {/* Paper List */}
      <div style={styles.paperList}>
        <CardView
          papers={papers}
          selectedPaper={selectedPaper} // No need for selectedPaper state here
          handlePaperSelection={handlePaperSelection}
        />
      </div>

      {/* Recommendations Section */}
      <div style={styles.recommendSection}>
        {recommendedPapers ? (
          <Recommend obj={recommendedPapers} />
        ) : (
          <p>No recommendations available.</p>
        )}
      </div>
    </div>
  );
};

export default PaperListScreen;