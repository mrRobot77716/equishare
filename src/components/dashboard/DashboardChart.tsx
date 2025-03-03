
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useFinance } from '@/contexts/FinanceContext';

interface ChartData {
  month: string;
  income: number;
  expenses: number;
}

export function DashboardChart() {
  const { getMonthlyData } = useFinance();
  const [data, setData] = useState<ChartData[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const monthlyData = getMonthlyData();
    
    // Format month labels
    const formattedData = monthlyData.map(item => ({
      ...item,
      month: new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short' })
    }));
    
    setData(formattedData);
  }, [getMonthlyData]);

  if (!mounted) return null;

  return (
    <div className="glass-card p-5 h-[380px]">
      <h3 className="text-lg font-medium mb-4">Monthly Income & Expenses</h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="month" 
            tick={{ fill: '#666', fontSize: 12 }}
            axisLine={{ stroke: '#e0e0e0' }}
          />
          <YAxis 
            tickFormatter={(value) => `$${value}`}
            tick={{ fill: '#666', fontSize: 12 }}
            axisLine={{ stroke: '#e0e0e0' }}
          />
          <Tooltip 
            formatter={(value) => [`$${value}`, '']}
            contentStyle={{ 
              background: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e0e0e0',
              borderRadius: '6px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
            }}
          />
          <Legend />
          <Bar 
            dataKey="income" 
            name="Income" 
            fill="hsl(var(--primary))" 
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="expenses" 
            name="Expenses" 
            fill="#ef4444" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
