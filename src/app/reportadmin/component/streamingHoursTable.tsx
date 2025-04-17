import { motion } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';

const months: string[] = [
    'January 2024', 'February 2024', 'March 2024', 'April 2024', 'May 2024', 'June 2024',
    'July 2024', 'August 2024', 'September 2024', 'October 2024', 'November 2024', 'December 2024',
    'January 2025', 'February 2025', 'March 2025', 'April 2025', 'May 2025'
];

interface StreamingHours { hours: string; title: string }

const StreamingHoursListSection = ({ passedid, onBack }: { passedid: number; onBack: () => void }) => {
    const [selectedDate, setSelectedDate] = useState(months[15]);
    const [StreamingHourss, setStreamingHourss] = useState<StreamingHours[]>([]);
    const [sortMethod, setSortMethod] = useState<'alphabetical' | 'hours'>('hours');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [loading, setLoading] = useState(true);

    const fetchStreamingHourss = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/adminpage/streaminghours`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ period: selectedDate, user_id: passedid }),
            });
            const data: StreamingHours[] = await response.json();
            setStreamingHourss(data);
        } catch (error) {
            console.error('Error fetching StreamingHourss:', error);
        } finally {
            setLoading(false);
        }
    }, [selectedDate, passedid]);

    useEffect(() => {
        fetchStreamingHourss();
    }, [fetchStreamingHourss]);

    const sortedStreamingHourss = [...StreamingHourss].sort((a, b) => {
        let result: number;

        if (sortMethod === 'alphabetical') {
            result = a.title.localeCompare(b.title);
        } else if (sortMethod === 'hours') {
            // Assuming `hours` is a string that can be parsed to a number
            result = parseInt(a.hours) - parseInt(b.hours);
        } else {
            result = 0; // fallback if unknown sortMethod
        }

        return sortOrder === 'asc' ? result : -result;
    });

    const toggleSortOrder = () => {
        setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: loading ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            layout
            className="flex flex-col items-center w-full mb-4"
        >
            <div className="flex flex-row justify-between w-full px-10 py-4">
                <div className="flex space-x-4 items-center">
                    <button
                        className={`selection inactive ${sortMethod === 'alphabetical' ? 'selected' : ''}`}
                        onClick={() => setSortMethod('alphabetical')}
                    >
                        Sort Alphabetically
                    </button>
                    <button
                        className={`selection inactive ${sortMethod === 'hours' ? 'selected' : ''}`}
                        onClick={() => setSortMethod('hours')}
                    >
                        Sort by Hours
                    </button>
                    <button
                        className="px-2 py-1 mt-3 border text-sm bg-black rounded"
                        onClick={toggleSortOrder}
                        title="Toggle Ascending/Descending"
                    >
                        {sortOrder === 'asc' ? '↑ Asc ' : '↓ Desc'}
                    </button>
                </div>
                <div className="flex space-x-4">
                    <button
                        onClick={onBack}
                        className="px-4 py-2 bg-black border-2 text-white font-bold rounded"
                    >
                        Back
                    </button>
                    <select
                        className="styled-dropdown"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    >
                        {months.map((month, index) => (
                            <option key={index} value={month}>
                                {month}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="w-[500px] h-[400px] overflow-y-auto mt-4 border border-gray-300 p-4 glow-outline custom-scrollbar">
                <h3 className="text-center text-lg bg-black sticky top-0 font-bold z-10 py-2 mb-4 border glow-headers text-white">
                    Streaming Hours
                </h3>
                <ul>
                    <ul>
                        {sortedStreamingHourss.map((StreamingHours, index) => (
                            <li key={`${StreamingHours.title}-${index}`} className="flex justify-between py-1 text-md border-b">
                                <span>{StreamingHours.title}</span>
                                <span className="text-m text-white">{StreamingHours.hours}</span>
                            </li>
                        ))}
                    </ul>
                </ul>
            </div>
        </motion.div>
    );
};

export default StreamingHoursListSection;
