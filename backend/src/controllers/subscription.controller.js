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
  const { channelId } = req.params;
  // TODO: return subscriber list of a channel
  // if (!isValidObjectId(channelId)) {
  //     throw new ApiError(400, "Invalid channel id")
  // }
  const subscribers = await Subscription.find({
    channel: channelId,
  })
    .populate("subscriber")
    .then((subscriptions) => {
      return subscriptions.map((subscription) => subscription.subscriber);
    })
    .catch((error) => {
      console.log(error);
      return [];
    });

  if (!subscribers) {
    throw new ApiError(404, "No subscribers found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Subscribers list", subscribers));
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  // if (!isValidObjectId(subscriberId)) {
  //     throw new ApiError(400, "Invalid subscriber id")
  // }

  // TODO: return channel list to which user has subscribed

  const channels = await Subscription.find({
    subscriber: subscriberId,
  })
    .populate("channel")
    .then((subscriptions) => {
      return subscriptions.map((subscription) => subscription.channel);
    })
    .catch((error) => {
      console.log(error);
      return [];
    });

  console.log(channels);

  if (!channels) {
    throw new ApiError(404, "No subscribed channels found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Subscribed channels list", channels));
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
