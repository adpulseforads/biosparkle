
import React, { useState } from 'react';
import { Link, Profile, Theme, defaultThemes, UserData } from '@/lib/types';
import Header from '@/components/Header';
import LinkCard from '@/components/LinkCard';
import ProfileCard from '@/components/ProfileCard';
import ThemeSelector from '@/components/ThemeSelector';
import MobilePreview from '@/components/MobilePreview';
import AddLinkDialog from '@/components/AddLinkDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Share } from 'lucide-react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/AuthContext';

interface IndexProps {
  userData?: UserData;
}

const Index: React.FC<IndexProps> = ({ userData }) => {
  const { currentUser } = useAuth();
  // Initialize with userData if available, otherwise use demo data
  const [links, setLinks] = useState<Link[]>(
    userData?.links || [
      {
        id: uuidv4(),
        title: 'My Instagram',
        url: 'https://instagram.com/username',
        icon: 'Instagram',
        enabled: true
      },
      {
        id: uuidv4(),
        title: 'My Twitter',
        url: 'https://twitter.com/username',
        icon: 'Twitter',
        enabled: true
      },
      {
        id: uuidv4(),
        title: 'My Portfolio Website',
        url: 'https://myportfolio.com',
        icon: 'Globe',
        enabled: true
      }
    ]
  );
  
  const [profile, setProfile] = useState<Profile>(
    userData?.profile || {
      displayName: 'John Doe',
      bio: 'Digital creator & photographer based in San Francisco',
      imageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&h=200&auto=format&fit=crop',
      theme: defaultThemes[0]
    }
  );
  
  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false);
  const [linkToEdit, setLinkToEdit] = useState<Link | undefined>(undefined);
  const [hasSaved, setHasSaved] = useState(true);
  
  // Functions for managing links
  const handleAddLink = (link: Link) => {
    if (linkToEdit) {
      setLinks(links.map(l => l.id === link.id ? link : l));
      setLinkToEdit(undefined);
      toast.success('Link updated successfully');
    } else {
      setLinks([...links, link]);
      toast.success('Link added successfully');
    }
    setHasSaved(false);
  };
  
  const handleEditLink = (link: Link) => {
    setLinkToEdit(link);
    setIsAddLinkOpen(true);
  };
  
  const handleDeleteLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
    toast.success('Link deleted successfully');
    setHasSaved(false);
  };
  
  const handleToggleLink = (id: string, enabled: boolean) => {
    setLinks(links.map(link => 
      link.id === id ? { ...link, enabled } : link
    ));
    toast.success(`Link ${enabled ? 'enabled' : 'disabled'}`);
    setHasSaved(false);
  };
  
  // Function for updating profile
  const handleUpdateProfile = (updatedProfile: Profile) => {
    setProfile(updatedProfile);
    setHasSaved(false);
  };
  
  // Function for updating theme
  const handleThemeChange = (theme: Theme) => {
    setProfile({ ...profile, theme });
    toast.success(`Theme changed to ${theme.name}`);
    setHasSaved(false);
  };
  
  // Function to handle save
  const handleSave = async () => {
    if (!currentUser) {
      toast.error('You must be logged in to save changes');
      return;
    }

    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        links: links,
        profile: profile
      });
      
      toast.success('All changes saved successfully');
      setHasSaved(true);
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error('Failed to save changes');
    }
  };
  
  // Function to handle share
  const handleShare = () => {
    const username = userData?.username || profile.displayName.toLowerCase().replace(/\s+/g, '');
    const shareUrl = `${window.location.origin}/${username}`;
    
    navigator.clipboard.writeText(shareUrl);
    toast.success('Link copied to clipboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">My Link in Bio</h1>
            <p className="text-gray-500">Customize your links and profile</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={handleShare}
              className="gap-2 transition-all-200"
            >
              <Share className="h-4 w-4" />
              Share
            </Button>
            <Button 
              onClick={handleSave}
              disabled={hasSaved}
              className="transition-all-200"
            >
              {hasSaved ? 'Saved' : 'Save Changes'}
            </Button>
          </div>
        </div>
        
        <div className="grid dashboard-grid gap-6">
          <div className="space-y-6">
            <Card className="animate-fade-in">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium flex items-center justify-between">
                  Links
                  <Button 
                    onClick={() => {
                      setLinkToEdit(undefined);
                      setIsAddLinkOpen(true);
                    }}
                    size="sm"
                    className="gap-1 transition-all-200"
                  >
                    <Plus className="h-4 w-4" />
                    Add New
                  </Button>
                </CardTitle>
                <CardDescription>
                  Add and manage your links
                </CardDescription>
              </CardHeader>
              <CardContent>
                {links.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed rounded-lg">
                    <p className="text-gray-500 mb-4">You don't have any links yet</p>
                    <Button 
                      onClick={() => {
                        setLinkToEdit(undefined);
                        setIsAddLinkOpen(true);
                      }}
                      className="transition-all-200"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Link
                    </Button>
                  </div>
                ) : (
                  <div>
                    {links.map((link) => (
                      <LinkCard 
                        key={link.id}
                        link={link}
                        onEdit={handleEditLink}
                        onDelete={handleDeleteLink}
                        onToggle={handleToggleLink}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <ProfileCard 
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
            />
            
            <ThemeSelector 
              selectedTheme={profile.theme}
              onThemeChange={handleThemeChange}
            />
          </div>
          
          <div className="h-full flex flex-col">
            <div className="sticky top-24 animate-fade-in">
              <h2 className="text-center font-medium mb-4">Mobile Preview</h2>
              <MobilePreview profile={profile} links={links} />
            </div>
          </div>
        </div>
      </main>
      
      <AddLinkDialog
        isOpen={isAddLinkOpen}
        onClose={() => setIsAddLinkOpen(false)}
        onSave={handleAddLink}
        linkToEdit={linkToEdit}
      />
    </div>
  );
};

export default Index;
