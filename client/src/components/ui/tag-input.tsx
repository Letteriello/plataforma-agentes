import * as React from 'react';
import { X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TagInputProps extends React.HTMLAttributes<HTMLDivElement> {
  placeholder?: string;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  maxTags?: number;
  maxLength?: number;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  tagClassName?: string;
}

export function TagInput({
  placeholder = 'Add tags...',
  tags = [],
  onTagsChange,
  maxTags = 10,
  maxLength = 50,
  disabled = false,
  className = '',
  inputClassName = '',
  tagClassName = '',
  ...props
}: TagInputProps) {
  const [inputValue, setInputValue] = React.useState('');
  const [isFocused, setIsFocused] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === 'Enter' || e.key === 'Tab' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      // Remove the last tag on backspace when input is empty
      removeTag(tags.length - 1);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (inputValue.trim()) {
      addTag();
    }
  };

  const addTag = () => {
    const trimmedValue = inputValue.trim();
    
    if (
      !trimmedValue || 
      (maxTags && tags.length >= maxTags) || 
      (maxLength && trimmedValue.length > maxLength)
    ) {
      return;
    }

    // Check for duplicates
    if (!tags.includes(trimmedValue)) {
      const newTags = [...tags, trimmedValue];
      onTagsChange(newTags);
    }
    
    setInputValue('');
  };

  const removeTag = (index: number) => {
    if (disabled) return;
    
    const newTags = [...tags];
    newTags.splice(index, 1);
    onTagsChange(newTags);
  };

  const containerClasses = cn(
    'flex flex-wrap gap-2 p-2 border rounded-md bg-background',
    'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text',
    isFocused ? 'border-primary' : 'border-input',
    className
  );

  const inputClasses = cn(
    'flex-1 min-w-[100px] bg-transparent outline-none text-sm',
    'placeholder:text-muted-foreground',
    disabled && 'cursor-not-allowed',
    inputClassName
  );

  const tagClasses = (index: number) =>
    cn(
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
      'bg-primary/10 text-primary',
      !disabled && 'hover:bg-primary/20',
      disabled ? 'cursor-not-allowed' : 'cursor-pointer',
      tagClassName
    );

  return (
    <div
      className={containerClasses}
      onClick={() => !disabled && inputRef.current?.focus()}
      {...props}
    >
      {tags.map((tag, index) => (
        <div
          key={`${tag}-${index}`}
          className={tagClasses(index)}
          onClick={(e) => e.stopPropagation()}
        >
          <span>{tag}</span>
          {!disabled && (
            <button
              type="button"
              className="ml-1.5 rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/20"
              onClick={() => removeTag(index)}
              aria-label={`Remove tag ${tag}`}
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      ))}
      
      {(!maxTags || tags.length < maxTags) && (
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          placeholder={tags.length === 0 ? placeholder : ''}
          className={inputClasses}
          disabled={disabled}
          maxLength={maxLength}
        />
      )}
      
      {maxTags && (
        <div className="text-xs text-muted-foreground self-center ml-auto">
          {tags.length}/{maxTags}
        </div>
      )}
    </div>
  );
}
