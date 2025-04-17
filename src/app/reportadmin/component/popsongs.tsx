import { useState, useMemo } from 'react';

const SongsTable = ({ songs }: { songs: { title: string; plays: number }[] }) => {
  const [sortMethod, setSortMethod] = useState<'alphabetical' | 'plays'>('plays');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sortedSongs = useMemo(() => {
    return [...songs].sort((a, b) => {
      let result = 0;

      if (sortMethod === 'alphabetical') {
        result = a.title.localeCompare(b.title);
      } else if (sortMethod === 'plays') {
        result = a.plays - b.plays;
      }

      return sortOrder === 'asc' ? result : -result;
    });
  }, [songs, sortMethod, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <div className="w-[800px] h-[400px] mt-10 mb-32 px-4">
      <div className="flex flex-row justify-between mb-4">
        <div className="flex space-x-4">
          <button
            className={`selection inactive ${sortMethod === 'alphabetical' ? 'selected' : ''}`}
            onClick={() => setSortMethod('alphabetical')}
          >
            Sort Alphabetically
          </button>
          <button
            className={`selection inactive ${sortMethod === 'plays' ? 'selected' : ''}`}
            onClick={() => setSortMethod('plays')}
          >
            Sort by Plays
          </button>
          <button
            className="px-2 py-1 mt-1 border text-sm bg-black text-white rounded"
            onClick={toggleSortOrder}
            title="Toggle Ascending/Descending"
          >
            {sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
          </button>
        </div>
      </div>

      <table className="min-w-full text-sm border border-gray-700 rounded overflow-hidden">
        <thead className="bg-gray-900 text-white">
          <tr>
            <th className="py-2 px-4 text-left">Title</th>
            <th className="py-2 px-4 text-left">Plays</th>
          </tr>
        </thead>
        <tbody>
          {sortedSongs.map((song, index) => (
            <tr key={index} className="even:bg-white even:bg-opacity-20 backdrop-blur-sm">
              <td className="py-2 px-4">{song.title}</td>
              <td className="py-2 px-4">{song.plays}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SongsTable;
