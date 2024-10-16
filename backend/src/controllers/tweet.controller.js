import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const { content } = req.body;
  const userId = req.user._id;

  if (!content || content.trim().length === 0) {
    throw new ApiError(400, "Content is required");
  }

  //Create a new tweet
  const tweet = await Tweet.create({
    content,
    owner: userId,
  });

  if (!tweet) {
    throw new ApiError(500, "Tweet could not be created");
  }

  //return the tweet
  return res
    .status(201)
    .json(new ApiResponse(201, "Tweet added successfully", tweet));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets

    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user id");
    }

    const tweets = await Tweet.find({
        owner: userId
    }).sort({createdAt: -1})

    if (!tweets.length) {
        throw new ApiError(404, "No tweets found");
    }

    return res.status(200).json(new ApiResponse(200, "Tweets found successfully", tweets));
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
    const { tweetId } = req.params
    const { content } = req.body
    const userId = req.user._id

    if (!content || content.trim().length === 0) {
        throw new ApiError(400, "Content is required");
    }
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet id");
    }
    
    const tweet = await Tweet.findOne({
        _id: tweetId,
        owner: userId
    })

    if (!tweet) {
        throw new ApiError(404, "Tweet not found or not authorized to update");
    }

    //Update the tweet
    tweet.content = content
    await tweet.save();

    return res.status(200).json(new ApiResponse(200, "Tweet updated successfully", tweet));

});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
    const { tweetId } = req.params
    const userId = req.user._id

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet id");
    }
    
    const tweet = await Tweet.findOneAndDelete({
        _id: tweetId,
        owner: userId
    })

    if (!tweet) {
        throw new ApiError(404, "Tweet not found or not authorized to delete");
    }
    
    return res.status(200).json(new ApiResponse(200, "Tweet deleted successfully", tweet));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
