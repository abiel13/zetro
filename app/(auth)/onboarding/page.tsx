import AccountProfile from "@/components/forms/AccountProfile";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const OnboardingPage =async () => {

const user = await currentUser();


const userInfo = await fetchUser(user!.id);
if(userInfo?.onboarded) redirect('/');

const userData = {
  id: user!.id,
  objectId: userInfo?._id,
  username: userInfo ? userInfo?.username : user?.username,
  name: userInfo ? userInfo?.name : user?.firstName ?? "",
  bio: userInfo ? userInfo?.bio : "",
  image: userInfo ? userInfo?.image : user?.imageUrl,
};


  return (
    <section className="mx-auto flex max-w-3xl flex-col px-10 py-20">
      <h1 className="head-text">onboarding</h1>
      <p className="mt-3 text-base-regular text-light-2">
        Complete your profile to use Zetro
      </p>

      <section className="mt-9 bg-dark-2 p-10 ">
        <AccountProfile user={userData} />
      </section>
    </section>
  );
};

export default OnboardingPage;
