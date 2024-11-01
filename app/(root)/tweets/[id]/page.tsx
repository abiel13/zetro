import TweetCard from "@/components/TweetCard";
import Comment from "@/components/forms/Comment";
import { fetchTweetById } from "@/lib/actions/tweets.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const TweetDetailPage = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;

  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const tweet = await fetchTweetById(params.id);

  return (
    <div className="relative">
      <TweetCard
        key={tweet._id}
        id={tweet._id}
        currentUserId={user?.id || ""}
        parentId={tweet.parentId}
        content={tweet.text}
        thumbnail={tweet.thumbnail}
        author={tweet.author}
        communnity={tweet.community}
        createdAt={tweet.createdAt}
        comments={tweet.children}
      />

      <div className="mt-7">
        <Comment tweetId={tweet._id} 
        currentUserImg={user.imageUrl}
        currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>
    </div>
  );
};

export default TweetDetailPage;
