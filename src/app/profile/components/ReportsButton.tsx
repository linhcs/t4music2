import { Button } from "@/components/ui/button";
import { useState } from 'react';
import { useUserStore } from "@/store/useUserStore";


const DownloadPDFButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const {username} = useUserStore();

  const handleDownload = async () => {
    setLoading(true);
    

    const response = await fetch('/api/pdfs/listner', {
      method: 'POST',  // Assuming a POST request
      headers: {
        'Content-Type': 'application/json',
    },
        body: JSON.stringify({ username }),
    });

    if (response.ok) {
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'generated.pdf';
      link.click();
    }
    setLoading(false);
  };

  return (
    <div>
      <Button onClick={handleDownload} disabled={loading}
      size="lg"
      variant="outline"
      className="rounded-full text-[20px] px-7 py-7 font-semibold text-white border border-white/10 transition-all duration-300 hover:scale-90 
        bg-gradient-to-r from-rose-400 via-purple-400 to-blue-400 animate-gradient"      
      >
      {loading ? 'Generating PDF...' : 'Download PDF'}
      </Button>
    </div>
  );
};

export default function ReportsButton() {
    return (
      <DownloadPDFButton />
    );
  }

