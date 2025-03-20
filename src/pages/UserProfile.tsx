
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserData } from '@/lib/types';
import MobilePreview from '@/components/MobilePreview';
import { doc, updateDoc, increment } from 'firebase/firestore';

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" 
      style={{ 
        backgroundColor: userData.profile.theme.backgroundColor === 'bg-gradient-to-br from-purple-100 to-blue-100' 
          ? undefined 
          : userData.profile.theme.backgroundColor
      }}
    >
      <div className={`max-w-md w-full mx-auto ${userData.profile.theme.backgroundColor === 'bg-gradient-to-br from-purple-100 to-blue-100' ? 'bg-gradient-to-br from-purple-100 to-blue-100' : ''}`}>
        <MobilePreview 
          profile={userData.profile} 
          links={userData.links}
          onLinkClick={handleLinkClick}
        />
      </div>
    </div>
  );
};

export default UserProfile;
