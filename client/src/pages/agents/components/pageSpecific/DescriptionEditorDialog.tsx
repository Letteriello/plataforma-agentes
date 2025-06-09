import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface DescriptionEditorDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  description: string;
  onDescriptionChange: (newDescription: string) => void;
  onSave: () => void;
}

const DescriptionEditorDialog: React.FC<DescriptionEditorDialogProps> = ({
  isOpen,
  onOpenChange,
  description,
  onDescriptionChange,
  onSave,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Description</DialogTitle>
          <DialogDescription>
            Provide a concise description for the agent.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="e.g., A customer support agent specialized in tech queries."
          className="min-h-[100px] text-sm my-4"
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save Description</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DescriptionEditorDialog;
