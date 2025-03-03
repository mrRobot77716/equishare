
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ActionButton } from '@/components/ui/ActionButton';
import { LogIn } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        await login(email, password);
        toast.success('Logged in successfully');
        navigate('/dashboard');
      } else {
        await signup(email, password, name);
        toast.success('Account created successfully');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // For demo purposes - pre-filled credentials
  const handleDemoLogin = async (role: 'admin' | 'member') => {
    setLoading(true);
    try {
      if (role === 'admin') {
        await login('admin@example.com', 'password');
      } else {
        await login('member@example.com', 'password');
      }
      toast.success('Logged in successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to login with demo account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo and app name */}
        <div className="text-center mb-8">
          <div className="inline-flex mb-4 p-3 rounded-xl bg-primary/10">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary-foreground"
                width="18"
                height="18"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
          </div>
          <h1 className="heading-lg mb-1">EquiShare</h1>
          <p className="subtle-text">Smart Income & Expense Manager for Startups</p>
        </div>
        
        {/* Auth form */}
        <div className="glass-card p-6">
          <h2 className="heading-md mb-6">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Your name"
                  required={!isLogin}
                  disabled={loading}
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="your@email.com"
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>
            
            <ActionButton
              type="submit"
              variant="primary"
              className="w-full mt-6"
              disabled={loading}
              icon={<LogIn size={18} />}
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </ActionButton>
          </form>
          
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-primary hover:underline"
              disabled={loading}
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
          
          {/* Quick demo login options */}
          <div className="mt-8 pt-4 border-t border-border">
            <p className="text-sm text-center text-muted-foreground mb-3">
              Demo Accounts (for quick testing)
            </p>
            <div className="flex gap-3">
              <ActionButton
                type="button"
                variant="outline"
                className="flex-1 text-xs py-1.5"
                onClick={() => handleDemoLogin('admin')}
                disabled={loading}
              >
                Admin Demo
              </ActionButton>
              <ActionButton
                type="button"
                variant="outline"
                className="flex-1 text-xs py-1.5"
                onClick={() => handleDemoLogin('member')}
                disabled={loading}
              >
                Member Demo
              </ActionButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
