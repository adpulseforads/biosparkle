
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import Index from './Index';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserData, Profile, Link, defaultThemes } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching data for user:", currentUser.uid);
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          // User data exists
          const data = userDoc.data() as UserData;
          console.log("User data loaded successfully:", data);
          setUserData(data);
        } else {
          // Create default user data
          console.log("Creating new user profile");
          const username = currentUser.email?.split('@')[0]?.toLowerCase() || '';
          const displayName = currentUser.displayName || username || 'User';
          
          const defaultUserData: UserData = {
            uid: currentUser.uid,
            username: username,
            profile: {
              displayName: displayName,
              bio: 'Digital creator & content maker',
              imageUrl: currentUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&h=200&auto=format&fit=crop',
              theme: defaultThemes[0]
            },
            links: [
              {
                id: uuidv4(),
                title: 'My Instagram',
                url: 'https://instagram.com/username',
                icon: 'Instagram',
                enabled: true
              }
            ],
            analytics: {
              views: 0,
              clicks: 0
            }
          };

          // Save default data to Firestore
          await setDoc(userDocRef, defaultUserData);
          setUserData(defaultUserData);
          toast.success('Your profile has been created!');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load your data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentUser || !userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg">Please sign in to access your dashboard.</p>
        </div>
      </div>
    );
  }
  
  return <Index userData={userData} />;
};

export default Dashboard;
