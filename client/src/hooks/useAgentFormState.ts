import { useState, useEffect, useCallback } from 'react';
import { useForm, UseFormReturn, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Agent, AgentType } from '@/types/agents';
import { agentSchema, AgentFormValues } from '@/lib/form-utils';

interface UseAgentFormStateProps {
  initialValues?: Partial<AgentFormValues>;
  onSubmit: (values: AgentFormValues) => Promise<void> | void;
  schema?: z.ZodSchema;
}

export function useAgentFormState({
  initialValues,
  onSubmit,
  schema = agentSchema,
}: UseAgentFormStateProps) {
  // Initialize form with react-hook-form
  const form = useForm<AgentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: AgentType.LLM,
      isPublic: false,
      tags: [],
      ...initialValues,
    },
    mode: 'onChange',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [currentType, setCurrentType] = useState<AgentType>(
    initialValues?.type || AgentType.LLM
  );

  // Watch the agent type to handle dynamic form fields
  const watchType = form.watch('type');

  // Update current type when it changes
  useEffect(() => {
    if (watchType && watchType !== currentType) {
      setCurrentType(watchType);
    }
  }, [watchType, currentType]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (values: AgentFormValues) => {
      try {
        setIsSubmitting(true);
        setSubmitError(null);
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
        setSubmitError(
          error instanceof Error
            ? error.message
            : 'An unknown error occurred while submitting the form.'
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmit]
  );

  // Reset form with new values
  const resetForm = useCallback(
    (values: Partial<AgentFormValues> = {}) => {
      form.reset({
        type: AgentType.LLM,
        isPublic: false,
        tags: [],
        ...values,
      });
      setCurrentType(values.type || AgentType.LLM);
    },
    [form]
  );

  // Handle agent type change
  const handleTypeChange = useCallback(
    (newType: AgentType) => {
      if (newType === currentType) return;
      
      // Get current form values
      const currentValues = form.getValues();
      
      // Reset form with new type and preserve common fields
      resetForm({
        ...currentValues,
        type: newType,
      });
    },
    [currentType, form, resetForm]
  );

  // Get form field error
  const getFieldError = useCallback(
    (fieldName: string) => {
      const error = form.formState.errors[fieldName as keyof typeof form.formState.errors];
      return error?.message as string | undefined;
    },
    [form.formState.errors]
  );

  // Check if field has error
  const hasError = useCallback(
    (fieldName: string) => {
      return !!getFieldError(fieldName);
    },
    [getFieldError]
  );

  // Register a field with common props
  const registerField = useCallback(
    (name: string, options = {}) => {
      const error = getFieldError(name);
      return {
        ...form.register(name, options),
        error: !!error,
        helperText: error,
      };
    },
    [form.register, getFieldError]
  );

  // Handle array field operations
  const handleArrayField = useCallback(
    (fieldName: string) => ({
      append: (value: any) => {
        const current = form.getValues(fieldName) || [];
        form.setValue(fieldName, [...current, value], { shouldValidate: true });
      },
      remove: (index: number) => {
        const current = form.getValues(fieldName) || [];
        form.setValue(
          fieldName,
          current.filter((_: any, i: number) => i !== index),
          { shouldValidate: true }
        );
      },
      update: (index: number, value: any) => {
        const current = form.getValues(fieldName) || [];
        const updated = [...current];
        updated[index] = value;
        form.setValue(fieldName, updated, { shouldValidate: true });
      },
      fields: (form.getValues(fieldName) as any[]) || [],
    }),
    [form]
  );

  // Handle nested form fields
  const registerNestedField = useCallback(
    (prefix: string, fieldName: string, options = {}) => {
      const fullPath = `${prefix}.${fieldName}`;
      const error = getFieldError(fullPath);
      
      return {
        ...form.register(fullPath, options),
        name: fullPath,
        error: !!error,
        helperText: error,
      };
    },
    [form.register, getFieldError]
  );

  // Set a form field value with validation
  const setFieldValue = useCallback(
    (name: string, value: any, shouldValidate = true) => {
      form.setValue(name, value, { shouldValidate });
    },
    [form]
  );

  // Get a form field value
  const getFieldValue = useCallback(
    (name: string) => {
      return form.getValues(name);
    },
    [form]
  );

  // Check if form is dirty
  const isDirty = form.formState.isDirty;

  // Get form values
  const values = form.watch();

  return {
    // Form methods
    ...form,
    handleSubmit: form.handleSubmit(handleSubmit),
    resetForm,
    isSubmitting,
    submitError,
    currentType,
    
    // Field handling
    registerField,
    registerNestedField,
    handleArrayField,
    setFieldValue,
    getFieldValue,
    getFieldError,
    hasError,
    
    // Form state
    isDirty,
    values,
    errors: form.formState.errors,
    isValid: form.formState.isValid,
    isSubmitting: form.formState.isSubmitting,
    isSubmitSuccessful: form.formState.isSubmitSuccessful,
    
    // Type handling
    handleTypeChange,
  };
}

export type UseAgentFormReturn = ReturnType<typeof useAgentFormState>;
