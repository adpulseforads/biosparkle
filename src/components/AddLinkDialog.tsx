
import React, { useState, useEffect } from 'react';
import { Link, socialIcons } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { v4 as uuidv4 } from 'uuid';

interface AddLinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (link: Link) => void;
  linkToEdit?: Link;
}

const AddLinkDialog: React.FC<AddLinkDialogProps> = ({ isOpen, onClose, onSave, linkToEdit }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [icon, setIcon] = useState('Link');
  
  useEffect(() => {
    if (linkToEdit) {
      setTitle(linkToEdit.title);
      setUrl(linkToEdit.url);
      setIcon(linkToEdit.icon);
    } else {
      setTitle('');
      setUrl('');
      setIcon('Link');
    }
  }, [linkToEdit, isOpen]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate URL
    let formattedUrl = url;
    if (!/^https?:\/\//i.test(url)) {
      formattedUrl = 'https://' + url;
    }
    
    const newLink: Link = {
      id: linkToEdit?.id || uuidv4(),
      title,
      url: formattedUrl,
      icon,
      enabled: linkToEdit?.enabled !== undefined ? linkToEdit.enabled : true
    };
    
    onSave(newLink);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] animate-scale-in">
        <DialogHeader>
          <DialogTitle>{linkToEdit ? 'Edit Link' : 'Add New Link'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. My Instagram"
              required
              className="transition-all-200"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g. instagram.com/yourusername"
              required
              className="transition-all-200"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="icon">Icon</Label>
            <Select 
              value={icon} 
              onValueChange={setIcon}
            >
              <SelectTrigger id="icon" className="w-full transition-all-200">
                <SelectValue placeholder="Select an icon" />
              </SelectTrigger>
              <SelectContent>
                {socialIcons.map((iconOption) => (
                  <SelectItem key={iconOption.value} value={iconOption.value}>
                    {iconOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="transition-all-200">
              Cancel
            </Button>
            <Button type="submit" className="transition-all-200">
              {linkToEdit ? 'Update Link' : 'Add Link'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLinkDialog;
