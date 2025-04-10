import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';

interface ranks {
  rank: number;
  followers: number;
  likes: number;
  user_id: number;
  username: string;
  streamedHours: number;
  score: number;
  min: string;
}

function getCurrentDateFormatted(): string {
  const date = new Date();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);
  return `${month}-${year}`;
}

const ArtTableSection = () => {
  const [selectedGenre, setSelectedGenre] = useState('Pop');
  const [rankData, setRankData] = useState<ranks[]>([]);
  const [prerankData, setPreRankData] = useState<ranks[]>([]);
  const [infoArr, setInfoArr] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const date: string = getCurrentDateFormatted();

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`/api/adminpage/artistpage`);
      const data = await response.json();
      
      setRankData(data.tranks);
      setPreRankData(data.trankspre);
      setInfoArr(data.infoarr);
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false); // Ensure loading is false in case of an error
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, selectedGenre]); // Only re-fetch when genre changes or component mounts

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre); // This will trigger a re-fetch
  };

  if (loading) {
    return <div>Loading...</div>; // Render loading state
  }

  const medainlist: number[] = [];
  let pos = -1;
  for (let i = 0; i < infoArr.length; i++) {
    for (let j = 0; j < infoArr[i].length; j++) {
      if (infoArr[i][j] == selectedGenre) {
        medainlist.push(i);
        if (pos == -1) {
          pos = i;
        }
      }
    }
  }
  if (pos == -1) { pos = 0 };

  let median = 0;
  let nft = 0;
  let nlt = 0;
  let nsht = 0;
  let gft = '0';
  let glt = '0';
  let gsht = '0';
  let nfa = 0;
  let nla = 0;
  let nsha = 0;
  let gfa = '0';
  let gla = '0';
  let gsha = '0';
  let tname = '';
  let tf = 0;
  let tl = 0;
  let tsh = 0;
  let Avgname = '';
  let af = 0;
  let al = 0;
  let ash = 0;

  if (rankData.length > 0) {
    median = medainlist[Math.floor(medainlist.length / 2)];
    // Check if rankData[pos] exists before accessing username
    if (rankData[pos]) {
      tname = rankData[pos].username.charAt(0).toUpperCase() + rankData[pos].username.slice(1);
      tf = rankData[pos].followers;
      tl = rankData[pos].likes;
      tsh = rankData[pos].streamedHours;
      nft = tf - prerankData[pos].followers;
      nlt = tl - prerankData[pos].likes
      nsht = tsh - prerankData[pos].streamedHours;
      gft = (nft / prerankData[pos].followers * 100).toFixed(2);
      glt = (nft / prerankData[pos].likes * 100).toFixed(2);
      gsht = (nft / prerankData[pos].streamedHours * 100).toFixed(2);
    }
    // Ensure rankData[median] exists before accessing username
    if (rankData[median]) {
      Avgname = rankData[median].username.charAt(0).toUpperCase() + rankData[median].username.slice(1)
      af = rankData[median].followers;
      al = rankData[median].likes;
      ash = rankData[median].streamedHours;
      nfa = af - prerankData[median].followers;
      nla = al - prerankData[median].likes
      nsha = ash - prerankData[median].streamedHours;
      gfa = (nfa / prerankData[median].followers * 100).toFixed(2);
      gla = (nfa / prerankData[median].likes * 100).toFixed(2);
      gsha = (nfa / prerankData[median].streamedHours * 100).toFixed(2);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center w-[900px] h-[750px]"
    >
      <div className="flex flex-row justify-center w-full">
        <div className="flex justify-start w-full px-4 py-2">
          <select
            className="styled-dropdown"
            value={selectedGenre}
            onChange={(e) => handleGenreChange(e.target.value)}
          >
            <option value="Pop">Pop</option>
            <option value="Hip-hop">Hip-hop</option>
            <option value="Rap">Rap</option>
            <option value="R&B">R&B</option>
            <option value="Rock">Rock</option>
            <option value="Country">Country</option>
            <option value="EDM">EDM</option>
            <option value="Jazz">Jazz</option>
          </select>
        </div>
        <div className="flex justify-end px-4 opacity-70 w-full">
          <header className="justify-end text-[20px]">{date}</header>
        </div>
      </div>
      <header className="text-[40px] mb-4">Top Artist </header>
      <table className="w-[700px] justify-center border-collapse text-center text-2xl">
        <thead>
          <tr>
            <th className="p-2 w-32 test-white text-[28px]">{tname}</th>
            <th className="p-2 border-4 border-black w-[140px]">Follows</th>
            <th className="p-2 border-4 border-black w-[110px]">Likes</th>
            <th className="p-2 border-4 border-black w-[280px]">Streaming Hours</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2 border-4 border-black text-[20px]">Total</td>
            <td className="p-2 border-4 border-black ">{tf}</td>
            <td className="p-2 border-4 border-black ">{tl}</td>
            <td className="p-2 border-4 border-black ">{tsh}</td>
          </tr>
          <tr>
            <td className="p-2 border-4 border-black text-[16px]"> New users this Quarter</td>
            <td className="p-2 border-4 border-black ">{nft}</td>
            <td className="p-2 border-4 border-black ">{nlt}</td>
            <td className="p-2 border-4 border-black ">{nsht}</td>
          </tr>

          <tr>
            <td className="p-2 border-4 border-black ="> % Growth </td>
            <td className="p-2 border-4 border-black ">{gft} </td>
            <td className="p-2 border-4 border-black ">{glt}</td>
            <td className="p-2 border-4 border-black ">{gsht}</td>
          </tr>

        </tbody>
      </table>
      <header className="text-[40px] mt-6 mb-4">Average Artist </header>
      <table className="w-[700px] justify-center border-collapse text-center text-2xl">
        <thead>
          <tr>
            <th className="p-2 w-32 text-[20px]"> {Avgname}</th>
            <th className="p-2 border-4 border-black w-[140px]">Follows</th>
            <th className="p-2 border-4 border-black w-[110px]">Likes</th>
            <th className="p-2 border-4 border-black w-[280px]">Streaming Hours</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2 border-4 border-black text-[20px]">Total</td>
            <td className="p-2 border-4 border-black ">{af}</td>
            <td className="p-2 border-4 border-black ">{al}</td>
            <td className="p-2 border-4 border-black ">{ash}</td>
          </tr>
          <tr>
            <td className="p-2 border-4 border-black text-[16px]"> New users this Quarter </td>
            <td className="p-2 border-4 border-black ">{nfa}</td>
            <td className="p-2 border-4 border-black ">{nla}</td>
            <td className="p-2 border-4 border-black ">{nsha}</td>
          </tr>

          <tr>
            <td className="p-2 border-4 border-black ="> % Growth </td>
            <td className="p-2 border-4 border-black ">{gfa}</td>
            <td className="p-2 border-4 border-black ">{gla}</td>
            <td className="p-2 border-4 border-black ">{gsha}</td>
          </tr>

        </tbody>
      </table>
    </motion.div>
  );
};

export default ArtTableSection;
