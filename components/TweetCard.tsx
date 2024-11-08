import { formatDateString } from "@/lib/utils/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface TweetCardI {
  id: string;
  currentUserId: string;
  parentId: string;
  content: string;
  thumbnail: string;
  author: {
    name: string;
    image: string;
    _id: string;
  };
  communnity: {
    id: string;
    name: string;
    image: string;
  } | null;
  createdAt: Date;
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
}

function TweetCard({
  id,
  currentUserId,
  parentId,
  content,
  thumbnail,
  author,
  communnity,
  createdAt,
  comments,
  isComment,
}: TweetCardI) {
  return (
    <article
      className={`flex w-full flex-col rounded-xl ${
        isComment
          ? "px-0 xs:px-7 "
          : "bg-card-bg shadow-card-shadow shadow-lg p-7"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col item-center">
            <Link
              href={`/profile/${author._id}`}
              className="w-11 h-11 relative"
            >
              <Image
                src={author.image}
                alt="profile img"
                fill
                className="cursor-pointer rounded-full"
              />
            </Link>

            <div className="thread-card_bar" />
          </div>
          <div className="flex w-full flex-col">
            <Link href={`/profile/${author._id}`} className="w-fit">
              <h3 className="cursor-pointer text-base-semibold text-text capitalize mb-4">
                {author.name}
              </h3>
            </Link>
            {thumbnail && (
              <div className="h-[450px] relative">
                <Image
                  src={thumbnail}
                  alt="thumbnail"
                  width={250}
                  height={250}
                  className="rounded-xl w-auto max-h-full object-cover "
                />
              </div>
            )}
            <p className="mt-2 text-small-regular text-text">{content}</p>

            <div className="mt-5 flex flex-col gap-3">
              <div className="flex gap-3.5  ">
                <Image
                  src={"/assets/heart-gray.svg"}
                  alt="heart"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />{" "}
                <Link href={`/tweets/${id}`}>
                  <Image
                    src={"/assets/reply.svg"}
                    alt="heart"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />{" "}
                </Link>
                <Image
                  src={"/assets/repost.svg"}
                  alt="heart"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />{" "}
                <Image
                  src={"/assets/share.svg"}
                  alt="heart"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
              </div>

              {!isComment && comments.length > 0 && (
                <Link
                  href={`/tweets/${id}`}
                  className="flex items-center gap-2"
                >
                  <div className="w-8 h-8 bg-red-400 rounded-full relative">
                    {comments.slice(0, 2).map((comment, i) => (
                      <Image
                        style={{
                          left: (i * 20) + "px !important",
                        }}
                        src={comment.author.image}
                        key={i}
                        alt="profile image"
                        fill
                        className={`absolute z-${i * 10} rounded-full  `}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-subtle-medium text-text ml-4">
                    {comments.length} comments
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>{" "}
      {!isComment && communnity && (
        <Link
          href={"/communities/$community.id"}
          className="mt-5 flex items-center"
        >
          <p>
            {formatDateString(createdAt)} - {communnity.name} Community
          </p>
          <Image
            src={communnity.image}
            alt="community image"
            width={14}
            height={14}
            className="ml-11 rounded-full"
          />
        </Link>
      )}
    </article>
  );
}

export default TweetCard;
