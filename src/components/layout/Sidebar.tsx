
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  DollarSign, 
  Home, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  Settings, 
  Users, 
  X 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: DollarSign, label: 'Transactions', path: '/transactions' },
  { icon: BarChart3, label: 'Reports', path: '/reports' },
  { icon: Users, label: 'Members', path: '/members' },
  { icon: Settings, label: 'Settings', path: '/settings' }
];

export function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();

  return (
    <div className="relative">
      {/* Mobile menu toggle */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-background border border-border"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar backdrop for mobile */}
      {expanded && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setExpanded(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 bottom-0 left-0 z-40 w-64 bg-card border-r border-border transition-transform duration-300 ease-in-out",
          expanded ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <div className="flex items-center gap-2 px-2 py-4">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <Home className="text-primary-foreground" size={18} />
            </div>
            <span className="font-semibold text-xl">EquiShare</span>
          </div>

          {/* Nav items */}
          <nav className="flex-1 mt-8">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent group transition-colors",
                      location.pathname === item.path && "bg-accent text-primary font-medium"
                    )}
                    onClick={() => setExpanded(false)}
                  >
                    <item.icon size={20} className={cn(
                      location.pathname === item.path ? "text-primary" : "text-muted-foreground",
                      "group-hover:text-foreground transition-colors"
                    )} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User / Log out */}
          <div className="border-t border-border pt-4 mt-auto">
            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                  <span className="text-sm font-medium">JD</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Jane Doe</p>
                  <p className="text-xs text-muted-foreground">Admin</p>
                </div>
              </div>
              <button className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-destructive transition-colors">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
