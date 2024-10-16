import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist

    const newPlaylist = await Playlist.create({
        name,
        description,
        owner: req.user._id
    })

    if (!newPlaylist) {
        throw new ApiError(500, "Playlist could not be created")
    }

    return res.status(201).json(new ApiResponse(201, "Playlist created successfully", newPlaylist))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists

    const playlists = await Playlist.find({owner: userId})

    if (!playlists.length) {
        throw new ApiError(404, "No playlists found")
    }

    return res.status(200).json(new ApiResponse(200, "Playlists found successfully", playlists))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id")
    }
    const playlist = await Playlist.findById(playlistId).populate("owner")

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    return res.status(200).json(new ApiResponse(200, "Playlist found successfully", playlist))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    const {title, description} = req.body
    //TODO: add video to playlist
    //TODO: check if video already exists in playlist
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id")
    }

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    const videoExists = playlist.videos.some(video => video.video.toString() === videoId)
    if (videoExists) {
        throw new ApiError(400, "Video already exists in playlist")
    }

    playlist.videos.push({
        video: videoId,
        title,
        description
    })

    await playlist.save()

    return res.status(200).json(new ApiResponse(200, "Video added to playlist successfully", playlist))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id")
    }

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    const videoIndex = playlist.videos.findIndex(video => video.video.toString() === videoId)

    if (videoIndex === -1) {
        throw new ApiError(404, "Video not found in playlist")
    }

    playlist.videos.splice(videoIndex, 1)

    await playlist.save()

    return res.status(200).json(new ApiResponse(200, "Video removed from playlist successfully", playlist))

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id")
    }

    const playlist = await Playlist.findByIdAndDelete(playlistId)

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    return res.status(200).json(new ApiResponse(200, "Playlist deleted successfully"))

})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    playlist.name = name

    playlist.description = description

    await playlist.save();

    return res.status(200).json(new ApiResponse(200, "Playlist updated successfully", playlist))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}