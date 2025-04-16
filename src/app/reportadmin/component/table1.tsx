import { motion } from 'framer-motion';

interface ReportData {
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q1_2: number;
  q2_2: number;
  total: number;
}
interface CategoryData {
  listeners: ReportData[];
  artists: ReportData[];
  likes: ReportData[];
  follows: ReportData[];
  streaminghours: ReportData[];
  uploads: ReportData[];
}
interface TableSectionProps {
  selectedCategory: keyof CategoryData;
  data: CategoryData;
}

const TableSection: React.FC<TableSectionProps> = ({ selectedCategory, data }) => {
  const getTableData = () => {
    return data[selectedCategory] || [];
  };

  const safeGrowth = (current: number, previous: number) => {
    if (previous === 0) return "0.00";
    return ((current - previous) / previous * 100).toFixed(2);
  };

  const tableData = getTableData().map(item => {
    const newQ2 = item.q2 - item.q1;
    const newQ3 = item.q3 - item.q2;
    const newQ4 = item.q4 - item.q3;
    const newQ1_2 = item.q1_2 - item.q4;
    const newQ2_2 = item.q2_2 - item.q1_2;
    const avgIncrease = ((item.q2_2 - item.q1) / 5).toFixed(0);

    const growthQ2 = safeGrowth(item.q2, item.q1);
    const growthQ3 = safeGrowth(item.q3, item.q2);
    const growthQ4 = safeGrowth(item.q4, item.q3);
    const growthQ1_2 = safeGrowth(item.q1_2, item.q4);
    const growthQ2_2 = safeGrowth(item.q2_2, item.q1_2);

    const avgGrowth = (
      (parseFloat(growthQ2) +
        parseFloat(growthQ3) +
        parseFloat(growthQ4) +
        parseFloat(growthQ1_2) +
        parseFloat(growthQ2_2)) /
      5
    ).toFixed(2);

    return {
      original: item,
      newQuarters: [null, newQ2, newQ3, newQ4, newQ1_2, newQ2_2, avgIncrease],
      growthQuarters: [null, growthQ2, growthQ3, growthQ4, growthQ1_2, growthQ2_2, avgGrowth],
    };
  });

  const formatCategory = (name: string) =>
    name !== 'streaminghours'
      ? name.charAt(0).toUpperCase() + name.slice(1)
      : name.charAt(0).toUpperCase() + name.slice(1, 9) + ' ' + name.slice(9);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center w-[950px]"
    >
      <header className="p-2 text-[40px]">
        {formatCategory(selectedCategory)}
      </header>

      <table className="w-full border-collapse text-center text-2xl">
        <thead>
          <tr>
            <th className="p-2 w-32 text-[20px]"></th>
            <th className="p-2 border-4 border-black border-collapse w-20" colSpan={4}>2024</th>
            <th className="p-2 border-4 border-black border-collapse w-20" colSpan={2}>2025</th>
          </tr>
          <tr>
            <th></th>
            <th className="p-2 border-4 border-black">Q1</th>
            <th className="p-2 border-4 border-black">Q2</th>
            <th className="p-2 border-4 border-black">Q3</th>
            <th className="p-2 border-4 border-black">Q4</th>
            <th className="p-2 border-4 border-black">Q1</th>
            <th className="p-2 border-4 border-black">Q2</th>
            <th className="p-2 border-4 border-black">Total</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map(({ original }, index) => (
            <tr key={`current-${index}`}>
              <td className="p-2 border-4 border-black text-[18px]">{formatCategory(selectedCategory)}</td>
              <td className="p-2 border-4 border-black">{original.q1}</td>
              <td className="p-2 border-4 border-black">{original.q2}</td>
              <td className="p-2 border-4 border-black">{original.q3}</td>
              <td className="p-2 border-4 border-black">{original.q4}</td>
              <td className="p-2 border-4 border-black">{original.q1_2}</td>
              <td className="p-2 border-4 border-black">{original.q2_2}</td>
              <td className="p-2 border-4 border-black">{original.total}</td>
              <td className="border-4 border-white w-2 text-lg">Current Total</td>
            </tr>
          ))}

          {tableData.map(({ newQuarters }, index) => (
            <tr key={`new-${index}`}>
              <td className="p-2 border-4 border-black text-[14px]">New {formatCategory(selectedCategory)}</td>
              {newQuarters.map((val, i) => (
                <td key={i} className="p-2 border-4 border-black">
                  {val !== null ? val : ' - '}
                </td>
              ))}
              <td className="border-4 border-white w-2 text-lg">Avg Increase</td>
            </tr>
          ))}

          {tableData.map(({ growthQuarters }, index) => (
            <tr key={`growth-${index}`}>
              <td className="p-2 border-4 border-black text-[20px]">% Growth</td>
              {growthQuarters.map((val, i) => (
                <td key={i} className="p-2 border-4 border-black">
                  {val !== null ? val : ' - '}
                </td>
              ))}
              <td className="border-4 border-white w-2 text-lg">Avg % Growth</td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default TableSection;
