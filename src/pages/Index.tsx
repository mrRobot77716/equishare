
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BarChart3, Users, DollarSign, PieChart } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-3xl mx-auto animate-fade-in">
          <h1 className="heading-xl mb-6 text-primary">EquiShare</h1>
          <p className="text-xl mb-8 text-muted-foreground">
            Smart income & expense management for startups with automatic profit distribution
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate("/dashboard")}
              className="gap-2"
            >
              <BarChart3 size={20} />
              Go to Dashboard
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate("/login")}
              className="gap-2"
            >
              <DollarSign size={20} />
              Login
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="heading-lg text-center mb-12">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <BarChart3 className="text-primary" size={24} />
              </div>
              <h3 className="heading-sm mb-2">Financial Dashboard</h3>
              <p className="text-muted-foreground">Track income, expenses, and profit in real-time with intuitive visualizations</p>
            </div>
            
            <div className="glass-card p-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="text-primary" size={24} />
              </div>
              <h3 className="heading-sm mb-2">Member Management</h3>
              <p className="text-muted-foreground">Add team members and set profit percentages for automatic distribution</p>
            </div>
            
            <div className="glass-card p-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <PieChart className="text-primary" size={24} />
              </div>
              <h3 className="heading-sm mb-2">Profit Distribution</h3>
              <p className="text-muted-foreground">Automatically calculate and distribute profits based on predefined percentages</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground">© {new Date().getFullYear()} EquiShare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
