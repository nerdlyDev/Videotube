import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
  //if isPublished is false, only show videos of the user who requested it .where("isPublished")
  const videos = await Video.find({
    ...(query && { title: { $regex: query, $options: "i" } }),
    ...(userId && { user: userId }),
  })
    .sort({ [sortBy]: sortType === "asc" ? 1 : -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate("owner", "username email")
    .where("isPublished")
    .equals(true);

  
  const totalVideos = await Video.countDocuments().where("isPublished").equals(true);

  if (!videos) {
    throw new ApiError(404, "No videos found");
  }
  return res.json(new ApiResponse(200, { videos, totalVideos }));
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video
  const videoFile = req.files?.videoFile[0]?.path;
  const thumbnail = req.files?.thumbnail[0]?.path;
  const user = req.user;
  const videoFileUrl = await uploadOnCloudinary(videoFile);
  const thumbnailUrl = await uploadOnCloudinary(thumbnail);
  if (!videoFileUrl || !thumbnailUrl) {
    throw new ApiError(500, "Failed to upload video file or thumbnail");
  }
  const video = await Video.create({
    title,
    description,
    videoFile: videoFileUrl.url,
    thumbnail: thumbnailUrl.url,
    duration:videoFileUrl.duration,
    owner: user._id,
  });
  return res.json(new ApiResponse(201, video));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  return res.json(new ApiResponse(200, video));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  const { title, description } = req.body;
  //if video owner and user are not the same dont do the update operation
  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this video");
  }
  video.title = title;
  video.description = description;
  if (req.file) {
    const thumbnail = req.file.path;
    const thumbnailUrl = await uploadOnCloudinary(thumbnail);
    if (!thumbnailUrl) {
      throw new ApiError(500, "Failed to upload thumbnail");
    }
    video.thumbnail = thumbnailUrl.url;
  }
  await video.save();
  return res.json(new ApiResponse(200, video));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
  const video = await Video.findById(videoId)
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  //if video owner and user are not the same dont do the delete operation
  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this video");
  }
  await video
    .deleteOne({ _id: videoId })
    .then(() => {
      console.log("Deleted video successfully");
    })
    .catch((err) => {
      throw new ApiError(500, "Failed to delete video");
    });
  return res.json(new ApiResponse(200, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle publish status of video
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  //if video owner and user are not the same dont do the toggle operation
  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to toggle publish status of this video");
  }
  video.isPublished = !video.isPublished;
  await video.save();
  return res.json(new ApiResponse(200, video));
});



export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
