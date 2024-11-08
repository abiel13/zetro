"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";

import User from "../models/user.model";
import Tweets from "../models/tweets.models";
import Community from "../models/community.model";

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDB();

  const skipAmount = (pageNumber - 1) * pageSize;

  const postsQuery = Tweets.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: "author",
      model: User,
    })
    .populate({
      path: "community",
      model: Community,
    })
    .populate({
      path: "children", // Populate the children field
      populate: {
        path: "author", // Populate the author field within children
        model: User,
        select: "_id name parentId image", // Select only _id and username fields of the author
      },
    });

  const totalPostsCount = await Tweets.countDocuments({
    parentId: { $in: [null, undefined] },
  }); // Get the total count of posts

  const posts = await postsQuery.exec();

  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext };
}

interface Params {
  text: string,
  author: string,
  communityId: string | null,
  path: string,
  thumbnail:string
}

export async function createTweets({ text, author, communityId, path, thumbnail }: Params
) {
  try {
    connectToDB();

    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    const createdTweets = await Tweets.create({
      text,
      author,
      community: communityIdObject,
      thumbnail, // Assign communityId if provided, or leave it null for personal account
    });

    // Update User model
    await User.findByIdAndUpdate(author, {
      $push: { Tweets: createdTweets._id },
    });

    if (communityIdObject) {
      // Update Community model
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { Tweetss: createdTweets._id },
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create Tweets: ${error.message}`);
  }
}

async function fetchAllChildTweets(tweetsId: string): Promise<any[]> {
  const childTweets = await Tweets.find({ parentId: tweetsId });

  const descendantTweets = [];
  for (const childTweet of childTweets) {
    const descendants = await fetchAllChildTweets(childTweet._id);
    descendantTweets.push(childTweet, ...descendants);
  }

  return descendantTweets;
}

export async function deleteTweets(id: string, path: string): Promise<void> {
  try {
    connectToDB();

    // Find the Tweets to be deleted (the main Tweets)
    const mainTweets = await Tweets.findById(id).populate("author community");

    if (!mainTweets) {
      throw new Error("Tweets not found");
    }

    // Fetch all child Tweetss and their descendants recursively
    const descendantTweetss = await fetchAllChildTweets(id);

    // Get all descendant Tweets IDs including the main Tweets ID and child Tweets IDs
    const descendantTweetsIds = [
      id,
      ...descendantTweetss.map((tweets:any) => tweets._id),
    ];

    // Extract the authorIds and communityIds to update User and Community models respectively
    const uniqueAuthorIds = new Set(
      [
        ...descendantTweetss.map((tweets:any) => tweets.author?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainTweets.author?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    const uniqueCommunityIds = new Set(
      [
        ...descendantTweetss.map((tweets:any) => tweets.community?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainTweets.community?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    // Recursively delete child Tweetss and their descendants
    await Tweets.deleteMany({ _id: { $in: descendantTweetsIds } });

    // Update User model
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { Tweets: { $in: descendantTweetsIds } } }
    );

    // Update Community model
    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { Tweets: { $in: descendantTweetsIds } } }
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete Tweets: ${error.message}`);
  }
}

export async function fetchTweetsById(TweetsId: string) {
  connectToDB();

  try {
    const tweets = await Tweets.findById(TweetsId)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      }) // Populate the author field with _id and username
      .populate({
        path: "community",
        model: Community,
        select: "_id id name image",
      }) // Populate the community field with _id and name
      .populate({
        path: "children", // Populate the children field
        populate: [
          {
            path: "author", // Populate the author field within children
            model: User,
            select: "_id id name parentId image", // Select only _id and username fields of the author
          },
          {
            path: "children", // Populate the children field within children
            model: Tweets, // The model of the nested children (assuming it's the same "Tweets" model)
            populate: {
              path: "author", // Populate the author field within nested children
              model: User,
              select: "_id id name parentId image", // Select only _id and username fields of the author
            },
          },
        ],
      })
      .exec();

    return tweets;
  } catch (err) {
    console.error("Error while fetching Tweets:", err);
    throw new Error("Unable to fetch Tweets");
  }
}

export async function addCommentToTweets(
  tweetsId: string,
  commentText: string,
  userId: string,
  path: string,
  thumbnail:string
) {
  connectToDB();

  try {
    // Find the original Tweets by its ID
    const originalTweets = await Tweets.findById(tweetsId);

    if (!originalTweets) {
      throw new Error("Tweets not found");
    }

    // Create the new comment Tweets
    const commentTweets = new Tweets({
      text: commentText,
      author: userId,
      parentId: tweetsId,
      thumbnail, // Set the parentId to the original Tweets's ID
    });

    // Save the comment Tweets to the database
    const savedCommentTweets = await commentTweets.save();

    // Add the comment Tweets's ID to the original Tweets's children array
    originalTweets.children.push(savedCommentTweets._id);

    // Save the updated original Tweets to the database
    await originalTweets.save();

    revalidatePath(path);
  } catch (err) {
    console.error("Error while adding comment:", err);
    throw new Error("Unable to add comment");
  }
}