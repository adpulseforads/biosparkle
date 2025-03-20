
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Settings, User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { toast } from 'sonner';

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  return (
    <header className="border-b animate-fade-in">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="font-semibold text-xl flex items-center">
            <span className="bg-black text-white px-2 py-1 rounded mr-2">LinkMe</span>
            <span className="hidden sm:inline">Dashboard</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 sm:space-x-3">
          <Button variant="ghost" size="icon" className="transition-all-200">
            <Bell className="h-[1.2rem] w-[1.2rem]" />
          </Button>
          <Button variant="ghost" size="icon" className="transition-all-200">
            <Settings className="h-[1.2rem] w-[1.2rem]" />
          </Button>
          {currentUser ? (
            <>
              <Button variant="outline" className="gap-2 transition-all-200">
                <User className="h-[1rem] w-[1rem]" />
                <span className="hidden sm:inline">Profile</span>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="transition-all-200"
                onClick={handleLogout}
              >
                <LogOut className="h-[1.2rem] w-[1.2rem]" />
              </Button>
            </>
          ) : (
            <Link to="/sign-in">
              <Button variant="outline" className="gap-2 transition-all-200">
                <User className="h-[1rem] w-[1rem]" />
                <span className="hidden sm:inline">Sign In</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
