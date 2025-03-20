
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Settings, User } from 'lucide-react';

const Header: React.FC = () => {
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
          <Button variant="outline" className="gap-2 transition-all-200">
            <User className="h-[1rem] w-[1rem]" />
            <span className="hidden sm:inline">Profile</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
