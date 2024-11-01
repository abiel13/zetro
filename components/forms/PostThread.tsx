"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import * as z from "zod";
import Image from "next/image";

import { userValidation } from "@/lib/validations/user";
import CreateThread from "@/app/(root)/create-thread/page";
import { createTweet } from "@/lib/actions/tweets.actions";
import { threadValidaton } from "@/lib/validations/thread";

const PostThread = ({ userId }: { userId: string }) => {
  const [Files, setFiles] = useState<File[]>([]);
  const pathname = usePathname();
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof threadValidaton>) {
    try {
      await createTweet({
        text: values.thread,
        author: userId,
        path: pathname,
        communityId: "",
        thumbnail:''
      });
    } catch (error) {
      console.log(error);
    }
  }

  const handleImage = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      setFiles(Array.from(e.target.files));

      fileReader.onload = async (event: any) => {
        const imageDataUrl = event?.target?.result?.toString() || "";

        fieldChange(imageDataUrl);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const form = useForm({
    resolver: zodResolver(threadValidaton),
    defaultValues: {
      thread: "",
      userId: userId,
    },
  });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-start gap-10 mt-10"
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="w-full flex-col  flex justify-start   gap-4">
              <FormLabel
                style={{
                  color: "white",
                }}
                className="text-light-2 mt-10 text-base-semibold text-xl"
              >
                Content
              </FormLabel>
              <FormControl className="no-focus bg-dark-4 border-dark-3  text-light-1">
                <Textarea rows={15} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="bg-red-400 text-white w-full px-2 py-2 font-bold"
        >
          Create Tweet
        </Button>
      </form>
    </Form>
  );
};

export default PostThread;
