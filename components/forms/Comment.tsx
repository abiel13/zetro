"use client";
import React, { useState } from "react";
import { ImageIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import * as z from "zod";
import Image from "next/image";
import { commentValidation } from "@/lib/validations/thread";
import { addCommentToTweet } from "@/lib/actions/tweets.actions";

interface CommentProps {
  tweetId: string;
  currentUserImg: string;
  currentUserId: string;
}

function Comment({ tweetId, currentUserImg, currentUserId }: CommentProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof commentValidation>) {
    try {
      await addCommentToTweet(
        tweetId,
        values.thread,
        values.image || "",
        JSON.parse(currentUserId),
        pathname
      );
      form.setValue("thread", " ");
      form.setValue("image", " ");
    } catch (error) {
      console.log(error);
    }
  }

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const fileReader = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles([file]);

      fileReader.onload = (event: any) => {
        const imageDataUrl = event.target.result.toString();
        setImagePreview(imageDataUrl);
        form.setValue("image", imageDataUrl);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const form = useForm({
    resolver: zodResolver(commentValidation),
    defaultValues: {
      thread: "",
      image: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 bg-gray-800    rounded-lg shadow-md w-full mx-auto flex-col items-start"
      >
        <div className="flex flex-row w-full items-center gap-2 h-full p-4 rounded">
          <FormField
            control={form.control}
            name="thread"
            render={({ field }) => (
              <FormItem className="w-full items-center flex gap-4">
                <Image
                  src={currentUserImg}
                  alt="profile image"
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
                <FormControl className="flex-1 ">
                  <Input
                    type="text"
                    placeholder="What's on your mind?"
                    className="bg-gray-700 text-white placeholder-gray-400 border-none focus:ring-2 focus:ring-blue-500 rounded-lg px-4 py-2"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="file-upload"
              onChange={handleImage}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <ImageIcon color="#aaa" fontSize={27} />
            </label>
            <Button
              type="submit"
              className=" py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-md"
            >
              Post Comment
            </Button>
          </div>
        </div>
        <div className={`${imagePreview && "p-2"}`}>
          {imagePreview && (
            <div className="relative w-12 h-12 p-4">
              <Image
                src={imagePreview}
                alt="uploaded image preview"
                layout="fill"
                className="object-cover rounded-lg shadow-md"
              />
            </div>
          )}
        </div>
      </form>
    </Form>
  );
}

export default Comment;
