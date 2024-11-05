"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { Textarea } from "../ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

import { createTweet } from "@/lib/actions/tweets.actions";
import { threadValidaton } from "@/lib/validations/thread";
import { useOrganization } from "@clerk/nextjs";

const PostThread = ({ userId }: { userId: string }) => {
  const [Files, setFiles] = useState<File[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  const {organization} = useOrganization()

  async function onSubmit(values: z.infer<typeof threadValidaton>) {
    try {
      
      await createTweet({
        text: values.thread,
        author: userId,
        path: pathname,
        communityId: organization ? organization?.id : null,
        thumbnail: Files[0] ? values.thumbnail! : "",
      });

      router.push("/");
    } catch (error) {
      console.log(error);
    }
  }

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles([file]);

      const fileReader = new FileReader();
      fileReader.onload = (event: any) => {
        form.setValue("thumbnail", event?.target?.result?.toString() || "");
      };
      console.log()
      fileReader.readAsDataURL(file);
    }
  };

  const form = useForm({
    resolver: zodResolver(threadValidaton),
    defaultValues: {
      thread: "",
      userId: userId,
      thumbnail: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6 p-8 bg-[#1f1f2e] rounded-lg shadow-lg w-full mx-auto mt-12"
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white text-lg font-semibold">
                Share Your Thoughts
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  className="bg-[#2b2b40] text-white border border-[#40405a] focus:border-red-500 rounded-md p-4"
                  placeholder="Write your message here..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel className="text-white text-lg font-semibold">
            Upload an Image
          </FormLabel>
          <FormControl>
            <input
              type="file"
              accept="image/*"
              className="block w-full text-white bg-[#2b2b40] border border-[#40405a] rounded-md p-2 cursor-pointer"
              onChange={handleImage}
            />
          </FormControl>
          <FormMessage />
        </FormItem>

        {Files.length > 0 && (
          <div className="mt-4">
            <p className="text-white text-sm font-medium">Image Preview:</p>
            <div className="mt-2 flex justify-center rounded-lg overflow-hidden">
              <Image
                src={URL.createObjectURL(Files[0])}
                alt="Selected image"
                width={250}
                height={250}
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        )}

        <Button
        type="submit"
          className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg mt-4"
        >
          Create Tweet
        </Button>
      </form>
    </Form>
  );
};

export default PostThread;
