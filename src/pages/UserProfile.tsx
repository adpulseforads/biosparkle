
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserData } from '@/lib/types';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import * as Icons from 'lucide-react';

const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Query Firestore for the user with the matching username
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('username', '==', username));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError('User not found');
          setLoading(false);
          return;
        }

        // Get the first matching user
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data() as UserData;
        setUserData(userData);

        // Update view count
        await updateDoc(doc(db, 'users', userDoc.id), {
          'analytics.views': increment(1)
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchUserProfile();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Profile Not Found</h1>
          <p className="text-gray-500">
            The profile you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const handleLinkClick = async (linkId: string) => {
    try {
      // Update click count for the user
      await updateDoc(doc(db, 'users', userData.uid), {
        'analytics.clicks': increment(1)
      });
    } catch (error) {
      console.error('Error updating click count:', error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get only the enabled links
  const enabledLinks = userData.links.filter(link => link.enabled);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 animate-fade-in" 
      style={{ 
        backgroundColor: userData.profile.theme.backgroundColor === 'bg-gradient-to-br from-purple-100 to-blue-100' 
          ? undefined 
          : userData.profile.theme.backgroundColor
      }}
    >
      <div className={`max-w-md w-full mx-auto py-8 px-4 rounded-xl ${userData.profile.theme.backgroundColor === 'bg-gradient-to-br from-purple-100 to-blue-100' ? 'bg-gradient-to-br from-purple-100 to-blue-100' : ''}`}>
        <div className="flex flex-col items-center pt-4 pb-6 animate-slide-down">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={userData.profile.imageUrl} alt={userData.profile.displayName} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xl">
              {getInitials(userData.profile.displayName || 'User Profile')}
            </AvatarFallback>
          </Avatar>
          
          <h1 className="text-center text-xl font-semibold mb-1">
            {userData.profile.displayName || 'Your Name'}
          </h1>
          
          <p className="text-center text-sm text-gray-600 max-w-xs mx-auto">
            {userData.profile.bio || 'Your bio will appear here'}
          </p>
        </div>
        
        <div className="space-y-3 animate-slide-up">
          {enabledLinks.length === 0 ? (
            <div className="text-center text-sm text-gray-500 py-8">
              No active links to display
            </div>
          ) : (
            enabledLinks.map((link, index) => {
              const IconComponent = (Icons as any)[link.icon] || Icons.Link;
              
              return (
                <Button
                  key={link.id}
                  variant="outline"
                  className={`w-full justify-start gap-2 ${userData.profile.theme.buttonStyle} transition-all-200`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => {
                    handleLinkClick(link.id);
                    window.open(link.url, '_blank');
                  }}
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="flex-1 text-left truncate">{link.title}</span>
                </Button>
              );
            })
          )}
        </div>
        
        <div className="mt-8 pt-4 text-center">
          <p className="text-xs text-gray-500">
            Powered by LinkMe
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
