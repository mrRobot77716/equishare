
import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useFinance } from '@/contexts/FinanceContext';
import { useAuth } from '@/contexts/AuthContext';
import { ActionButton } from '@/components/ui/ActionButton';
import { TransactionForm } from '@/components/dashboard/TransactionForm';
import { DollarSign, Filter, Plus, Search } from 'lucide-react';

export default function Transactions() {
  const { transactions } = useFinance();
  const { isAdmin } = useAuth();
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter(transaction => {
      // Filter by type
      if (filterType !== 'all' && transaction.type !== filterType) {
        return false;
      }
      
      // Filter by search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          transaction.description.toLowerCase().includes(term) ||
          transaction.category.toLowerCase().includes(term)
        );
      }
      
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Layout>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="heading-lg">Transactions</h1>
          <p className="subtle-text">View and manage all financial transactions</p>
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
          </div>
        )}
      </div>
      
      {/* Filters */}
      <div className="glass-card p-4 mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-muted-foreground" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Types</option>
            <option value="income">Income Only</option>
            <option value="expense">Expenses Only</option>
          </select>
        </div>
      </div>
      
      {/* Transactions table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Description</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Category</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-muted-foreground">Amount</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-accent/30 transition-colors">
                    <td className="px-6 py-4 text-sm">
                      {new Date(transaction.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm">{transaction.description}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                        {transaction.category}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm font-medium text-right ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(transaction.amount)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.type === 'income'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        <DollarSign size={12} className="mr-1" />
                        {transaction.type === 'income' ? 'Income' : 'Expense'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No transactions found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
