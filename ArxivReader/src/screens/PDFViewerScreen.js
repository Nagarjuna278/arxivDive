import React from 'react';

const PDFViewerScreen = ({ url, title }) => {
  if (!url) {
    return <div>Error: No PDF URL provided.</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2>{title}</h2>
      <embed src={url} type="application/pdf" width="100%" height="600px" />
    </div>
  );
};

export default PDFViewerScreen;