import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }
    const comments = await Comment.find({video: videoId}).sort({createdAt: -1}).skip((page - 1) * limit).limit(limit)

    if (!comments.length) {
        throw new ApiError(404, "No comments found")
    }

    return res.status(200).json(new ApiResponse(200, "Comments found successfully", comments))

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {content} = req.body
    const {videoId} = req.params
    const {user} = req.user._id
    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    if (!content || content.trim().length === 0) {
        throw new ApiError(400, "Content is required")
    }

    const newComment = await Comment.create({
        content,
        video: videoId,
        owner: user
    })

    if (!newComment) {
        throw new ApiError(500, "Comment could not be added")
    }
    return res.status(201).json(new ApiResponse(201, "Comment added successfully", newComment));
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment

    const {commentId} = req.params
    const {content} = req.body
    const userId = req.user._id
    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment id")
    }
    if (!content || content.trim().length === 0) {
        throw new ApiError(400, "Content is required")
    }

    const comment = await Comment.findOne({
        _id: commentId,
        owner: userId
    })

    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    comment.content = content;
    await comment.save();

    return res.status(200).json(new ApiResponse(200, "Comment updated successfully", comment))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment

    const {commentId} = req.params
    const userId = req.user._id
    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment id")
    }
    
    const comment = await Comment.findOneAndDelete({
        _id: commentId,
        owner: userId
    })

    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }
    
    return res.status(200).json(new ApiResponse(200, "Comment deleted successfully"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }