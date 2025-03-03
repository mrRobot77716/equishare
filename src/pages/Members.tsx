
import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useFinance } from '@/contexts/FinanceContext';
import { useAuth } from '@/contexts/AuthContext';
import { ActionButton } from '@/components/ui/ActionButton';
import { MemberForm } from '@/components/members/MemberForm';
import { Edit, Plus, Trash2, Users, Percent } from 'lucide-react';
import { toast } from 'sonner';

export default function Members() {
  const { members, removeMember } = useFinance();
  const { isAdmin } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMember, setEditingMember] = useState<{
    id: string;
    name: string;
    email: string;
    percentage: number;
  } | null>(null);

  const totalPercentage = members.reduce((sum, member) => sum + member.percentage, 0);
  const totalDistributed = members.reduce((sum, member) => sum + member.totalReceived, 0);

  const handleRemoveMember = (id: string) => {
    if (confirm('Are you sure you want to remove this member?')) {
      removeMember(id);
      toast.success('Member removed successfully');
    }
  };

  return (
    <Layout>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="heading-lg">Members</h1>
          <p className="subtle-text">Manage team members and profit distribution</p>
        </div>
        
        {isAdmin && (
          <ActionButton
            onClick={() => setShowAddForm(true)}
            icon={<Plus size={18} />}
          >
            Add Member
          </ActionButton>
        )}
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-medium">Team Members</h3>
            <div className="p-2 rounded-full bg-primary/10">
              <Users size={18} className="text-primary" />
            </div>
          </div>
          <p className="text-3xl font-semibold mb-1">{members.length}</p>
          <p className="text-sm text-muted-foreground">Active contributors</p>
        </div>
        
        <div className="glass-card p-6">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-medium">Total Percentage</h3>
            <div className="p-2 rounded-full bg-primary/10">
              <Percent size={18} className="text-primary" />
            </div>
          </div>
          <p className="text-3xl font-semibold mb-1">{totalPercentage}%</p>
          <p className="text-sm text-muted-foreground">
            {totalPercentage < 100 ? `${100 - totalPercentage}% unallocated` : 'Fully allocated'}
          </p>
        </div>
        
        <div className="glass-card p-6">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-medium">Total Distributed</h3>
            <div className="p-2 rounded-full bg-primary/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
                width="18"
                height="18"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-semibold mb-1">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 0
            }).format(totalDistributed)}
          </p>
          <p className="text-sm text-muted-foreground">Total profit distributed to date</p>
        </div>
      </div>
      
      {/* Members list */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Name</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Email</th>
                <th className="text-center px-6 py-3 text-sm font-medium text-muted-foreground">Percentage</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-muted-foreground">Total Received</th>
                {isAdmin && (
                  <th className="text-right px-6 py-3 text-sm font-medium text-muted-foreground">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-accent/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="font-medium">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{member.email}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {member.percentage}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(member.totalReceived)}
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingMember(member)}
                          className="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                          aria-label="Edit member"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-destructive transition-colors"
                          aria-label="Remove member"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              
              {members.length === 0 && (
                <tr>
                  <td 
                    colSpan={isAdmin ? 5 : 4} 
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    No members found. Add team members to start distributing profits.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Add/Edit member forms */}
      {showAddForm && (
        <MemberForm onClose={() => setShowAddForm(false)} />
      )}
      
      {editingMember && (
        <MemberForm 
          onClose={() => setEditingMember(null)} 
          existingMember={editingMember}
        />
      )}
    </Layout>
  );
}
