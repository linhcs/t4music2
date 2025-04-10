import { motion } from "framer-motion";
import { useState } from "react";

interface ReportData { q1: number; q2: number; q3: number; q4: number; q1_2: number; q2_2: number; total: number; }
interface CategoryData { listeners: ReportData[]; artists: ReportData[]; likes: ReportData[]; follows: ReportData[]; streaminghours: ReportData[]; uploads: ReportData[]; }

interface HeaderSelectionProps {
  setSelectedCategory: (category: keyof CategoryData) => void;
}

const HeaderSelection: React.FC<HeaderSelectionProps> = ({ setSelectedCategory }) => {
  const [selectedCategory, setSelectedCategoryState] = useState<keyof CategoryData | null>(null);

  const categories: (keyof CategoryData)[] = ['listeners', 'artists', 'likes', 'follows', 'streaminghours', 'uploads'];
  console.log(selectedCategory)
  return (
    <div className="flex flex-col items-center space-y-5 text-lg">
      {categories.map((category) => (
        <motion.button
          key={category}
          onClick={() => {
            setSelectedCategory(category);
            setSelectedCategoryState(category);
          }}
          className={`selection inactive ${selectedCategory === category ? 'selected' : ''}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {category == 'streaminghours'? category.charAt(0).toUpperCase() + category.slice(1,9) + ' ' + category.charAt(9).toUpperCase() + category.slice(10): category.charAt(0).toUpperCase() + category.slice(1)}
        </motion.button>
      ))}
    </div>
  );
};

export default HeaderSelection;
