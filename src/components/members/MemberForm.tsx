
import { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { ActionButton } from '@/components/ui/ActionButton';
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface MemberFormProps {
  onClose: () => void;
  existingMember?: {
    id: string;
    name: string;
    email: string;
    percentage: number;
  };
}

export function MemberForm({ onClose, existingMember }: MemberFormProps) {
  const { addMember, updateMember, members } = useFinance();
  const [name, setName] = useState(existingMember?.name || '');
  const [email, setEmail] = useState(existingMember?.email || '');
  const [percentage, setPercentage] = useState(existingMember?.percentage.toString() || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !percentage) {
      toast.error('Please fill in all fields');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    const percentageValue = Number(percentage);
    if (isNaN(percentageValue) || percentageValue <= 0 || percentageValue > 100) {
      toast.error('Percentage must be between 1 and 100');
      return;
    }
    
    // For editing, check if the total percentage will exceed 100%
    if (existingMember) {
      const otherMembersTotal = members
        .filter(m => m.id !== existingMember.id)
        .reduce((sum, m) => sum + m.percentage, 0);
        
      if (otherMembersTotal + percentageValue > 100) {
        toast.error('Total percentage cannot exceed 100%');
        return;
      }
      
      updateMember(existingMember.id, {
        name,
        email,
        percentage: percentageValue,
      });
      
      toast.success('Member updated successfully');
    } else {
      // For new members, check if the total percentage will exceed 100%
      const currentTotal = members.reduce((sum, m) => sum + m.percentage, 0);
      if (currentTotal + percentageValue > 100) {
        toast.error('Total percentage cannot exceed 100%');
        return;
      }
      
      addMember({
        name,
        email,
        percentage: percentageValue,
      });
      
      toast.success('Member added successfully');
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-card rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">
            {existingMember ? 'Edit' : 'Add'} Member
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Enter name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Enter email"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Profit Percentage</label>
              <div className="relative">
                <input
                  type="number"
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="0"
                  min="1"
                  max="100"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
              </div>
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
              variant="primary"
            >
              {existingMember ? 'Update' : 'Add'} Member
            </ActionButton>
          </div>
        </form>
      </div>
    </div>
  );
}
