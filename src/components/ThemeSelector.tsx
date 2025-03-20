
import React from 'react';
import { Theme, defaultThemes } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Check } from 'lucide-react';

interface ThemeSelectorProps {
  selectedTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ selectedTheme, onThemeChange }) => {
  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Theme</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedTheme.id}
          onValueChange={(value) => {
            const theme = defaultThemes.find(t => t.id === value);
            if (theme) onThemeChange(theme);
          }}
          className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5"
        >
          {defaultThemes.map((theme) => (
            <div key={theme.id} className="relative">
              <RadioGroupItem 
                id={theme.id} 
                value={theme.id} 
                className="sr-only peer" 
              />
              <Label
                htmlFor={theme.id}
                className={`flex flex-col items-center justify-center rounded-lg border-2 border-transparent p-2 peer-data-[state=checked]:border-primary hover:bg-gray-50 cursor-pointer transition-all-200 ${
                  selectedTheme.id === theme.id ? 'ring-2 ring-primary ring-offset-2' : ''
                }`}
              >
                <div
                  className={`h-12 w-full rounded ${theme.id === 'gradient' ? 'bg-gradient-to-br from-purple-100 to-blue-100' : ''}`}
                  style={{ 
                    backgroundColor: 
                      theme.id !== 'gradient' ? theme.backgroundColor : undefined 
                  }}
                ></div>
                <span className="mt-2 text-xs font-medium">{theme.name}</span>
                {selectedTheme.id === theme.id && (
                  <div className="absolute top-1 right-1 rounded-full bg-primary text-white p-0.5">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default ThemeSelector;
