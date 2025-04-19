"use client"

import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from '@/components/ui/label'
import Link from 'next/link'

const formSchema = z.object({
  Kullanıcıadı: z.string().min(2, {
    message: "Kullanıcı adı girmediniz.",
  }),
  password: z.string().min(2, {
    message: "Şifre girmediniz.",
  }),

})

const LoginPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Kullanıcıadı: "",
      password:""
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
  
    console.log(values)
  }

  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-4/5">
      <FormField
        control={form.control}
        name="Kullanıcıadı"
        render={({ field }) => (
          <FormItem>
            <FormLabel className='validatLabel'>Kullanıcı Adı</FormLabel>
            <FormControl>
              <Input placeholder="Kullanıcı Adı" {...field} />
            </FormControl>
            <FormMessage className='validatError' />
            </FormItem>
        )}
      />
       <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel className='validatLabel'>Şifre</FormLabel>
            <FormControl>
              <Input placeholder="************" {...field} />
            </FormControl>
           <FormMessage className='validatError' />
          </FormItem>
        )}
      />
      <Button type="submit">Giriş</Button>
    </form>

    <div className='mt-8'>
      <Label>Üyeliğiniz yok mu? </Label>
      <Link href="/create-user">
      Üye Olmak İçin Tıklayın.
      </Link>


    </div>
  </Form>
  )
}

export default LoginPage