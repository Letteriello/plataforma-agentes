import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

interface InstructionEditorDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  instruction: string;
  onInstructionChange: (newInstruction: string) => void;
  onSave: () => void;
}

const InstructionEditorDialog: React.FC<InstructionEditorDialogProps> = ({
  isOpen,
  onOpenChange,
  instruction,
  onInstructionChange,
  onSave,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Instructions</DialogTitle>
          <DialogDescription>
            Provide detailed instructions for the agent.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <Textarea
            value={instruction}
            onChange={(e) => onInstructionChange(e.target.value)}
            placeholder="e.g., You are a helpful assistant that translates English to French."
            className="min-h-[380px] text-sm"
          />
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save Instructions</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InstructionEditorDialog;
