
import { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { ActionButton } from '@/components/ui/ActionButton';
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface TransactionFormProps {
  type: 'income' | 'expense';
  onClose: () => void;
}

const categories = {
  income: ['Client Projects', 'Maintenance', 'Consulting', 'Other Income'],
  expense: ['Infrastructure', 'Software', 'Office', 'Marketing', 'Salaries', 'Other Expenses']
};

export function TransactionForm({ type, onClose }: TransactionFormProps) {
  const { addTransaction } = useFinance();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description || !category) {
      toast.error('Please fill in all fields');
      return;
    }
    
    addTransaction({
      type,
      amount: Number(amount),
      description,
      category,
      date,
    });
    
    toast.success(`${type === 'income' ? 'Income' : 'Expense'} added successfully`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-card rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">
            Add {type === 'income' ? 'Income' : 'Expense'}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Enter description"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                required
              >
                <option value="">Select category</option>
                {categories[type].map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-6 gap-2">
            <ActionButton
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </ActionButton>
            <ActionButton
              type="submit"
              variant={type === 'income' ? 'primary' : 'destructive'}
            >
              Add {type === 'income' ? 'Income' : 'Expense'}
            </ActionButton>
          </div>
        </form>
      </div>
    </div>
  );
}
