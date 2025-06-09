import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FormTool, FormParameter, ToolParameterType } from '@/types';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

interface ToolDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  tool: FormTool | null;
  onSave: (tool: FormTool) => void;
  isEditing: boolean;
}

const ToolDialogComponent: React.FC<ToolDialogProps> = ({ isOpen, onOpenChange, tool: initialTool, onSave, isEditing }) => {
  const [currentEditingTool, setCurrentEditingTool] = useState<FormTool | null>(null);

  useEffect(() => {
    if (isOpen && initialTool) {
      setCurrentEditingTool({...initialTool});
    } else if (isOpen && !initialTool) {
      setCurrentEditingTool({
        id: uuidv4(),
        name: '',
        description: '',
        parameters: [],
        returnType: 'string' as ToolParameterType,
      });
    } else {
      setCurrentEditingTool(null); // Reset when dialog closes
    }
  }, [isOpen, initialTool]);

  const handleParamChange = (index: number, field: keyof FormParameter, value: any) => {
    if (!currentEditingTool) return;
    const newParams = [...(currentEditingTool.parameters || [])];
    newParams[index] = { ...newParams[index], [field]: value };
    setCurrentEditingTool({ ...currentEditingTool, parameters: newParams });
  };

  const addParameter = () => {
    if (!currentEditingTool) return;
    const newParam: FormParameter = {
      id: uuidv4(),
      name: `param${(currentEditingTool.parameters || []).length + 1}`,
      type: 'string' as ToolParameterType,
      description: '',
      required: false,
    };
    setCurrentEditingTool({ ...currentEditingTool, parameters: [...(currentEditingTool.parameters || []), newParam] });
  };

  const removeParameter = (index: number) => {
    if (!currentEditingTool) return;
    setCurrentEditingTool({ ...currentEditingTool, parameters: (currentEditingTool.parameters || []).filter((_, i) => i !== index) });
  };

  const handleSave = () => {
    if (currentEditingTool) {
      onSave(currentEditingTool);
    }
  };

  if (!isOpen || !currentEditingTool) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Tool' : 'Add New Tool'}</DialogTitle>
          <DialogDescription>
            Configure the details of the tool the agent can use.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] p-1">
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="tool-name">Tool Name</Label>
            <Input 
              id="tool-name" 
              value={currentEditingTool.name} 
              onChange={(e) => setCurrentEditingTool(prev => prev ? { ...prev, name: e.target.value } : null)} 
              placeholder="e.g., getWeather"
              required
            />
          </div>
          <div>
            <Label htmlFor="tool-description">Description</Label>
            <Textarea 
              id="tool-description" 
              value={currentEditingTool.description} 
              onChange={(e) => setCurrentEditingTool(prev => prev ? { ...prev, description: e.target.value } : null)} 
              placeholder="Describes what the tool does"
            />
          </div>
          <div>
            <Label htmlFor="tool-returnType">Return Type</Label>
            <Select 
              value={currentEditingTool.returnType}
              onValueChange={(value) => setCurrentEditingTool(prev => prev ? ({ ...prev, returnType: value as ToolParameterType }) : null)}
            >
              <SelectTrigger><SelectValue placeholder="Select return type" /></SelectTrigger>
              <SelectContent>
                {Object.values(ToolParameterType).map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <h4 className="text-md font-semibold pt-2">Parameters</h4>
          {(currentEditingTool.parameters || []).map((param, index) => (
            <Card key={param.id || index} className="p-3 space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm">Parameter {index + 1}</Label>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeParameter(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
              <Input value={param.name} onChange={(e) => handleParamChange(index, 'name', e.target.value)} placeholder="Parameter name" />
              <Textarea value={param.description} onChange={(e) => handleParamChange(index, 'description', e.target.value)} placeholder="Parameter description" rows={2}/>
              <Select value={param.type} onValueChange={(value) => handleParamChange(index, 'type', value as ToolParameterType)}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {Object.values(ToolParameterType).map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2 pt-1">
                <Checkbox id={`required-${param.id}`} checked={param.required} onCheckedChange={(checked) => handleParamChange(index, 'required', !!checked)} />
                <Label htmlFor={`required-${param.id}`} className="text-sm font-normal">Required</Label>
              </div>
            </Card>
          ))}
          <Button type="button" variant="outline" onClick={addParameter} className="w-full"><Plus className="mr-2 h-4 w-4" />Add Parameter</Button>
        </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>{isEditing ? 'Save Changes' : 'Add Tool'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ToolDialogComponent;
