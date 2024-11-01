import TweetCard from "@/components/TweetCard";
import { fetchtweets } from "@/lib/actions/tweets.actions";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";

export default async function HomePage() {
  const result = await fetchtweets(1, 30);
  const user = await currentUser();

  console.log(result)
  return (
    <div>
      <h1 className="head-text text-left">Home</h1>

      <section>
        {result.tweets.length === 0 ? (
          <p>
            {/*  */}
            no tweets
          </p>
        ) : (
          <div className="flex mt-5 flex-col gap-y-7">
            {result.tweets.map((tweet, i) => (
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
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
