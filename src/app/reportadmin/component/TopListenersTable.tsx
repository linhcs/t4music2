'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaTrashAlt } from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const months = [
  'January 2024','February 2024','March 2024','April 2024',
  'May 2024','June 2024','July 2024','August 2024',
  'September 2024','October 2024','November 2024','December 2024',
  'January 2025','February 2025','March 2025','April 2025','May 2025',
];

interface TopListener {
  user_id: number;
  username: string;
  email: string;
  plays: number;
  streamingHours: number;
}

interface Props {
  period: string;
  showAllListeners: boolean;
  setShowAllListeners: (val: boolean) => void;
}

export default function TopListenersTable({ period, showAllListeners, setShowAllListeners }: Props) {
  const [data, setData] = useState<TopListener[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartData<'bar', number[], string>>({
    labels: [],
    datasets: [{
      label: 'Streamed Hours',
      data: [],
      backgroundColor: [],
      borderColor: [],
      borderWidth: 2,
    }],
  });

  const options: ChartOptions<'bar'> = {
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: '#fff', font: { weight: 'bold' } },
        grid: { color: 'rgba(255,255,255,0.2)' },
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#fff', font: { weight: 'bold' } },
        grid: { color: 'rgba(255,255,255,0.2)' },
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#9932CC', font: { weight: 'bold' } },
      },
      title: {
        display: true,
        text: `Streamed Hours in ${period.split(' ')[1]}`,
        color: '#9932CC',
        font: { size: 18, weight: 'bold' },
      },
    },
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/adminpage/top-listeners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period, all: showAllListeners }),
      });
      const { listeners = [] } = await res.json();
      setData(listeners);

      const year = period.split(' ')[1];
      const monthsOfYear = months.filter((m) => m.endsWith(year));
      const selIdx = monthsOfYear.findIndex((m) => m === period);

      const totals: number[] = await Promise.all(
        monthsOfYear.map(async (m) => {
          const r = await fetch('/api/adminpage/top-listeners', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ period: m }),
          });
          const { listeners = [] } = await r.json();
          return listeners.reduce((sum: number, u: TopListener) => sum + (u.streamingHours ?? 0), 0);
        })
      );

      const base = 'rgba(153,50,204,0.6)', br = 'rgba(153,50,204,1)';
      const hl = 'rgba(255,105,180,0.9)', hlb = 'rgba(255,105,180,1)';

      const bg = totals.map((_, i) => (i === selIdx ? hl : base));
      const bd = totals.map((_, i) => (i === selIdx ? hlb : br));

      setChartData({
        labels: monthsOfYear.map((m) => m.split(' ')[0]),
        datasets: [{
          label: 'Streamed Hours',
          data: totals,
          backgroundColor: bg,
          borderColor: bd,
          borderWidth: 2,
          hoverBackgroundColor: hl,
        }],
      });
    } catch (e) {
      console.error(e);
      setData([]);
      setChartData({
        labels: [],
        datasets: [{
          label: 'Streamed Hours',
          data: [],
          backgroundColor: [],
          borderColor: [],
          borderWidth: 2,
        }],
      });
    } finally {
      setLoading(false);
    }
  }, [period, showAllListeners]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDeleteListener = async (user_id: number) => {
    const confirmDelete = confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;
  
    try {
      const res = await fetch(`/api/users`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id }),
      });
  
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete user");
      }
  
      setData((prev) => prev.filter((u) => u.user_id !== user_id));
    } catch (error) {
      alert(error instanceof Error ? error.message : "An unknown error occurred");
    }
  };
  
  const labels = chartData.labels as string[];
  const idx = labels.findIndex((l) => l === period.split(' ')[0]);
  const total = (chartData.datasets[0]?.data?.[idx] as number) || 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: loading ? 0 : 1 }}
      transition={{ duration: 0.4 }}
      className="p-4"
    >
      <h2 className="text-2xl font-semibold mb-2 text-white">Top Listeners</h2>

      <div className="w-full h-[400px] mb-2">
        <Bar data={chartData} options={options} />
      </div>

      <div className="text-center mb-2">
        <span className="text-white text-lg font-semibold">{period}</span>
      </div>

      <div className="text-center mb-6 text-white font-bold">
        Total Streamed Hours: {total.toFixed(1)}
      </div>

      <div className="text-right mb-4">
        <button
          onClick={() => setShowAllListeners(!showAllListeners)}
          className="underline text-blue-400 hover:text-blue-300 text-sm"
        >
          {showAllListeners ? "View Top Listeners" : "View All Listeners"}
        </button>
      </div>

      <div
        className={`overflow-x-auto ${data.length > 20 ? 'max-h-[640px] overflow-y-auto custom-scrollbar' : ''}`}
      >
        <table className="table-auto w-full text-left bg-gray-800/50 rounded-lg">
          <thead className="bg-gray-700 text-white">
            <tr>
              {['#', 'ID', 'Username', 'Email', 'Plays', 'Hours', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-2 font-bold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((u, i) => (
              <tr key={u.user_id} className={i % 2 ? 'bg-gray-800' : 'bg-gray-900'}>
                <td className="px-4 py-2 text-white">{i + 1}</td>
                <td className="px-4 py-2 text-white">{u.user_id}</td>
                <td className="px-4 py-2 text-white">{u.username.replace(/\./g, ' ')}</td>
                <td className="px-4 py-2 text-white truncate">{u.email}</td>
                <td className="px-4 py-2 text-white">{u.plays}</td>
                <td className="px-4 py-2 text-white">{u.streamingHours.toFixed(1)}</td>
                <td className="px-4 py-2 min-w-[50px] text-center">
                <button
  onClick={() => handleDeleteListener(u.user_id)}
  className="text-red-500 hover:text-red-400"
  title="Delete listener"
>
  <FaTrashAlt size={16} />
</button>

                </td>
              </tr>
            ))}
            {!loading && data.length === 0 && (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-400">
                  No plays recorded in {period}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
