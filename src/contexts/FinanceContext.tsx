
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Types for our financial data
type Transaction = {
  id: string;
  date: string;
  amount: number;
  description: string;
  type: 'income' | 'expense';
  category: string;
};

type Member = {
  id: string;
  name: string;
  email: string;
  percentage: number;
  totalReceived: number;
};

type FinanceContextType = {
  transactions: Transaction[];
  members: Member[];
  income: number;
  expenses: number;
  netProfit: number;
  pendingDistribution: number;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  addMember: (member: Omit<Member, 'id' | 'totalReceived'>) => void;
  updateMember: (id: string, data: Partial<Omit<Member, 'id'>>) => void;
  removeMember: (id: string) => void;
  distributeProfit: () => void;
  getMonthlyData: () => { month: string; income: number; expenses: number }[];
  getIncomeByCategory: () => { category: string; amount: number }[];
};

// Create context with default values
const FinanceContext = createContext<FinanceContextType>({
  transactions: [],
  members: [],
  income: 0,
  expenses: 0,
  netProfit: 0,
  pendingDistribution: 0,
  addTransaction: () => {},
  addMember: () => {},
  updateMember: () => {},
  removeMember: () => {},
  distributeProfit: () => {},
  getMonthlyData: () => [],
  getIncomeByCategory: () => [],
});

// Mock data
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    date: '2023-06-15',
    amount: 5000,
    description: 'Client payment - Project A',
    type: 'income',
    category: 'Client Projects',
  },
  {
    id: '2',
    date: '2023-06-20',
    amount: 1200,
    description: 'Server costs',
    type: 'expense',
    category: 'Infrastructure',
  },
  {
    id: '3',
    date: '2023-07-01',
    amount: 7500,
    description: 'Client payment - Project B',
    type: 'income',
    category: 'Client Projects',
  },
  {
    id: '4',
    date: '2023-07-05',
    amount: 800,
    description: 'Software licenses',
    type: 'expense',
    category: 'Software',
  },
  {
    id: '5',
    date: '2023-07-15',
    amount: 3200,
    description: 'Client payment - Maintenance',
    type: 'income',
    category: 'Maintenance',
  },
  {
    id: '6',
    date: '2023-07-22',
    amount: 1500,
    description: 'Office rent',
    type: 'expense',
    category: 'Office',
  },
  {
    id: '7',
    date: '2023-08-01',
    amount: 9000,
    description: 'Client payment - Project C',
    type: 'income',
    category: 'Client Projects',
  },
  {
    id: '8',
    date: '2023-08-10',
    amount: 2200,
    description: 'Marketing expenses',
    type: 'expense',
    category: 'Marketing',
  },
];

const MOCK_MEMBERS: Member[] = [
  {
    id: '1',
    name: 'Jane Doe',
    email: 'jane@example.com',
    percentage: 40,
    totalReceived: 6000,
  },
  {
    id: '2',
    name: 'John Smith',
    email: 'john@example.com',
    percentage: 30,
    totalReceived: 4500,
  },
  {
    id: '3',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    percentage: 30,
    totalReceived: 4500,
  },
];

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [pendingDistribution, setPendingDistribution] = useState(0);

  // Initialize with mock data
  useEffect(() => {
    // Check local storage first
    const storedTransactions = localStorage.getItem('equishare_transactions');
    const storedMembers = localStorage.getItem('equishare_members');
    const storedPendingDistribution = localStorage.getItem('equishare_pending');
    
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    } else {
      setTransactions(MOCK_TRANSACTIONS);
      localStorage.setItem('equishare_transactions', JSON.stringify(MOCK_TRANSACTIONS));
    }
    
    if (storedMembers) {
      setMembers(JSON.parse(storedMembers));
    } else {
      setMembers(MOCK_MEMBERS);
      localStorage.setItem('equishare_members', JSON.stringify(MOCK_MEMBERS));
    }
    
    if (storedPendingDistribution) {
      setPendingDistribution(Number(storedPendingDistribution));
    } else {
      // Calculate initial pending distribution
      const initial = MOCK_TRANSACTIONS.reduce((sum, t) => 
        t.type === 'income' ? sum + t.amount : sum - t.amount, 0) - 15000; // 15000 is mock already distributed
      setPendingDistribution(initial);
      localStorage.setItem('equishare_pending', initial.toString());
    }
  }, []);

  // Computed values
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const netProfit = income - expenses;

  // Add a new transaction
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    
    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    localStorage.setItem('equishare_transactions', JSON.stringify(updatedTransactions));
    
    // Update pending distribution
    const newPending = transaction.type === 'income' 
      ? pendingDistribution + transaction.amount
      : pendingDistribution - transaction.amount;
    
    setPendingDistribution(newPending);
    localStorage.setItem('equishare_pending', newPending.toString());
  };

  // Add a new member
  const addMember = (member: Omit<Member, 'id' | 'totalReceived'>) => {
    const newMember = {
      ...member,
      id: Date.now().toString(),
      totalReceived: 0,
    };
    
    const updatedMembers = [...members, newMember];
    setMembers(updatedMembers);
    localStorage.setItem('equishare_members', JSON.stringify(updatedMembers));
  };

  // Update a member
  const updateMember = (id: string, data: Partial<Omit<Member, 'id'>>) => {
    const updatedMembers = members.map(m => 
      m.id === id ? { ...m, ...data } : m
    );
    
    setMembers(updatedMembers);
    localStorage.setItem('equishare_members', JSON.stringify(updatedMembers));
  };

  // Remove a member
  const removeMember = (id: string) => {
    const updatedMembers = members.filter(m => m.id !== id);
    setMembers(updatedMembers);
    localStorage.setItem('equishare_members', JSON.stringify(updatedMembers));
  };

  // Distribute profit
  const distributeProfit = () => {
    if (pendingDistribution <= 0) return;
    
    const updatedMembers = members.map(member => {
      const share = (pendingDistribution * member.percentage) / 100;
      return {
        ...member,
        totalReceived: member.totalReceived + share,
      };
    });
    
    setMembers(updatedMembers);
    setPendingDistribution(0);
    
    localStorage.setItem('equishare_members', JSON.stringify(updatedMembers));
    localStorage.setItem('equishare_pending', '0');
  };

  // Get monthly data for charts
  const getMonthlyData = () => {
    const monthlyData: { [key: string]: { income: number; expenses: number } } = {};
    
    transactions.forEach(transaction => {
      const month = transaction.date.substring(0, 7); // Format: YYYY-MM
      
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expenses: 0 };
      }
      
      if (transaction.type === 'income') {
        monthlyData[month].income += transaction.amount;
      } else {
        monthlyData[month].expenses += transaction.amount;
      }
    });
    
    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        income: data.income,
        expenses: data.expenses,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  };

  // Get income by category for charts
  const getIncomeByCategory = () => {
    const categoryData: { [key: string]: number } = {};
    
    transactions
      .filter(t => t.type === 'income')
      .forEach(transaction => {
        if (!categoryData[transaction.category]) {
          categoryData[transaction.category] = 0;
        }
        categoryData[transaction.category] += transaction.amount;
      });
    
    return Object.entries(categoryData).map(([category, amount]) => ({
      category,
      amount,
    }));
  };

  return (
    <FinanceContext.Provider 
      value={{
        transactions,
        members,
        income,
        expenses,
        netProfit,
        pendingDistribution,
        addTransaction,
        addMember,
        updateMember,
        removeMember,
        distributeProfit,
        getMonthlyData,
        getIncomeByCategory,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

// Custom hook for using the finance context
export function useFinance() {
  return useContext(FinanceContext);
}
