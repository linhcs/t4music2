import { motion } from 'framer-motion';

interface ReportData {q1: number; q2: number; q3: number; q4: number; q1_2: number; q2_2: number; total: number;}
interface CategoryData {listeners: ReportData[]; artists: ReportData[]; likes: ReportData[]; follows: ReportData[]; streaminghours: ReportData[]; uploads: ReportData[];}
interface TableSectionProps {selectedCategory: keyof CategoryData; data: CategoryData;}

const TableSection: React.FC<TableSectionProps> = ({ selectedCategory, data }) => {
  const getTableData = () => {
    switch (selectedCategory) {
      case 'listeners':
        return data.listeners;
      case 'artists':
        return data.artists;
      case 'likes':
        return data.likes;
      case 'follows':
        return data.follows;
      case 'streaminghours':
        return data.streaminghours;
      case 'uploads':
        return data.uploads;
      default:
        return [];
    }
  };

  const tableData = getTableData();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center w-full"
    >
        
    <header className="p-2 text-[40px]"> {selectedCategory !== 'streaminghours' ? selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1,9) + ' ' + selectedCategory.slice(9) } </header>
      <table className="w-full border-collapse text-center text-2xl">
        <thead> 
            <tr >
                <th className="p-2 w-32 text-[20px]"> </th> 
                <th className="p-2 border-4 border-black border-collapse w-20" colSpan={4}> 2024 </th>
                <th className="p-2 border-4 border-black border-collapse w-20" colSpan={2}> 2025 </th>
            </tr>
        </thead> 
        <thead>
          <tr>
            <th className="p-2 w-32 text-[20px]"> </th> 
            <th className="p-2 border-4 border-black w-20">Q1</th>
            <th className="p-2 border-4 border-black w-20">Q2</th>
            <th className="p-2 border-4 border-black w-20">Q3</th>
            <th className="p-2 border-4 border-black w-20">Q4</th>
            <th className="p-2 border-4 border-black w-20">Q1</th>
            <th className="p-2 border-4 border-black w-20">Q2</th>
            <th className="p-2 border-4 w-20  total-column">Total</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((item, index) => (
            <tr key={index}>
              <td className="p-2 border-4 border-black text-[20px]">{selectedCategory !== 'streaminghours' ? selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1,9) + ' ' + selectedCategory.slice(9) }</td>
              <td className="p-2 border-4 border-black ">{ item.q1 }</td>
              <td className="p-2 border-4 border-black ">{ item.q2 }</td>
              <td className="p-2 border-4 border-black ">{ item.q3 }</td>
              <td className="p-2 border-4 border-black ">{ item.q4 }</td>
              <td className="p-2 border-4 border-black ">{ item.q1_2 }</td>
              <td className="p-2 border-4 border-black ">{ item.q2_2 }</td>
              <td className="p-2 border-4 border-black total-column">{ item.total }</td>
              <td className="p-2 border-4 total-column text-[18px]"> Current Total </td>
            </tr>
          ))}
          {tableData.map((item, index) => (
            <tr key={index}>
              <td className="p-2 border-4 border-black text-[16px]"> {selectedCategory !== 'streaminghours' ? 'New ' + selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) : 'New ' + selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1,9) + ' ' + selectedCategory.slice(9) } </td>
              <td className="p-2 border-4 border-black "> - </td>
              <td className="p-2 border-4 border-black ">{item.q2 - item.q1}</td>
              <td className="p-2 border-4 border-black ">{ item.q3 - item.q2}</td>
              <td className="p-2 border-4 border-black ">{item.q4 - item.q3}</td>
              <td className="p-2 border-4 border-black ">{item.q1_2 - item.q4}</td>
              <td className="p-2 border-4 border-black ">{item.q2_2 - item.q1_2}</td>
              <td className="p-2 border-4 border-black total-column">{((item.q2_2 - item.q1)/5).toFixed(0)}</td>
              <td className="p-2 border-4 total-column text-[16px]"> Avg {selectedCategory !== 'streaminghours' ? selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1,9) + ' ' + selectedCategory.slice(9) } Increase </td>
          </tr>
          ))}
          {tableData.map((item, index) => (
            <tr key={index}>
              <td className="p-2 border-4 border-black ="> % Growth </td>
              <td className="p-2 border-4 border-black "> - </td>
              <td className="p-2 border-4 border-black ">{((item.q2 - item.q1)/item.q1 * 100).toFixed(2)}</td>
              <td className="p-2 border-4 border-black ">{((item.q3 - item.q2)/item.q2 * 100).toFixed(2)}</td>
              <td className="p-2 border-4 border-black ">{((item.q4 - item.q3)/item.q3 * 100).toFixed(2)}</td>
              <td className="p-2 border-4 border-black ">{((item.q1_2 - item.q4)/item.q4 * 100).toFixed(2)}</td>
              <td className="p-2 border-4 border-black ">{((item.q2_2 - item.q1_2)/item.q1_2 * 100).toFixed(2)}</td>
              <td className="p-2 border-4  total-column">{((((item.q2 - item.q1)/item.q1 * 100) + ((item.q3 - item.q2)/item.q2 * 100) + ((item.q4 - item.q3)/item.q3 * 100) + ((item.q1_2 - item.q4)/item.q4 * 100) + ((item.q2_2 - item.q1_2)/item.q1_2 * 100))/5).toFixed(2) }</td>
              <td className="p-2 border-4 total-column text-[16px]"> Avg %Growth Increase </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default TableSection;
