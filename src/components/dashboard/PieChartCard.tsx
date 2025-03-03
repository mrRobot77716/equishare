
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useFinance } from '@/contexts/FinanceContext';

interface CategoryData {
  category: string;
  amount: number;
}

// Custom colors for the pie chart
const COLORS = [
  'hsl(var(--primary))', 
  '#06b6d4', 
  '#3b82f6', 
  '#8b5cf6', 
  '#ec4899', 
  '#f43f5e',
  '#f97316',
  '#84cc16',
];

export function PieChartCard() {
  const { getIncomeByCategory } = useFinance();
  const [data, setData] = useState<CategoryData[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const categoryData = getIncomeByCategory();
    setData(categoryData);
  }, [getIncomeByCategory]);

  if (!mounted || data.length === 0) return null;

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight={500}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="glass-card p-5 h-[380px]">
      <h3 className="text-lg font-medium mb-4">Income by Category</h3>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={120}
            innerRadius={60}
            paddingAngle={2}
            dataKey="amount"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`$${value}`, '']}
            contentStyle={{ 
              background: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e0e0e0',
              borderRadius: '6px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
            }}
          />
          <Legend 
            layout="horizontal" 
            verticalAlign="bottom" 
            align="center"
            formatter={(value) => <span className="text-xs font-medium">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
