import { useCallback, useState } from 'react';
import { useAgentForm } from './AgentForm';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { TagInput } from '@/components/ui/tag-input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function AgentBaseForm() {
  const {
    registerField,
    values,
    setFieldValue,
    formState: { errors },
  } = useAgentForm();
  
  const [tags, setTags] = useState<string[]>(values.tags || []);
  
  const handleTagsChange = useCallback((newTags: string[]) => {
    setTags(newTags);
    setFieldValue('tags', newTags, true);
  }, [setFieldValue]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Information</CardTitle>
        <CardDescription>
          Basic information about your agent
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Name Field */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="name">Name</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    A descriptive name for your agent. This will be displayed in the agents list.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            id="name"
            placeholder="My Agent"
            {...registerField('name')}
            error={!!errors.name}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message as string}</p>
          )}
        </div>

        {/* Description Field */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="description">Description</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    A brief description of what this agent does. This will help you and others understand its purpose.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Textarea
            id="description"
            placeholder="Describe what this agent does..."
            className="min-h-[100px]"
            {...registerField('description')}
            error={!!errors.description}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message as string}</p>
          )}
        </div>

        {/* Tags Field */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Label>Tags</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Add tags to help organize and find your agent. Press Enter or Tab to add a tag.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <TagInput
            placeholder="Add tags..."
            tags={tags}
            onTagsChange={handleTagsChange}
            maxTags={10}
            maxLength={50}
          />
          {errors.tags && (
            <p className="text-sm text-red-500">{errors.tags.message as string}</p>
          )}
        </div>

        {/* Visibility Toggle */}
        <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
          <div className="space-y-0.5">
            <Label htmlFor="isPublic" className="flex items-center">
              Make this agent public
            </Label>
            <p className="text-sm text-muted-foreground">
              {values.isPublic
                ? 'This agent is visible to all users.'
                : 'This agent is only visible to you.'}
            </p>
          </div>
          <Switch
            id="isPublic"
            checked={values.isPublic}
            onCheckedChange={(checked) => setFieldValue('isPublic', checked, true)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
