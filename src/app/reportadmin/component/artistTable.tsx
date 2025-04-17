import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import FollowerListSection from './followsTable';
import LikeListSection from './likesTable';
import StreamHourListSection from './streamingHoursTable';
import SongsTable from './popsongs';

let ref = 0;

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ChartDataLabels);

const months: string[] = [
  'January 2024', 'February 2024', 'March 2024', 'April 2024', 'May 2024', 'June 2024',
  'July 2024', 'August 2024', 'September 2024', 'October 2024', 'November 2024', 'December 2024',
  'January 2025', 'February 2025', 'March 2025', 'April 2025', 'May 2025'
];


interface ranks { rank: number; followers: number; likes: number; user_id: number; username: string; streamedHours: number; score: number; min: string; }
interface popular { genre: string; plays: number; hours: number };
interface spopular { title: string; plays: number };

const ArtTableSection = () => {
  const [selectedGenre, setSelectedGenre] = useState('dance');
  const [selectedDate, setSelectedDate] = useState(months[16]); 
  const [selectedDate2, setSelectedDate2] = useState(months[16]);
  const [rankData, setRankData] = useState<ranks[]>([]);
  const [prerankData, setPreRankData] = useState<ranks[]>([]);
  const [infoArr, setInfoArr] = useState<string[][]>([]);
  const [popularArr, setpopularArr] = useState<popular[]>([]);
  const [spopularArr, setspopularArr] = useState<spopular[]>([]);
  const [sortMethod, setSortMethod] = useState<'alphabetical' | 'hours'>('hours');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFollowers, setShowFollowers] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const [showStreamingHours, setShowStreamingHours] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`/api/adminpage/artistpage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period: selectedDate, period2: selectedDate2}),
      });
      const data = await response.json();

      setRankData(data.tranks);
      setPreRankData(data.alignedTrankspre);
      setInfoArr(data.infoarr);
      setpopularArr(data.popular);
      setspopularArr(data.popsongs);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  }, [selectedDate, selectedDate2]);

  const uniqueGenres = useMemo(() => {
    if (!Array.isArray(infoArr)) return [];

    const flatGenres = infoArr.flat(); // safely flatten
    const uniqueSet = new Set(flatGenres);
    return Array.from(uniqueSet).sort();
  }, [infoArr]);

  const handleShowFollowers = () => {
    ref = pos;
    setShowFollowers(true);
  };
  const handleShowLikes = () => {
    ref = pos;
    setShowLikes(true);
  };
  const handleShowStreamingHours = () => {
    ref = pos;
    setShowStreamingHours(true);
  };

  const handleShowFollowers2 = () => {
    ref = median;
    setShowFollowers(true);
  };
  const handleShowLikes2 = () => {
    ref = median;
    setShowLikes(true);
  };
  const handleShowStreamingHours2 = () => {
    ref = median;
    setShowStreamingHours(true);
  };

  const handleBack = () => {
    setShowFollowers(false);
    setShowLikes(false);
    setShowStreamingHours(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [fetchData, selectedGenre, selectedDate, selectedDate2]);

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre); // This will trigger a re-fetch
  };
  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };
  const handleDateChange2 = (date: string) => {
    setSelectedDate2(date);
  };

  const genreLabels = popularArr.map(item => item.genre);
  const playData = popularArr.map(item => item.plays);
  const hourData = popularArr.map(item => item.hours);
  const data = {
    labels: genreLabels,
    datasets: [{ label: 'Plays', data: playData, backgroundColor: 'rgba(59, 130, 246, 0.7)', },
    { label: 'Streamed Hours', data: hourData, backgroundColor: 'rgba(16, 185, 129, 0.7)', }]
  };
  const options = {
    responsive: true,
    indexAxis: 'y' as const,
    layout: { padding: { right: 40 } },
    scales: {
      x: { beginAtZero: true, grid: { color: 'rgba(200,200,200,0.2)' } },
      y: { ticks: { font: { size: 14 }, color: 'rgba(255,255,255,1)' } }
    },
    plugins: {
      legend: { position: 'top' as const, labels: { color: 'rgba(255,255,255,1)', font: { size: 18, weight: 'bold' as const } } },
      tooltip: {
        callbacks: {
          label: function (context: any) { return `${context.dataset.label}: ${context.parsed.x}`; }
        }
      },
      datalabels: {
        anchor: 'end' as const, align: 'end' as const, color: 'rgba(255,255,255,1)',
        font: { weight: 'bold' as const, size: 14 },
        formatter: (value: number) => `${value}`
      }
    }
  };

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
  if (medainlist.length == 0) { medainlist.push(0) };

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
      gft = (nft !== tf ? (nft / pft * 100).toFixed(2) : '0');
      glt = (nlt !== tl ? (nlt / plt * 100).toFixed(2) : '0');
      gsht = (nsht !== tsh ? (nsht / psht * 100).toFixed(2) : '0');
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
      gfa = (nfa !== af ? (nfa / pfa * 100).toFixed(2) : '0');
      gla = (nla !== al ? (nla / pla * 100).toFixed(2) : '0');
      gsha = (nsha !== ash ? (nsha / psha * 100).toFixed(2) : '0');
    }
  }

  return (
    <div className="flex flex-col items-center w-full mb-4">
      <div className="flex justify-end w-full px-4 py-2">
        <select
          className="styled-dropdown"
          value={selectedDate2}
          onChange={(e) => handleDateChange2(e.target.value)}
        >
          {months.map((month, index) => (
            <option key={index} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>
      <header className="text-[36px] mb">Most Popular Genres by</header>
      <p className="text-2xl text-white mb-1 px-4 text-center max-w-3xl">
        Click either to remove!
      </p>
      <div className="w-full max-w-4xl px-4 mb-8">
        <Bar data={data} options={options} plugins={[ChartDataLabels]} />
      </div>
      <div>
      <SongsTable songs={spopularArr} />

      </div>
      <div className="flex flex-col items-center w-full mb-4">
        {showFollowers ? (
          <FollowerListSection passedid={rankData[ref].user_id} onBack={handleBack} />
        ) : showLikes ? (
          <LikeListSection passedid={rankData[ref].user_id} onBack={handleBack} />
        ) : showStreamingHours ? (
          <StreamHourListSection passedid={rankData[ref].user_id} onBack={handleBack} />
        ) : (
          // the rest of your main content

          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: loading ? 0 : 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              layout
              className="flex flex-col items-center w-full mb-4"
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
                    {months.map((month, index) => (
                      <option key={index} value={month}>
                        {month}
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
                    <th
                      className="p-2 border-4 border-black w-[140px] cursor-pointer hover:text-blue-400"
                      onClick={handleShowFollowers}
                    >
                      Follows
                    </th>
                    <th
                      className="p-2 border-4 border-black w-[110px] cursor-pointer hover:text-pink-400"
                      onClick={handleShowLikes}
                    >
                      Likes
                    </th>
                    <th
                      className="p-2 border-4 border-black w-[280px] cursor-pointer hover:text-green-400"
                      onClick={handleShowStreamingHours}
                    >
                      Streaming Hours
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border-4 border-black text-[20px]">Total by {selectedDate}</td>
                    <td className="p-2 border-4 border-black ">{tf}</td>
                    <td className="p-2 border-4 border-black ">{tl}</td>
                    <td className="p-2 border-4 border-black ">{tsh}</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-4 border-black text-[20px]">Previous Month</td>
                    <td className="p-2 border-4 border-black ">{pft}</td>
                    <td className="p-2 border-4 border-black ">{plt}</td>
                    <td className="p-2 border-4 border-black ">{psht}</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-4 border-black text-[18px]"> New users this Quarter</td>
                    <td className="p-2 border-4 border-black ">{nft}</td>
                    <td className="p-2 border-4 border-black ">{nlt}</td>
                    <td className="p-2 border-4 border-black ">{nsht.toFixed(2)}</td>
                  </tr>

                  <tr>
                    <td className="p-2 border-4 border-black "> % Growth </td>
                    <td className="p-2 border-4 border-black ">{gft} </td>
                    <td className="p-2 border-4 border-black ">{glt}</td>
                    <td className="p-2 border-4 border-black ">{gsht}</td>
                  </tr>

                </tbody>
              </table>
              <header className="text-[40px] mt-6 mb-4">Average {selectedGenre} Artist </header>
              <table className=" justify-center border-collapse text-center text-2xl">
                <thead>
                  <tr>
                    <th className="p-2 w-50 text-[22px] whitespace-nowrap"> {Avgname.replace(/[_\.]/g, ' ')}</th>
                    <th
                      className="p-2 border-4 border-black w-[140px] cursor-pointer hover:text-blue-400"
                      onClick={handleShowFollowers2}
                    >
                      Follows
                    </th>
                    <th
                      className="p-2 border-4 border-black w-[110px] cursor-pointer hover:text-pink-400"
                      onClick={handleShowLikes2}
                    >
                      Likes
                    </th>
                    <th
                      className="p-2 border-4 border-black w-[280px] cursor-pointer hover:text-green-400"
                      onClick={handleShowStreamingHours2}
                    >
                      Streaming Hours
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border-4 border-black text-[20px]">Total by {selectedDate}</td>
                    <td className="p-2 border-4 border-black ">{af}</td>
                    <td className="p-2 border-4 border-black ">{al}</td>
                    <td className="p-2 border-4 border-black ">{ash}</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-4 border-black text-[20px]">Previous Month</td>
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
          </>
        )}
      </div>
    </div>
  );
};

export default ArtTableSection;
