import React, { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { fetchTools, ToolDTO } from '@/api/toolService'
import { Checkbox } from '@/components/ui/checkbox'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Label } from '@/components/ui/label'

const AgentToolsTab: React.FC = () => {
  const { control } = useFormContext()
  const [tools, setTools] = useState<ToolDTO[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTools = async () => {
      try {
        const fetched = await fetchTools()
        setTools(fetched)
      } catch (err) {
        setError('Failed to load tools')
      } finally {
        setIsLoading(false)
      }
    }
    loadTools()
  }, [])

  if (isLoading) {
    return <p>Loading tools...</p>
  }

  if (error) {
    return <p className="text-destructive">{error}</p>
  }

  return (
    <FormField
      control={control}
      name="tools"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="sr-only">Ferramentas</FormLabel>
          <FormControl>
            <div className="space-y-3">
              {tools.map((tool) => {
                const checked = field.value?.includes(tool.id)
                const handleChange = (checked: boolean) => {
                  const current = field.value || []
                  if (checked) {
                    field.onChange([...current, tool.id])
                  } else {
                    field.onChange(
                      current.filter((id: string) => id !== tool.id),
                    )
                  }
                }
                return (
                  <div key={tool.id} className="flex items-start gap-3">
                    <Checkbox
                      id={`tool-${tool.id}`}
                      checked={checked}
                      onCheckedChange={handleChange}
                    />
                    <Label htmlFor={`tool-${tool.id}`} className="font-medium">
                      {tool.name}
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      {tool.description}
                    </span>
                  </div>
                )
              })}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default AgentToolsTab
