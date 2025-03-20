
import React from 'react';
import { Link, Profile } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import * as Icons from 'lucide-react';

interface MobilePreviewProps {
  profile: Profile;
  links: Link[];
  onLinkClick?: (linkId: string) => void;
}

const MobilePreview: React.FC<MobilePreviewProps> = ({ profile, links, onLinkClick }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getThemeStyles = () => {
    const theme = profile.theme;
    
    if (theme.backgroundColor.startsWith('bg-gradient')) {
      return theme.backgroundColor;
    }
    
    return '';
  };

  const enabledLinks = links.filter(link => link.enabled);

  const handleLinkClick = (link: Link) => {
    if (onLinkClick) {
      onLinkClick(link.id);
    }
    
    // Open the link in a new tab
    window.open(link.url, '_blank');
  };

  return (
    <div className="iphone-frame animate-fade-in">
      <div className="iphone-screen no-scrollbar">
        <div className={`min-h-full p-6 ${getThemeStyles()}`} style={{ 
          backgroundColor: !profile.theme.backgroundColor.startsWith('bg-gradient') ? profile.theme.backgroundColor : undefined 
        }}>
          <div className="flex flex-col items-center pt-6 pb-8 animate-slide-down">
            <Avatar className="h-20 w-20 mb-4">
              <AvatarImage src={profile.imageUrl} alt={profile.displayName} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {getInitials(profile.displayName || 'User Profile')}
              </AvatarFallback>
            </Avatar>
            
            <h1 className="text-center text-xl font-semibold mb-1">
              {profile.displayName || 'Your Name'}
            </h1>
            
            <p className="text-center text-sm text-gray-600 max-w-[250px]">
              {profile.bio || 'Your bio will appear here'}
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
                    className={`w-full justify-start gap-2 ${profile.theme.buttonStyle} transition-all-200`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                    onClick={() => handleLinkClick(link)}
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
    </div>
  );
};

export default MobilePreview;
