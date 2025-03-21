
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserData } from '@/lib/types';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import * as Icons from 'lucide-react';
import { Loader2 } from 'lucide-react';

const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!username) {
          setError('No username provided');
          setLoading(false);
          return;
        }

        console.log("Fetching profile for username:", username);
        
        // Query Firestore for the user with the matching username
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('username', '==', username));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.error(`User not found with username: ${username}`);
          setError('User not found');
          setLoading(false);
          return;
        }

        // Get the first matching user
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data() as UserData;
        console.log("Loaded user data:", userData);
        setUserData(userData);

        // Update view count
        try {
          await updateDoc(doc(db, 'users', userDoc.id), {
            'analytics.views': increment(1)
          });
        } catch (analyticsError) {
          console.error('Failed to update view count, but continuing:', analyticsError);
          // Don't fail the whole page load for analytics errors
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [username]);

  const handleLinkClick = async (linkId: string) => {
    try {
      if (!userData) return;
      
      // Update click count for the user
      await updateDoc(doc(db, 'users', userData.uid), {
        'analytics.clicks': increment(1)
      });
    } catch (error) {
      console.error('Error updating click count:', error);
      // Don't block the user from following the link if this fails
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

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center max-w-xs mx-auto">
          <h1 className="text-2xl font-bold mb-2">Profile Not Found</h1>
          <p className="text-gray-500">
            The profile you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => window.location.href = '/'} className="mt-4">
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  // Get only the enabled links
  const enabledLinks = userData.links.filter(link => link.enabled);
  
  // Set background styles
  const bgStyle = userData.profile.theme.backgroundColor.startsWith('bg-gradient') 
    ? { className: userData.profile.theme.backgroundColor } 
    : { style: { backgroundColor: userData.profile.theme.backgroundColor } };

  return (
    <div 
      className="min-h-screen w-full"
      {...bgStyle}
    >
      <div className="max-w-md mx-auto p-4 h-screen">
        <div className="h-full flex flex-col items-center">
          <div className="flex-1 flex flex-col items-center justify-center w-full pt-8 pb-4 animate-slide-down">
            <Avatar className="h-24 w-24 mb-4 shadow-lg">
              <AvatarImage 
                src={userData.profile.imageUrl} 
                alt={userData.profile.displayName} 
                className="object-cover"
              />
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
          
          <div className="w-full space-y-3 animate-slide-up flex-1 overflow-y-auto">
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
          
          <div className="mt-4 pt-2 text-center w-full">
            <p className="text-xs text-gray-500">
              Powered by LinkMe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
