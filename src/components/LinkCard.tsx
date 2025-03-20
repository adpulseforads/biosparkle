
import React from 'react';
import { Link } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { GripVertical, ExternalLink, Pencil, Trash2 } from 'lucide-react';
import * as Icons from 'lucide-react';

interface LinkCardProps {
  link: Link;
  onEdit: (link: Link) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, enabled: boolean) => void;
}

const LinkCard: React.FC<LinkCardProps> = ({ link, onEdit, onDelete, onToggle }) => {
  const IconComponent = (Icons as any)[link.icon] || Icons.Link;
  
  return (
    <Card className="mb-3 animate-scale-in transition-all-200 hover:shadow-sm group">
      <CardContent className="p-4">
        <div className="flex items-center">
          <div className="mr-2 cursor-move text-gray-400 hover:text-gray-600 transition-all-200">
            <GripVertical size={20} />
          </div>
          
          <div className="flex-1 flex items-center gap-3">
            <div className="bg-gray-100 p-2 rounded-md">
              <IconComponent size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm truncate">{link.title}</h3>
              <p className="text-xs text-gray-500 truncate">{link.url}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-2 opacity-70 group-hover:opacity-100 transition-all-200">
            <Switch 
              checked={link.enabled} 
              onCheckedChange={(checked) => onToggle(link.id, checked)}
              className="transition-all-200"
            />
            
            <Button variant="ghost" size="icon" onClick={() => onEdit(link)} className="h-8 w-8 transition-all-200">
              <Pencil size={16} />
            </Button>
            
            <Button variant="ghost" size="icon" onClick={() => onDelete(link.id)} className="h-8 w-8 transition-all-200">
              <Trash2 size={16} />
            </Button>
            
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" className="h-8 w-8 transition-all-200">
                <ExternalLink size={16} />
              </Button>
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LinkCard;
