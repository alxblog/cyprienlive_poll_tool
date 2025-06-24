"use client"
import { useState } from "react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"

const validationString = z.string().max(25, "Max 25 char.").optional().or(z.literal(''))

const formSchema = z.object({
  title: z.string().min(1).max(60, "Max 60 char."),
  duration: z.coerce.number(),
  choice1: z.string().min(1).max(25, "Max 25 char."),
  choice2: z.string().min(1).max(25, "Max 25 char."),
  choice3: validationString,
  choice4: validationString,
  choice5: validationString,
});

export default function MyForm() {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "Cette vidéo c'est :",
      duration: 1,
      choice1: "Prime",
      choice2: "Je connais par coeur",
      choice3: "Mignon",
      choice4: "Pouce rouge",
      choice5: "Supprime",
    },

  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { title, duration, ...choices } = values
      const data = {
        title,
        duration: duration * 60,
        choices: Object.entries(choices).reduce<string[]>((acc, [key, value]) => {
          if (value) acc.push(String(value))
          return acc
        }, [])
      }
      console.log("data to submit:", data);
      
      const response = await fetch("/auth/publish_poll", {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(data),
      }
      );
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      console.log(json);
      toast.success(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      );


    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full max-w-3xl">
        <div className="flex space-x-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex-1 w-full">
                <FormLabel className="text-[#a5b6a0] text-sm font-normal leading-normal">Poll Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder=""

                    type="text"
                    {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#a5b6a0] text-sm font-normal leading-normal">Duration</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[1, 2, 3, 5, 10].map(duration => <SelectItem key={duration} value={String(duration)}>{`${duration}min`}</SelectItem>)}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="choice1"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#a5b6a0] text-sm font-normal leading-normal">Choice 1</FormLabel>
                <FormControl>
                  <Input
                    placeholder=""

                    type="text"
                    {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="choice2"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#a5b6a0] text-sm font-normal leading-normal">Choice 2</FormLabel>
                <FormControl>
                  <Input
                    placeholder=""

                    type="text"
                    {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="choice3"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#a5b6a0] text-sm font-normal leading-normal">Choice 3</FormLabel>
                <FormControl>
                  <Input
                    placeholder=""

                    type="text"
                    {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="choice4"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#a5b6a0] text-sm font-normal leading-normal">Choice 4</FormLabel>
                <FormControl>
                  <Input
                    placeholder=""

                    type="text"
                    {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="choice5"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#a5b6a0] text-sm font-normal leading-normal">Choice 5</FormLabel>
                <FormControl>
                  <Input
                    placeholder=""

                    type="text"
                    {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}