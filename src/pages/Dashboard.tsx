
import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useFinance } from '@/contexts/FinanceContext';
import { useAuth } from '@/contexts/AuthContext';
import { StatCard } from '@/components/ui/StatCard';
import { ActionButton } from '@/components/ui/ActionButton';
import { DashboardChart } from '@/components/dashboard/DashboardChart';
import { PieChartCard } from '@/components/dashboard/PieChartCard';
import { TransactionForm } from '@/components/dashboard/TransactionForm';
import { BarChart3, DollarSign, LineChart, Percent, Plus, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function Dashboard() {
  const { income, expenses, netProfit, pendingDistribution, distributeProfit } = useFinance();
  const { isAdmin } = useAuth();
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  const handleDistributeProfit = () => {
    if (pendingDistribution <= 0) {
      toast.error('No profit available for distribution');
      return;
    }
    
    distributeProfit();
    toast.success('Profit distributed successfully');
  };

  return (
    <Layout>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="heading-lg">Dashboard</h1>
          <p className="subtle-text">Financial overview of your business</p>
        </div>
        
        {isAdmin && (
          <div className="flex flex-wrap gap-3">
            <ActionButton
              onClick={() => setShowIncomeForm(true)}
              icon={<Plus size={18} />}
            >
              Add Income
            </ActionButton>
            
            <ActionButton
              onClick={() => setShowExpenseForm(true)}
              variant="outline"
              icon={<Plus size={18} />}
            >
              Add Expense
            </ActionButton>
            
            <ActionButton
              onClick={handleDistributeProfit}
              variant="secondary"
              icon={<Percent size={18} />}
              disabled={pendingDistribution <= 0}
            >
              Distribute Profit
            </ActionButton>
          </div>
        )}
      </div>
      
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Income"
          value={income}
          icon={<DollarSign size={20} />}
          trend={{ value: 12, isPositive: true }}
          valueClassName="text-green-600"
        />
        
        <StatCard
          title="Total Expenses"
          value={expenses}
          icon={<DollarSign size={20} />}
          trend={{ value: 8, isPositive: false }}
          valueClassName="text-red-600"
        />
        
        <StatCard
          title="Net Profit"
          value={netProfit}
          icon={<LineChart size={20} />}
          trend={{ value: 15, isPositive: true }}
          valueClassName="text-primary"
        />
        
        <StatCard
          title="Pending Distribution"
          value={pendingDistribution}
          icon={<Users size={20} />}
          valueClassName={pendingDistribution > 0 ? "text-amber-600" : ""}
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardChart />
        <PieChartCard />
      </div>
      
      {/* Transaction forms */}
      {showIncomeForm && (
        <TransactionForm 
          type="income" 
          onClose={() => setShowIncomeForm(false)} 
        />
      )}
      
      {showExpenseForm && (
        <TransactionForm 
          type="expense" 
          onClose={() => setShowExpenseForm(false)} 
        />
      )}
    </Layout>
  );
}
