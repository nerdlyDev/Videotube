import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;  
  // TODO: toggle subscription

  const subscriberId = req.user._id;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel id");
  }

  const channel = await User.findById({
    _id: channelId,
  });

  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }
  // TODO: check if user is already subscribed to the channel
  const isSubscribed = await Subscription.findOne({
    channel: channelId,
    subscriber: subscriberId,
  });

  if (isSubscribed) {
    await Subscription.deleteOne({
      channel: channelId,
      subscriber: subscriberId,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, "Unsubscribed successfully"));
  }
  // TODO: add subscription
  const newSubscription = await Subscription.create({
    channel: channelId,
    subscriber: subscriberId,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, "Subscribed successfully", newSubscription));
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const channelId = req.params.subscriberId;

  
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid user id");
  }

  const subscribers = await Subscription.find({
    subscriber: channelId,
  });
  

  if (!subscribers.length) {
    return res
      .status(404)
      .json(new ApiResponse(404, "No subscribers found for this user"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Subscribers found successfully", subscribers));
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
  // TODO: get subscribed channels
  const subscriberId = req.user._id;

  if (!isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Invalid user id");
  }

  const subscriptions = await Subscription.find({
    subscriber: subscriberId,
  });

  if (!subscriptions.length) {
    return res
      .status(404)
      .json(new ApiResponse(404, "No subscriptions found for this user"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Subscriptions found successfully", subscriptions));


});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };

