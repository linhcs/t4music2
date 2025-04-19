'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const months = [
  'January 2024','February 2024','March 2024','April 2024',
  'May 2024','June 2024','July 2024','August 2024',
  'September 2024','October 2024','November 2024','December 2024',
  'January 2025','February 2025','March 2025','April 2025','May 2025',
]

interface Signup {
  user_id:    number
  username:   string
  email:      string
  role:       'listener' | 'artist' | 'admin'
  created_at: string
}

interface Props {
  period: string | null
}

export default function NewSignupsTable({ period }: Props) {
  const [signups, setSignups]   = useState<Signup[]>([])
  const [loading, setLoading]   = useState(true)
  const [chartData, setChartData] = useState<ChartData<'bar', number[], string>>({
    labels: [],
    datasets: [
      { label: 'Listeners', data: [], backgroundColor: [], borderColor: [], borderWidth: 2 },
      { label: 'Artists',   data: [], backgroundColor: [], borderColor: [], borderWidth: 2 }
    ]
  })

  const isAll = period === null

  const options: ChartOptions<'bar'> = {
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: '#fff', font: { weight: 'bold' } },
        grid:  { color: 'rgba(255,255,255,0.2)' }
      },
      y: {
        beginAtZero: true,
        ticks:       { color: '#fff', font: { weight: 'bold' } },
        grid:        { color: 'rgba(255,255,255,0.2)' }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels:   { color: '#9932CC', font: { weight: 'bold' } }
      },
      title: {
        display: true,
        text:    isAll
                  ? 'Sign‑ups (All Months)'
                  : `Sign‑ups in ${period!.split(' ')[1]}`,
        color:   '#9932CC',
        font:    { size: 18, weight: 'bold' }
      }
    }
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const detailRes = await fetch('/api/adminpage/new-signups', {
        method: 'POST',
        headers:{ 'Content-Type':'application/json' },
        body:    JSON.stringify(period ? { period } : {}) 
      })
      const { signups = [] } = await detailRes.json()
      setSignups(signups)

      const monthsOfYear = isAll
        ? months
        : months.filter(m => m.endsWith(period!.split(' ')[1]))
      const selIdx = isAll
        ? -1
        : monthsOfYear.findIndex(m => m === period)

      const fetchCount = (m: string, role: 'listener'|'artist') =>
        fetch('/api/adminpage/new-signups', {
          method:'POST',
          headers:{ 'Content-Type':'application/json' },
          body: JSON.stringify({ period: m, role })
        })
        .then(r => r.json())
        .then(j => j.count ?? 0)

      const [listenerCounts, artistCounts] = await Promise.all([
        Promise.all(monthsOfYear.map(m => fetchCount(m,'listener'))),
        Promise.all(monthsOfYear.map(m => fetchCount(m,'artist')))
      ])

      const baseL = 'rgba(100,149,237,0.6)', brL = 'rgba(100,149,237,1)'
      const baseA = 'rgba(138,43,226,0.6)',  brA = 'rgba(138,43,226,1)'
      const hlL   = 'rgba(173,216,230,0.9)', hlA = 'rgba(216,191,216,0.9)'

      const bgL = listenerCounts.map((_,i)=> i===selIdx ? hlL : baseL)
      const bdL = listenerCounts.map((_,i)=> i===selIdx ? hlL : brL)
      const bgA = artistCounts.map((_,i)=>   i===selIdx ? hlA : baseA)
      const bdA = artistCounts.map((_,i)=>   i===selIdx ? hlA : brA)

      setChartData({
        labels: monthsOfYear.map(m => m.split(' ')[0]),
        datasets: [
          { label:'Listeners', data: listenerCounts, backgroundColor: bgL, borderColor: bdL, borderWidth:2 },
          { label:'Artists',   data: artistCounts,   backgroundColor: bgA, borderColor: bdA, borderWidth:2 }
        ]
      })
    } catch (e) {
      console.error(e)
      setSignups([])
      if (!isAll) {
        setChartData({
          labels: [], datasets: [
            { label:'Listeners', data:[], backgroundColor:[], borderColor:[], borderWidth:2 },
            { label:'Artists',   data:[], backgroundColor:[], borderColor:[], borderWidth:2 }
          ]
        })
      }
    } finally {
      setLoading(false)
    }
  }, [period, isAll])

  useEffect(() => { fetchData() }, [fetchData])

  const totals = {
    listeners: signups.filter(s=>s.role==='listener').length,
    artists:   signups.filter(s=>s.role==='artist').length,
    total:     signups.length
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: loading? 0:1 }}
      transition={{ duration: 0.4 }}
      className="p-4"
    >
      {/* Header */}
      <h2 className="text-2xl font-semibold mb-4 text-white">
        {isAll ? 'All New Sign‑ups' : `New Sign‑ups in ${period}`}
      </h2>

      {/* Chart (always shown, just covers all months if isAll) */}
      <div className="w-full h-[400px] mb-2">
        <Bar data={chartData} options={options} />
      </div>

      {/* Selected / All label */}
      <div className="text-center mb-2">
        <span className="text-white text-lg font-semibold">
          {isAll ? 'All Months' : period}
        </span>
      </div>

      {/* Totals */}
      <div className="flex justify-center space-x-6 mb-6 text-white font-bold">
        <div>Listeners: {totals.listeners}</div>
        <div>Artists:   {totals.artists}</div>
        <div>Total:     {totals.total}</div>
      </div>

      {/* Table (scroll if >20 rows) */}
      <div className={`overflow-x-auto ${
        signups.length > 20
          ? 'max-h-[640px] overflow-y-auto custom-scrollbar'
          : ''
      }`}>
        <table className="table-auto w-full text-left bg-gray-800/50 rounded-lg">
          <thead className="bg-gray-700 text-white">
            <tr>
              {['#','ID','Username','Email','Role','Date'].map(h => (
                <th key={h} className="px-4 py-2 font-bold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {signups.map((u,i) => (
              <tr key={u.user_id} className={i%2 ? 'bg-gray-800' : 'bg-gray-900'}>
                <td className="px-4 py-2 text-white">{i+1}</td>
                <td className="px-4 py-2 text-white">{u.user_id}</td>
                <td className="px-4 py-2 text-white">{u.username.replace(/\./g,' ')}</td>
                <td className="px-4 py-2 text-white truncate">{u.email}</td>
                <td className="px-4 py-2 text-white uppercase">{u.role}</td>
                <td className="px-4 py-2 text-white">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {!loading && signups.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-400">
                  No sign‑ups found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
