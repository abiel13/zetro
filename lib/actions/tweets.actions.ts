"use server";
import { revalidatePath } from "next/cache";
import Tweets from "../models/tweets.models";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import PagesManifestPlugin from "next/dist/build/webpack/plugins/pages-manifest-plugin";

interface createTweetP {
  text: string;
  author: string;
  communityId: string;
  thumbnail: string;
  path: string;
}

export async function createTweet({
  text,
  author,
  communityId,
  thumbnail,
  path,
}: createTweetP) {
  await connectToDB();

  try {
    const tweet = await Tweets.create({
      text,
      author,
      communityId: null,
      thumbnail,
      children:[],
    });
    console.log(tweet);
    // push tweet to mdel
    await User.findByIdAndUpdate(author, {
      $push: { tweets: tweet._id },
    });

    revalidatePath(path);
  } catch (error) {
    console.error(error);
  }
}

export async function fetchtweets(pageNumber = 1, pageSize = 20) {
  connectToDB();

  const skip = (pageNumber - 1) * pageSize;

  const postQuery = Tweets.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skip)
    .limit(pageSize)
    .populate({
      path: "author",
      model: User,
      select: "_id name parentId image",
    })
    .populate({
      path: "children",
      model: Tweets,
      populate: {
        path: "author",
        model: User,
        select: "_id name parentId image",
      },
    });

  const totalPostsCount = await Tweets.countDocuments({
    parentId: { $in: [null, undefined] },
  });

  const tweets = await postQuery.exec();

  const isNext: boolean = totalPostsCount > skip + tweets.length;

  return { tweets, isNext };
}

export async function fetchTweetById(id: string) {
  connectToDB();

  try {
    const tweet = await Tweets.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        model: Tweets,
        populate: {
          path: "author",
          model: User,
          select: "_id id name parentId image",
        },
      })
      .exec();
    return JSON.parse(JSON.stringify(tweet));
  } catch (error: any) {
    console.log(error.message);
  }
}

export async function addCommentToTweet(
  tweetId: string,
  commentText: string,
  thumbnail: string,
  userId: string,
  path: string
) {
  try {
    const originalTweet = await Tweets.findById(tweetId);

    if (!originalTweet) {
      
      throw new Error("Thread not found");
    }

    console.log(originalTweet._doc)
    const commentThread = new Tweets({
      text: commentText,
      author: userId,
      parentId: tweetId,
      thumbnail,
    });

    const savedComment = await commentThread.save();

    if (!originalTweet.children) {
      originalTweet.children = [];
    }

    originalTweet.children.push(savedComment._id);

    await originalTweet.save();

    revalidatePath(path);
  } catch (error:any) {
  console.log(error.message)
  }
}
