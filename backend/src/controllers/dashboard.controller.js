import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

    const userId = req.user._id;

    if (!userId) {
        throw new ApiError(404, "User not found");
    }
    
    //totalVideos 

    const totalVideos = await Video.countDocuments({
        owner: new mongoose.Types.ObjectId(userId)
    })

    //totalViews

    const totalViewsAgg = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $group: {
                _id: null,
                totalViews: {
                    $sum: "$views"
                }
            }
        }
    ])

    const totalViews = totalViewsAgg[0]?.totalViews || 0

    //totalSubscribers

    const totalSubscribers = await Subscription.countDocuments({
        channel: new mongoose.Types.ObjectId(userId)
    })

    //totalLikes

    const totalLikesAgg = await Video.aggregate([
        {
            $match:{
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup:{
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes"
            }
        },
        {
            $project:{
                likes: 1
            }
        },
        {
            $unwind: "$likes"
        },
        {
            $group:{
                _id: null,
                totalLikes: {
                    $sum: 1
                }
            }
        }
    ])
    const totalLikes = totalLikesAgg[0]?.totalLikes || 0


    const stats = {
        totalVideos,
        totalViews,
        totalSubscribers,
        totalLikes
    }

    return res.status(200).json(new ApiResponse(200, "Channel stats found successfully", stats))

});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  const userId = req.user._id;

  if (!userId) {
    throw new ApiError(404, "User not found");
  }
  const videos = await Video.find({
    owner: userId,
  }).count();

  if (!videos.length) {
    return res
      .status(404)
      .json(new ApiResponse(404, "No videos found for this channel"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "ChannelVideos found successfully", videos));
});

export { getChannelStats, getChannelVideos };
