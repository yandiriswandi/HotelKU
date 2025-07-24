'use client'

import { useEffect, useRef, useState } from 'react'
import useFormAction from '@/hooks/useFormAction'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerFooter,
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2Icon } from 'lucide-react'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'
import { formProfileSchema } from '@/types/form-schema'

type Profile = {
  full_name: string
  phone: string
  email: string
  min_salary_expectation: string
  max_salary_expectation: string
  summary: string
}

export default function UpdateApplicantProfile({
  open,
  onOpen,
  onFinish,
}: {
  open: boolean
  onOpen: () => void
  onFinish: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const { form } = useFormAction({
    schema: formProfileSchema,
    defaultValues: {
      full_name: '',
      phone: '',
      email: '',
      password: '',
      min_salary_expectation: '',
      max_salary_expectation: '',
      summary: '',
    },
    values: profile ?? undefined,
  })

  useEffect(() => {
    if (open) {
      fetch('/api/profile')
        .then((res) => res.json())
        .then(({ data }) => setProfile(data))
    }
  }, [open])

  const onSubmit = async (values: Profile) => {
    setLoading(true)
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })

    if (res.ok) {
      toast.success('Profile updated successfully')
      onFinish()
      onOpen()
    } else {
      toast.error('Failed to update profile')
    }
    setLoading(false)
  }

  return (
    <Drawer open={open} onOpenChange={onOpen}>
      <DrawerContent>
        <DrawerTitle className="text-center">Update Profile</DrawerTitle>
        <div className="p-4 space-y-4">
          {profile && (
            <Form {...form}>
              <form
                ref={formRef}
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password (optional)</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="min_salary_expectation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Salary Expectation</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="max_salary_expectation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Salary Expectation</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Summary</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          )}
        </div>
        <DrawerFooter className="flex gap-2 p-4">
          <Button variant="secondary" onClick={onOpen}>
            Cancel
          </Button>
          <Button
            onClick={() => formRef.current?.requestSubmit()}
            disabled={loading}
          >
            {loading && <Loader2Icon className="animate-spin mr-2" />}
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
