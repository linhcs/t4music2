// Example React component
import { useState } from 'react';

const DownloadPDFButton = () => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);

    const response = await fetch('/api/generate-pdf');
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'generated.pdf';
    link.click();
    
    setLoading(false);
  };

  return (
    <button onClick={handleDownload} disabled={loading}>
      {loading ? 'Generating PDF...' : 'Download PDF'}
    </button>
  );
};

export default DownloadPDFButton;
