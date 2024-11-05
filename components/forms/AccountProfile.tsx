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
  import { useForm } from "react-hook-form";
  import { zodResolver } from "@hookform/resolvers/zod";
  import { userValidation } from "@/lib/validations/user";
  import * as z from "zod";
  import Image from "next/image";
  import { Textarea } from "../ui/textarea";
  import { isBase64Image } from "@/lib/utils/utils";
  import { useUploadThing } from "@/lib/uploadthing";
  import { updateUser } from "@/lib/actions/user.actions";
  import { usePathname, useRouter } from "next/navigation";

  interface AccountProfileProps {
    user: {
      id: string;
      objectId: string;
      username: string;
      name: string;
      bio: string;
      image: string;
    };
  }

  const AccountProfile = ({ user }: AccountProfileProps) => {
    const [Files, setFiles] = useState<File[]>([]);
    const pathname = usePathname();
    const router = useRouter();
    const { startUpload } = useUploadThing("media");

    async function onSubmit(values: z.infer<typeof userValidation>) {
      const blob = values.profile_photo;

      const hasImageChanged = isBase64Image(blob);

      if (hasImageChanged) {
        const imgRes = await startUpload(Files);

        if (imgRes && imgRes[0].url) {
          values.profile_photo = imgRes[0].url;
        }
      }

      try {
        await updateUser({
          bio: values.bio,
          username: values.username,
          name: values.name,
          image: values.profile_photo,
          userId: user?.id,
          path: pathname,
        });

        if (pathname === "/profile/edit") {
          router.back();
        } else {
          router.push("/");
        }
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
      resolver: zodResolver(userValidation),
      defaultValues: {
        profile_photo: user?.image || " ",
        name: user?.name || "",
        bio: user?.bio || "",
        username: user?.username || "",
      },
    });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-start gap-10"
      >
        <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => (
            <FormItem className="  flex items-center gap-4">
              <FormLabel className="account-form_image-label">
                {field.value ? (
                  <Image
                    src={field.value}
                    alt="profile photo"
                    width={96}
                    height={96}
                    className=" rounded-full object-contain"
                    priority
                  />
                ) : (
                  <Image
                    src={"/assets/profile.svg"}
                    alt="profile photo"
                    width={24}
                    height={24}
                    className="object_contain"
                  />
                )}
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input
                  type="file"
                  placeholder="upload a photo"
                  className="account-form_image-input"
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full flex-col  flex justify-start   gap-4">
              <FormLabel className="text-light-2 text-base-semibold mb-2">
                Name
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input type="text" className="account-form_input py-3" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="w-full flex-col  flex justify-start   gap-4">
              <FormLabel className="text-light-2 text-base-semibold">
                Username
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input type="text" className="account-form_input py-3" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="w-full flex-col  flex justify-start   gap-4">
              <FormLabel className="text-light-2 text-base-semibold">
                Bio
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Textarea rows={10} className="account-form_input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-primary-500">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default AccountProfile;
