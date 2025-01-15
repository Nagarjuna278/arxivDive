// Fetch papers from the API
export const fetchPapers = async (currentPath) => {
    try {
      const response = await fetch(`${getBaseUrl(8000)}${currentPath}`);
      const data = await response.json();
      return data.results.map((result) => ({
        title: result.title,
        authors: result.authors.map((author) => author.name),
        summary: result.summary,
        published: new Date(result.published).toLocaleString(),
        id: result.id,
        url: `http://arxiv.org/pdf/${result.id}.pdf`,
      }));
    } catch (error) {
      console.error('Error fetching papers:', error);
      return [];
    }
  };
  
  export const getBaseUrl = (port) => {
    const { protocol, hostname } = window.location;
    return `${protocol}//${hostname}:${port}`;
  };

  // Fetch recommendations for a specific paper
  export const fetchPaperRecommendations = async (paperId) => {
    try {
      const response = await fetch(`${getBaseUrl(8000)}/recom/${paperId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      return null;
    }
  };