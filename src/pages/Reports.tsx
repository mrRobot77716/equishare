
import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useFinance } from '@/contexts/FinanceContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';

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

export default function Reports() {
  const { getMonthlyData, getIncomeByCategory, transactions } = useFinance();
  const [timeframe, setTimeframe] = useState('all');
  
  // Calculate income vs expenses
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const profitMargin = income > 0 ? ((income - expenses) / income) * 100 : 0;
  
  // Get data for charts
  const monthlyData = getMonthlyData();
  const incomeByCategory = getIncomeByCategory();
  
  // Calculate expense by category
  const expenseByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: Record<string, number>, t) => {
      if (!acc[t.category]) {
        acc[t.category] = 0;
      }
      acc[t.category] += t.amount;
      return acc;
    }, {});
    
  const expenseData = Object.entries(expenseByCategory).map(([category, amount]) => ({
    category,
    amount,
  }));

  return (
    <Layout>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="heading-lg">Financial Reports</h1>
        <p className="subtle-text">Visualize your financial performance</p>
      </div>
      
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6">
          <h3 className="text-lg font-medium mb-2">Profit Margin</h3>
          <p className="text-3xl font-semibold mb-1">
            {profitMargin.toFixed(1)}%
          </p>
          <p className="text-sm text-muted-foreground">Net profit as percentage of income</p>
        </div>
        
        <div className="glass-card p-6">
          <h3 className="text-lg font-medium mb-2">Income to Expense Ratio</h3>
          <p className="text-3xl font-semibold mb-1">
            {income > 0 ? (income / expenses).toFixed(2) : '0.00'}
          </p>
          <p className="text-sm text-muted-foreground">Income divided by expenses</p>
        </div>
        
        <div className="glass-card p-6">
          <h3 className="text-lg font-medium mb-2">Average Transaction</h3>
          <p className="text-3xl font-semibold mb-1">
            {transactions.length > 0 
              ? new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(
                  transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length
                )
              : '$0.00'
            }
          </p>
          <p className="text-sm text-muted-foreground">Average transaction amount</p>
        </div>
      </div>
      
      {/* Monthly income vs expenses chart */}
      <div className="glass-card p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Monthly Income & Expenses</h3>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Time</option>
            <option value="6m">Last 6 Months</option>
            <option value="3m">Last 3 Months</option>
          </select>
        </div>
        
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={monthlyData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#666', fontSize: 12 }}
                axisLine={{ stroke: '#e0e0e0' }}
                tickFormatter={(value) => {
                  const date = new Date(value + '-01');
                  return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                }}
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
                labelFormatter={(label) => {
                  const date = new Date(label + '-01');
                  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
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
      </div>
      
      {/* Pie charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Income by category */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-medium mb-4">Income by Category</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={incomeByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  innerRadius={40}
                  paddingAngle={2}
                  dataKey="amount"
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    
                    return percent > 0.05 ? (
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
                    ) : null;
                  }}
                >
                  {incomeByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [
                    new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(Number(value)), 
                    ''
                  ]}
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
        </div>
        
        {/* Expenses by category */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-medium mb-4">Expenses by Category</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  innerRadius={40}
                  paddingAngle={2}
                  dataKey="amount"
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    
                    return percent > 0.05 ? (
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
                    ) : null;
                  }}
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [
                    new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(Number(value)), 
                    ''
                  ]}
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
        </div>
      </div>
    </Layout>
  );
}
