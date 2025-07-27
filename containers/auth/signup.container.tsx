'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import { ArrowUpLeft, Loader2Icon } from 'lucide-react'
import Link from 'next/link'
import useFormAction from '@/hooks/useFormAction'
import { formSignupSchema } from '@/types/form-schema'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useState } from 'react'
import LoadingOverlay from '@/components/LoadingOverlay'

export default function AuthSignupContainer() {
  const [loading, setLoading] = useState<boolean>(false)
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()
  const { form } = useFormAction({
    schema: formSignupSchema,
    defaultValues: {
      full_name: '',
      phone: '',
      address: '',
      image_url: '',
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSignupSchema>) => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      }).then((res) => res.json())

      if (!response.success) {
        setLoading(false)
        toast.error(`${response.message}`)
      } else {
        toast.success('Sign up successful')
        router.push('/sign-in')
      }
    } catch (error) {
      console.log('error => ', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <LoadingOverlay isLoading={isUploading} message="uploading image..." />
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-4">
          <div>
            <Link href="/">
              <Button variant="link">
                <ArrowUpLeft />
                Home
              </Button>
            </Link>
          </div>
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>
                Enter your profile to creating account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="full_name"
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
                    name="image_url"
                    render={() => (
                      <FormItem>
                        <FormLabel>Upload Images</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={async (e) => {
                              const files = e?.target?.files?.[0]
                              if (!files) return
                              setIsUploading(true)
                              const uploadedUrls: string[] = []

                              const formData = new FormData()
                              formData.append('image', files)

                              // 👇 request ke Cloudinary
                              const res = await fetch(`/api/upload`, {
                                method: 'POST',
                                body: formData,
                              })

                              const data = await res.json()
                              uploadedUrls.push(data.data.secure_url)

                              setIsUploading(false)

                              // 👇 set ke form field `images`

                              form.setValue('image_url', data.data.secure_url)
                            }}
                          />
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
                          <Input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="phone ..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Address ..." {...field} />
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
                          <Input placeholder="email ..." {...field} />
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
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="password ..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="space-y-8">
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading && <Loader2Icon className="animate-spin" />}
                      {loading ? 'loading' : 'Sign Up'}
                    </Button>
                  </div>
                  <div className="space-y-8 text-center">
                    Already have an account?{' '}
                    <Link
                      href="/sign-in"
                      className="underline underline-offset-4"
                    >
                      Sign in
                    </Link>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
