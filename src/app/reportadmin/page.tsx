'use client';
import { Button } from "@/components/ui/button";
import { listeners } from "process";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { useEffect, useState } from 'react';
import InactivityTimer from "@/app/reportadmin/component/page";

interface listeners {
  user_id: number;
  username: string;
}

interface artists {
  user_id: number;
  username: string;
}

interface albums {
  user_id: number;
  album_id: number;
  title: string;
}

type PassedObj = listeners | artists | albums;

// Type guard to check if the object is an album
function isAlbum(obj: PassedObj): obj is albums {
  return (obj as albums).title !== undefined;
  
}

function isUser(obj: PassedObj): obj is listeners | artists {
  return (obj as listeners | artists).username !== undefined;
}

const CheckboxTable: React.FC<{
  selectArr: boolean[]; // Array of booleans for the checkboxes
  handleCheckboxChange: (index: number) => void; // Function that takes a number (index) and returns void
}> = ({ selectArr, handleCheckboxChange }) => {
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

const DownloadPDFButton: React.FC<{ updatedArr : boolean[]; }> = ({ updatedArr }) => {
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
      <Button onClick={handleDownload} disabled={loading}
      size="lg"
      variant="outline"
      className="rounded-full text-[17px] text-white border border-white/10 transition-all duration-300 hover:scale-90 
      bg-gradient-to-r from-rose-400 via-purple-400 to-blue-400 animate-gradient"         
      >
      {loading ? 'Generating PDF...' : 'Download PDF'}
      </Button>
    </div>
  );
};

const ReportAdminPage = () => {
  const router = useRouter();
  const { role } = useUserStore();
  useEffect(() => {
    if (role !== 'admin') {
      router.push("/login");
    }
  }, [role, router]);
  // Initialize selectArr with 5 values (false by default)
  const [selectArr, setSelectArr] = useState([false, false, false, false, false]);
  const [listeners, setListeners] = useState<listeners[]>([]);
  const [artists, setartists] = useState<artists[]>([]);
  const [albums, setalbums] = useState<albums[]>([]);
  const [selectedobj, setSelectedobj] = useState<listeners | artists | albums | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const responseListeners = await fetch('/api/adminpage/listeners');
      const dataListeners: listeners[] = await responseListeners.json();
      setListeners(dataListeners); // Set the listeners data

      const responseArtists = await fetch('/api/adminpage/artists');
      const dataArtists: artists[] = await responseArtists.json();
      setartists(dataArtists); // Set the artists data

      const responseAlbums = await fetch('/api/adminpage/albums');
      const dataAlbums: albums[] = await responseAlbums.json();
      setalbums(dataAlbums); // Set the albums data
    };

    fetchData(); // Fetch the data when the component mounts
  }, []);

  // Handle checkbox change to update the selectArr array
  const handleCheckboxChange = (index: number) => {
    const updatedArr: boolean[] = [...selectArr];
    updatedArr[index] = !updatedArr[index]; // Toggle the value at the clicked index
    setSelectArr(updatedArr);
  };

  // Handle selecting a user
  const handleUserClick = (obj: listeners | artists | albums) => {
    if (selectedobj === obj) {
      setSelectedobj(null);
    } else {
      setSelectedobj(obj);  // Set the clicked user as selected
    }
  };

  // Handle deletion of the selected user
  const handleDeleteUser = async () => {
    if (selectedobj !== null) {
      
      if (isAlbum(selectedobj)) {
        
        const confirmed = window.confirm(`Are you sure you want to Delete ${selectedobj.title}?`);
        
        if (confirmed) {
          // Send the delete request to the server
          const response = await fetch('/api/adminpage/delete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ selectedobj }), // Send the selected object to delete
          });

          if (response.ok) {
            alert(`${selectedobj.title} has been removed`);

            // Clear the selected user
            setSelectedobj(null);

            // Fetch updated data after deletion
            await fetchData();
          } else {
            alert("Action Failed.");
          }
        } else {
          alert("Action canceled.");
        }
      }
     else if (isUser(selectedobj)) {
      
        const confirmed = window.confirm(`Are you sure you want to Delete ${selectedobj.username}?`);
        
        if (confirmed) {
          // Send the delete request to the server
          const response = await fetch('/api/adminpage/delete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ selectedobj }), // Send the selected object to delete
          });

          if (response.ok) {
            alert(`${selectedobj.username} has been removed`);

            // Clear the selected user
            setSelectedobj(null);

            // Fetch updated data after deletion
            await fetchData();
          } else {
            alert("Action Failed.");
          }
        } else {
          alert("Action canceled.");
        }
     }
    } else {
      alert("Please select something first.");
    }
  };

  // Fetch the updated data for listeners, artists, and albums after deletion
  const fetchData = async () => {
    const responseListeners = await fetch('/api/adminpage/listeners');
    const dataListeners: listeners[] = await responseListeners.json();
    setListeners(dataListeners);

    const responseArtists = await fetch('/api/adminpage/artists');
    const dataArtists: artists[] = await responseArtists.json();
    setartists(dataArtists);

    const responseAlbums = await fetch('/api/adminpage/albums');
    const dataAlbums: albums[] = await responseAlbums.json();
    setalbums(dataAlbums);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <InactivityTimer />
      <div className="flex space-x-4 p-5 px-[320px] py-20">
        {/* Window 1: Users */}
        <div className="w-[250px] h-[350px] overflow-y-auto border border-gray-300 p-2 px-[22px]">
          <h3 className="text-center text-lg font-bold">Listeners</h3>
          <ul>
            {listeners.map((listener) => (
              <li
                key={listener.user_id}
                className={`py-1 cursor-pointer ${listener === selectedobj ? "border-2 border-red-500" : ""}`}
                onClick={() => handleUserClick(listener)}
              >
                {`${listener.user_id} - ${listener.username}`}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-[250px] h-[350px] overflow-y-auto border border-gray-300 p-2 px-[22px]">
          <h3 className="text-center text-lg font-bold">Artists</h3>
          <ul>
            {artists.map((artist) => (
              <li
                key={artist.user_id}
                className={`py-1 cursor-pointer ${artist === selectedobj ? "border-2 border-red-500" : ""}`}
                onClick={() => handleUserClick(artist)}
              >
                {`${artist.user_id} - ${artist.username}`}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-[250px] h-[350px] overflow-y-auto border border-gray-300 p-2 px-[22px]">
          <h3 className="text-center text-lg font-bold">Other Data</h3>
          <ul>
            {albums.map((album) => (
              <li
                key={album.album_id}
                className={`py-1 cursor-pointer ${album === selectedobj ? "border-2 border-red-500" : ""}`}
                onClick={() => handleUserClick(album)}
              >
                {`${album.album_id} - ${album.title}`}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex px-80 mb-8">
        <Button
          onClick={handleDeleteUser}
          size="lg"
          variant="outline"
          className="rounded-full text-[17px] text-white border border-white/10 transition-all duration-300 hover:scale-90 bg-gradient-to-r from-rose-400 via-purple-400 to-blue-400 animate-gradient"
        >
          Delete User
        </Button>
      </div>

      <div className="px-[310px] mb-12">
        <CheckboxTable selectArr={selectArr} handleCheckboxChange={handleCheckboxChange} />
        <DownloadPDFButton updatedArr={selectArr} />
      </div>
    </div>
  );
};

export default ReportAdminPage;

