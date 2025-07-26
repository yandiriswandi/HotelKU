'use client'

import { Button } from '@/components/ui/button'
import { FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Trash2 } from 'lucide-react'
import { useFieldArray, useFormContext } from 'react-hook-form'

// 👇 Komponen form videos (inline)
export function VideoTableForm() {
  const form = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'videos',
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <FormLabel className="text-lg font-medium">Videos</FormLabel>
        <Button
          type="button"
          onClick={() => append({ title: '', description: '', video_url: '' })}
        >
          + Add Video
        </Button>
      </div>

      {fields.length === 0 && (
        <p className="text-sm text-muted-foreground">No videos added.</p>
      )}

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-4 gap-4 items-end border rounded-md p-4"
          >
            <div className="col-span-2 space-y-2">
              <FormLabel>Title</FormLabel>
              <Input
                {...form.register(`videos.${index}.title`)}
                placeholder="Title"
              />
            </div>

            <div className="col-span-2 space-y-2">
              <FormLabel>Video URL</FormLabel>
              <Input
                {...form.register(`videos.${index}.video_url`)}
                placeholder="https://..."
              />
            </div>
            <div className="col-span-4 space-y-2">
              <FormLabel>Description</FormLabel>
              <Textarea
                {...form.register(`videos.${index}.description`)}
                placeholder="Description"
              />
            </div>
            <div className="col-span-4 text-right">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => remove(index)}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
