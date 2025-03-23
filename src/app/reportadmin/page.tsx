'use client';
import { useState } from 'react';

const CheckboxTable = ({ selectArr, handleCheckboxChange }: any) => {
  return (
    <div>
      <h2>Select what you want to see</h2>
      <table className="checkbox-table">
        <thead>
          <tr>
            <th>Attribute</th>
            <th>Select</th>
          </tr>
        </thead>
        <tbody>
          {['User ID', 'Username', 'Email', 'Role', 'Created'].map((col, index) => (
            <tr key={index}>
              <td>{col}</td>
              <td className='px-8'>
                <input
                  type="checkbox"
                  checked={selectArr[index]} // Checked state based on selectArr
                  onChange={() => handleCheckboxChange(index)} // Update selectArr on toggle
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const DownloadPDFButton = ({ updatedArr }: any) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);

    const response = await fetch('/api/pdfs/admin', {
      method: 'POST',  // Assuming a POST request
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ updatedArr }), // Send updated selectArr in the request body
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
    <div className='mt-10'>
      <button onClick={handleDownload} disabled={loading}>
        {loading ? 'Generating PDF...' : 'Download PDF'}
      </button>
    </div>
  );
};

const ReportAdminPage = () => {
  // Initialize selectArr with 5 values (false by default)
  const [selectArr, setSelectArr] = useState([false, false, false, false, false]);

  // Handle checkbox change to update the selectArr array
  const handleCheckboxChange = (index: number) => {
    const updatedArr = [...selectArr];
    updatedArr[index] = !updatedArr[index]; // Toggle the value at the clicked index
    setSelectArr(updatedArr);

    // Log the updated array to the console to check
    console.log("Updated selectArr:", updatedArr);
  };

  return (
    <div className='flex-1 px-80'>
      <CheckboxTable selectArr={selectArr} handleCheckboxChange={handleCheckboxChange} />
      <DownloadPDFButton updatedArr={selectArr} /> {/* Pass updatedArr as prop */}
    </div>
  );
};

export default ReportAdminPage;
