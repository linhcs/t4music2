import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { useMemo } from 'react';

const quartes : string[] = ['Q1 - 2024', 'Q2 - 2024', 'Q3 - 2024','Q4 - 2024','Q1 - 2025','Q2 - 2025'];


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

// function getCurrentDateFormatted(): string {
//   const date = new Date();
//   const month = (date.getMonth() + 1).toString().padStart(2, '0');
//   const year = date.getFullYear().toString().slice(-2);
//   return `${month}-${year}`;
// }

  const ArtTableSection = () => {
  const [selectedGenre, setSelectedGenre] = useState('Pop');
  const [selectedDate, setSelectedDate] = useState(quartes[5]);
  const [rankData, setRankData] = useState<ranks[]>([]);
  const [prerankData, setPreRankData] = useState<ranks[]>([]);
  const [infoArr, setInfoArr] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true); // Add loading state

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`/api/adminpage/artistpage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period: selectedDate }),
      });
      const data = await response.json();
      
      setRankData(data.tranks);
      setPreRankData(data.alignedTrankspre);
      setInfoArr(data.infoarr);
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false); // Ensure loading is false in case of an error
    }
  }, [selectedDate]);

  const uniqueGenres = useMemo(() => {
    if (!Array.isArray(infoArr)) return [];
  
    const flatGenres = infoArr.flat(); // safely flatten
    const uniqueSet = new Set(flatGenres);
    return Array.from(uniqueSet).sort();
  }, [infoArr]);

  

  useEffect(() => {
    fetchData();
  }, [fetchData, selectedGenre, selectedDate]); 
  
  

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre); // This will trigger a re-fetch
  };
  const handleDateChange = (date: string) => {
    setSelectedDate(date);
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
  if(medainlist.length == 0){medainlist.push(0)};

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
  let pft = 0;
  let plt = 0;
  let psht = 0;
  let pfa = 0;
  let pla = 0;
  let psha = 0;
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
      pft = prerankData[pos].followers;
      plt = prerankData[pos].likes;
      psht = prerankData[pos].streamedHours;
      nft = tf - pft;
      nlt = tl - plt
      nsht = tsh - prerankData[pos].streamedHours;
      gft = (nft !== tf ?(nft / pft * 100).toFixed(2): '0');
      glt = (nlt !== tl ?(nlt / plt * 100).toFixed(2): '0');
      gsht = (nsht !== tsh ?(nsht / psht * 100).toFixed(2): '0');
    }
    // Ensure rankData[median] exists before accessing username
    if (rankData[median]) {
      Avgname = rankData[median].username.charAt(0).toUpperCase() + rankData[median].username.slice(1)
      af = rankData[median].followers;
      al = rankData[median].likes;
      ash = rankData[median].streamedHours;
      pfa = prerankData[median].followers;
      pla = prerankData[median].likes;
      psha = prerankData[median].streamedHours;
      nfa = af - pfa;
      nla = al - pla;
      nsha = ash - psha;
      gfa = (nfa !== af ?(nfa / pfa * 100).toFixed(2): '0');
      gla = (nla !== al ?(nla / pla * 100).toFixed(2): '0');
      gsha = (nsha !== ash ?(nsha / psha * 100).toFixed(2): '0');
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center w-full"
    >
      <div className="flex flex-row justify-center w-full ">
        <div className="flex justify-start w-full py-2">
          <select
            className="styled-dropdown"
            value={selectedGenre}
            onChange={(e) => handleGenreChange(e.target.value)}
          >
            {uniqueGenres.map((genre, index) => (
              <option key={index} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end w-full px-4 py-2">
          <select
            className="styled-dropdown"
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
          >
            {quartes.map((quarter, index) => (
              <option key={index} value={quarter}>
                {quarter}
              </option>
            ))}
          </select>
        </div>
      </div>
      <header className="text-[40px] mb-4">Top Artist </header>
      <table className="justify-center border-collapse text-center text-2xl">
        <thead>
          <tr>
            <th className="p-2 w-50 test-white text-[28px] whitespace-nowrap">{tname.replace(/[_\.]/g, ' ')}</th>
            <th className="p-2 border-4 border-black w-[140px]">Follows</th>
            <th className="p-2 border-4 border-black w-[110px]">Likes</th>
            <th className="p-2 border-4 border-black w-[280px]">Streaming Hours</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2 border-4 border-black text-[20px]">Total in {selectedDate}</td>
            <td className="p-2 border-4 border-black ">{tf}</td>
            <td className="p-2 border-4 border-black ">{tl}</td>
            <td className="p-2 border-4 border-black ">{tsh}</td>
          </tr>
          <tr>
            <td className="p-2 border-4 border-black text-[20px]">Previous Quarter</td>
            <td className="p-2 border-4 border-black ">{pft}</td>
            <td className="p-2 border-4 border-black ">{plt}</td>
            <td className="p-2 border-4 border-black ">{psht}</td>
          </tr>
          <tr>
            <td className="p-2 border-4 border-black text-[18px]"> New users this Quarter</td>
            <td className="p-2 border-4 border-black ">{nft}</td>
            <td className="p-2 border-4 border-black ">{nlt}</td>
            <td className="p-2 border-4 border-black ">{nsht}</td>
          </tr>

          <tr>
            <td className="p-2 border-4 border-black "> % Growth </td>
            <td className="p-2 border-4 border-black ">{gft} </td>
            <td className="p-2 border-4 border-black ">{glt}</td>
            <td className="p-2 border-4 border-black ">{gsht}</td>
          </tr>

        </tbody>
      </table>
      <header className="text-[40px] mt-6 mb-4">Average Artist </header>
      <table className=" justify-center border-collapse text-center text-2xl">
        <thead>
          <tr>
            <th className="p-2 w-50 text-[20px] whitespace-nowrap"> {Avgname.replace(/[_\.]/g, ' ')}</th>
            <th className="p-2 border-4 border-black w-[140px]">Follows</th>
            <th className="p-2 border-4 border-black w-[110px]">Likes</th>
            <th className="p-2 border-4 border-black w-[280px]">Streaming Hours</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2 border-4 border-black text-[20px]">Total in {selectedDate}</td>
            <td className="p-2 border-4 border-black ">{af}</td>
            <td className="p-2 border-4 border-black ">{al}</td>
            <td className="p-2 border-4 border-black ">{ash}</td>
          </tr>
          <tr>
            <td className="p-2 border-4 border-black text-[20px]">Previous Quarter</td>
            <td className="p-2 border-4 border-black ">{pfa}</td>
            <td className="p-2 border-4 border-black ">{pla}</td>
            <td className="p-2 border-4 border-black ">{psha}</td>
          </tr>
          <tr>
            <td className="p-2 border-4 border-black text-[18px]"> New users this Quarter </td>
            <td className="p-2 border-4 border-black ">{nfa}</td>
            <td className="p-2 border-4 border-black ">{nla}</td>
            <td className="p-2 border-4 border-black ">{nsha}</td>
          </tr>
          <tr>
            <td className="p-2 border-4 border-black "> % Growth </td>
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
