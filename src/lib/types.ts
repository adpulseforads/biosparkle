
export interface Link {
  id: string;
  title: string;
  url: string;
  icon: string;
  enabled: boolean;
}

export interface Profile {
  displayName: string;
  bio: string;
  imageUrl: string;
  theme: Theme;
}

export interface Theme {
  id: string;
  name: string;
  backgroundColor: string;
  buttonStyle: string;
  fontFamily: string;
}

export const defaultThemes: Theme[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    backgroundColor: '#ffffff',
    buttonStyle: 'rounded-lg border border-gray-200 bg-white hover:bg-gray-50',
    fontFamily: 'font-sans'
  },
  {
    id: 'dark',
    name: 'Dark',
    backgroundColor: '#111111',
    buttonStyle: 'rounded-lg border border-gray-700 bg-gray-800 text-white hover:bg-gray-700',
    fontFamily: 'font-sans'
  },
  {
    id: 'gradient',
    name: 'Gradient',
    backgroundColor: 'bg-gradient-to-br from-purple-100 to-blue-100',
    buttonStyle: 'rounded-lg border border-purple-100 bg-white/80 hover:bg-white shadow-sm',
    fontFamily: 'font-sans'
  },
  {
    id: 'glassmorphism',
    name: 'Glass',
    backgroundColor: '#f8fafc',
    buttonStyle: 'rounded-lg glass hover:bg-white/30 shadow-sm',
    fontFamily: 'font-sans'
  },
  {
    id: 'pastel',
    name: 'Pastel',
    backgroundColor: '#fef2f2',
    buttonStyle: 'rounded-lg bg-white border border-pink-100 hover:bg-pink-50 shadow-sm',
    fontFamily: 'font-sans'
  }
];

export const socialIcons = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'github', label: 'GitHub' },
  { value: 'mail', label: 'Email' },
  { value: 'link', label: 'Link' },
  { value: 'globe', label: 'Website' }
];
