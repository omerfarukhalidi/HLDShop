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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'


const formSchema = z.object({
  fullname: z.string().min(2, {
    message: "Lütfen adınızı giriniz.",
  }),
  username: z.string().min(2, {
    message: "Lütfen kullanıcı adını giriniz.",
  }),
  password: z.string().min(2, {
    message: "Lütfen şifrenizi giriniz.",
  }),
  email: z.string().email({
    message: "Lütfen mail adresinizi giriniz.",
  }),
  birthDate: z.string().refine(date => {
    const birthDate = new Date(date)
    const age = new Date().getFullYear() - birthDate.getFullYear()
    return age >= 18
  }, {
    message: "18 yaşından büyük olmalısınız.",
  }),
  startDate: z.string().refine(date => {
    const startDate = new Date(date)
    return startDate >= new Date()
  }, {
    message: "Başlagın tarıhini doğru giriniz.",
  }),
  gender: z.enum(["Erkek", "Kadın", "Diğer"], {
    required_error: "Lütfen cinsiyet seçiniz."
  }),
  jobType: z.array(z.enum(["Uzaktan", "Hibrit", "Ofiste"])).min(1, {
    message: "En az birini seçmeniz gerek.",
  })

})


const RegisterPage = () => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      username: "",
      password: "",
      email: "",
      birthDate: "",
      startDate: "",
      gender: undefined,
      jobType: []
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("asd")

    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 w-4/5">
        <FormField
          control={form.control}
          name="fullname"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='validatLabel'>Adınız</FormLabel>
              <FormControl>
                <Input placeholder="Adınız" {...field} />
              </FormControl>
              <FormMessage className='validatError' />
            </FormItem>
          )}
        />
             <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='validatLabel'>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage className='validatError' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
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
                <Input placeholder="Şifre" {...field} />
              </FormControl>
              <FormMessage className='validatError' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='validatLabel'>Doğum Tarihi</FormLabel>
              <FormControl>
                <Input type='date' className='w-36' placeholder="birthDate" {...field} />
              </FormControl>
              <FormMessage className='validatError' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='validatLabel'>Başlangıç Tarihi</FormLabel>
              <FormControl>
                <Input type='date' className='w-36' placeholder="birthDate" {...field} />
              </FormControl>
              <FormMessage className='validatError' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='validatLabel'>Cinsiyet</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  {...field}
                  className="flex flex-row space-x-2"
                >
                  <RadioGroupItem value="Erkek" id="gender-male" />
                  <Label htmlFor="gender-male">Erkek</Label>
                  <RadioGroupItem value="Kadın" id="gender-female" />
                  <Label htmlFor="gender-female">Kadın</Label>
                  <RadioGroupItem value="Diğer" id="gender-other" />
                  <Label htmlFor="gender-other">Diğer</Label>


                </RadioGroup>

              </FormControl>
              <FormMessage className='validatError' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="jobType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='validatLabel'>Çalışma Türü</FormLabel>
              <FormControl>
                <div className="space-x-2">
                  <Checkbox
                    checked={field.value.includes("Uzaktan")}
                    onCheckedChange={(checked) => {
                      const newValue = checked
                        ? [...field.value, "Uzaktan"]
                        : field.value.filter((value: string) => value !== "Remote")
                      field.onChange(newValue)
                    }}
                  />
                  <Label>Uaktan</Label>
                  <Checkbox
                    checked={field.value.includes("Hibrit")}
                    onCheckedChange={(checked) => {
                      const newValue = checked
                        ? [...field.value, "Hibrit"]
                        : field.value.filter((value: string) => value !== "Hybrid")
                      field.onChange(newValue)
                    }}
                  />
                  <Label>Hibrit</Label>
                  <Checkbox
                    checked={field.value.includes("Ofiste")}
                    onCheckedChange={(checked) => {
                      const newValue = checked
                        ? [...field.value, "Ofiste"]
                        : field.value.filter((value: string) => value !== "Office")
                      field.onChange(newValue)
                    }}
                  />
                  <Label>Ofiste</Label>
                </div>


              </FormControl>
              <FormMessage className='validatError' />
            </FormItem>
          )}
        />

        <Button type="submit">Kaydol</Button>
      </form>

      <div className='mt-8'>
        <Label>Hesabınız hazır mı? </Label>
        <Link href="/login">
          Giriş yapmak için tıklayın.
        </Link>


      </div>
    </Form>
  )
}

export default RegisterPage