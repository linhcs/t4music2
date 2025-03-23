'use client';

import { useState } from 'react';

// order is 'Id','Username','Email','role','Created'
// order is  0      1         2        3      4
let selectarr = [false,false,false,false,false];

const CheckboxTable = () => {
  const [selectArr, setSelectArr] = useState(selectarr);

  // Handle checkbox toggle
  const handleCheckboxChange = (index: any) => {
    const updatedArr = [...selectArr];
    updatedArr[index] = !updatedArr[index]; // Toggle the value at the clicked index
    setSelectArr(updatedArr);
  };

  return (
    <div>
      {/* Table with checkboxes */}
      <table className="checkbox-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Created</th>
            <th>Select</th> {/* Column for checkboxes */}
          </tr>
        </thead>
        <tbody>
          {/* Render each row with a checkbox */}
          {['Id', 'Username', 'Email', 'Role', 'Created'].map((col, index) => (
            <tr key={index}>
              <td>{col}</td>
              <td>
                <input
                  type="checkbox"
                  checked={selectArr[index]}
                  onChange={() => handleCheckboxChange(index)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


const DownloadPDFButton = () => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);

    const response = await fetch('/api/pdfs/admin');
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

const App = () => {
  return (
    <div className = "flex-1 px-80 py-20">
      <CheckboxTable /> {/* Render the table with checkboxes */}
      <DownloadPDFButton /> {/* Render the download button */}
    </div>
  );
};

export default App;
