/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerTitle,
} from '@/components/ui/drawer'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { defaultValueRoom } from '@/constants'
import useFormAction from '@/hooks/useFormAction'
import { ValueRoomType } from '@/types/common'
import { formRoomSchema } from '@/types/form-schema'
import { Loader2Icon } from 'lucide-react'
import { useRef, useState } from 'react'
import { z } from 'zod'
import { VideoTableForm } from './form-videos'
import { toast } from 'sonner'
import LoadingOverlay from '@/components/LoadingOverlay'

type AdminRoomsFormProps = {
  open: ValueRoomType
  onOpen: () => void
  onFinish: () => void
  values?: z.infer<typeof formRoomSchema> | any
}

export default function AdminRoomsForm({
  open,
  values,
  onOpen,
  onFinish,
}: AdminRoomsFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [isUploading, setIsUploading] = useState(false)
  const { form } = useFormAction({
    schema: formRoomSchema,
    defaultValues: defaultValueRoom,
    values,
  })

  const onSubmitClick = () => {
    formRef.current?.requestSubmit()
  }

  const onSubmit = async (values: z.infer<typeof formRoomSchema>) => {
    console.log('values=>', values)
    setLoading(true)
    try {
      const response = await fetch(
        `/api/rooms${open?.type === 'edit' ? `/${open?.data.id}` : ''}`,
        {
          method: open?.type === 'create' ? 'POST' : 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        },
      )
      if (response.ok) {
        toast.success(`${open?.type} successful`)
        onFinish()
        handleClose()
      }
    } catch (error) {
      console.log('error => ', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    onOpen()
    form.reset()
  }

  return (
    <div>
      <LoadingOverlay isLoading={isUploading} message="uploading image..." />
      <Drawer open={!!open.type} onOpenChange={handleClose}>
        <DrawerContent>
          <DrawerTitle className="text-center mb-4">Rooms</DrawerTitle>
          <div className="max-h-[90vh] overflow-y-auto container p-4 w-full max-w-full mx-auto">
            <Form {...form}>
              <form
                ref={formRef}
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="grid grid-cols-2 gap-4 space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="name ..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="images"
                    render={() => (
                      <FormItem>
                        <FormLabel>Upload Images</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={async (e) => {
                              const files = e.target.files
                              if (!files) return
                              setIsUploading(true)
                              const uploadedUrls: string[] = []

                              for (const file of Array.from(files)) {
                                const formData = new FormData()
                                formData.append('image', file)

                                // 👇 request ke Cloudinary
                                const res = await fetch(`/api/upload`, {
                                  method: 'POST',
                                  body: formData,
                                })

                                const data = await res.json()
                                uploadedUrls.push(data.data.secure_url)
                              }
                              setIsUploading(false)

                              // 👇 set ke form field `images`
                              console.log('uploadata=>', uploadedUrls)

                              form.setValue('images', uploadedUrls)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="price ..."
                            type="number"
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value
                              field.onChange(value) // masih string, sesuai schema
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel>Discount</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="discount ..."
                            type="number"
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value
                              field.onChange(value) // masih string, sesuai schema
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="total_room"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel>Total Room</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="total room ..."
                            type="number"
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value
                              field.onChange(value) // masih string, sesuai schema
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="description ..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <VideoTableForm />
              </form>
            </Form>
          </div>
          <DrawerFooter>
            <div className="flex gap-2 justify-end p-4 container w-full max-w-sm mx-auto">
              <Button
                size="lg"
                variant="secondary"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                size="lg"
                onClick={() => onSubmitClick()}
                disabled={loading}
              >
                {loading && <Loader2Icon className="animate-spin" />}
                {loading ? 'Loading' : 'Submit'}
              </Button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
