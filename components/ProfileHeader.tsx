import Image from "next/image";
import React from "react";

interface ProfI {
  accountId: string;
  authUserId: string;
  name: string;
  username: string;
  imgUrl: string;
  bio: string;
  type?:any
}

function ProfileHeader({
  accountId,
  authUserId,
  name,
  username,
  imgUrl,
  bio,
}: ProfI) {
  return (
    <div className="flex w-full flex-col items-center justify-start">
      <div className="flex items-center justify-between">
        <div className="flex-items-center gap-3">
          <div className="relative h-20 w-20 object-cover">
            <Image
              src={imgUrl}
              alt="profile img"
              fill
              className="rounded-full object-contain shadow-2xl"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-left text-heading3-bold text-light-1">
              {name}
            </h2>
            <p>@{username}</p>
          </div>
        </div>
      </div>{" "}
      <p className="mt-6 max-w-lg text-base-regular text-light-2">{bio}</p>
      <div className="mt-12 h-0.5 w-full bg-white" />
    </div>
  );
}

export default ProfileHeader;
