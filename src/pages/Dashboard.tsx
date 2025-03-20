
import React from 'react';
import { useAuth } from '@/lib/AuthContext';
import Index from './Index';

const Dashboard = () => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <div>Loading...</div>;
  }
  
  return <Index />;
};

export default Dashboard;
