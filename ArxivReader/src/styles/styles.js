export const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100vh',
    },
    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 20px',
      backgroundColor: '#f1f1f1',
      position: 'fixed', // Fixed position
      top: 0, // Stick to the top
      left: 0,
      right: '40%', // Span the width of the PaperListScreen (60% of the screen)
      zIndex: 1000, // Ensure it's above other content
    },
    bodyContainer: {
      width: '100%', // Set width to match PaperListScreen
      display: 'flex',
      flexDirection: 'column', // Single column layout
      flex: 1,
      position: 'relative',
      overflow: 'hidden',
      marginTop: '60px', // Add margin to account for the fixed navbar height
    },
    paperList: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflowY: 'auto', // Enable scrolling
      paddingTop: '10px', // Add padding to prevent content from going under the navbar
      paddingBottom: '200px', // Add padding to prevent content from overlapping the recommendation section
    },
    recommendSection: {
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderTop: '1px solid #ccc',
      position: 'fixed', // Fixed position
      bottom: 0, // Stick to the bottom
      left: 0,
      right: '40%', // Span the width of the PaperListScreen (60% of the screen)
      zIndex: 20, // Ensure it's above the paper list
    },
    searchForm: {
      display: 'flex',
      alignItems: 'center',
    },
    searchInput: {
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      marginRight: '10px',
      width: '300px',
    },
    searchButton: {
      padding: '8px 16px',
      borderRadius: '4px',
      border: 'none',
      backgroundColor: '#007bff',
      color: '#fff',
      cursor: 'pointer',
    },
    logo: {
      margin: 0,
      fontSize: '24px',
      color: '#333',
    },
  };