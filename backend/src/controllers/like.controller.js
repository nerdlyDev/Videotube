import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle like on video

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }
  const like = await Like.findOne({
    video: videoId,
    likedBy: req.user._id,
  });

  if (like) {
    await like.remove();
    return res
      .status(200)
      .json(new ApiResponse(200, "Liked remove successfully", {}));
  }

  const newLike = await Like.create({
    video: videoId,
    likedBy: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Liked added successfully", newLike));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment id");
  }

  const like = await Like.findOne({
    comment: commentId,
    likedBy: req.user._id,
  });

  if (like) {
    await like.remove();
    return res
      .status(200)
      .json(new ApiResponse(200, "Comment Liked removed successfully", {}));
  }

  const newCommentLike = await Like.create({
    comment: commentId,
    likedBy: req.user._id,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Comment Liked added successfully", newCommentLike)
    );
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet id");
  }

  const like = await Like.findOne({
    tweet: tweetId,
    likedBy: req.user._id,
  });

  if (like) {
    await like.remove();
    return res
      .status(200)
      .json(new ApiResponse(200, "Tweet Liked removed successfully", {}));
  }

  const newTweetLike = await Like.create({
    tweet: tweetId,
    likedBy: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Tweet Liked added successfully", newTweetLike));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
    const likes = await Like.find({
    likedBy: req.user._id,
    video: { $ne: null}
    }).populate("video")

    // extract all liked video except null 
    const likeVideos = likes.filter((like) => like.video).map((like) => like.video)

    if (likeVideos.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, "No liked videos found", []));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Liked videos fetched successfully", videos));
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
