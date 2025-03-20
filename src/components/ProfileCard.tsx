
import React, { useState } from 'react';
import { Profile } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, X } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileCardProps {
  profile: Profile;
  onUpdateProfile: (profile: Profile) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onUpdateProfile }) => {
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [bio, setBio] = useState(profile.bio);
  const [imageUrl, setImageUrl] = useState(profile.imageUrl);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      displayName,
      bio,
      imageUrl
    });
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="animate-fade-in">
      <CardContent className="p-5">
        <div className="flex flex-col items-center">
          <div className="relative mb-4 group">
            <Avatar className="h-24 w-24">
              <AvatarImage src={imageUrl} alt={displayName} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {getInitials(displayName || 'User Profile')}
              </AvatarFallback>
            </Avatar>
            
            {isEditing && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all-200">
                <label htmlFor="avatar-upload" className="cursor-pointer bg-black/50 rounded-full p-2">
                  <Camera className="h-5 w-5 text-white" />
                  <input 
                    id="avatar-upload" 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // In a real app, you would upload this file to a server
                        // For now, we'll just create a local URL
                        const url = URL.createObjectURL(file);
                        setImageUrl(url);
                      }
                    }}
                  />
                </label>
              </div>
            )}
          </div>
          
          {isEditing ? (
            <form onSubmit={handleSubmit} className="w-full space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your Name"
                  className="transition-all-200"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell visitors about yourself"
                  className="resize-none transition-all-200"
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsEditing(false);
                    setDisplayName(profile.displayName);
                    setBio(profile.bio);
                    setImageUrl(profile.imageUrl);
                  }}
                  className="transition-all-200"
                >
                  Cancel
                </Button>
                <Button type="submit" className="transition-all-200">Save Changes</Button>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-2 w-full">
              <h2 className="text-xl font-semibold">{displayName || 'Your Name'}</h2>
              <p className="text-sm text-gray-500">
                {bio || 'Add a bio to tell visitors about yourself'}
              </p>
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(true)}
                className="mt-2 w-full transition-all-200"
              >
                Edit Profile
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
