import mongoose from "mongoose"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { response } from "express"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user?._id;

    // Validate videoId
    if (videoId || !mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    // Check existing like
    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: userId
    });

    let message;

    //  Toggle logic
    if (existingLike) {
        // Unlike
        await Like.findByIdAndDelete(existingLike._id);
        message = "Video unliked";
    } else {
        // Like
        await Like.create({
            video: videoId,
            likedBy: userId
        });
        message = "Video liked";
    }

    return res.status(200).json(
        new ApiResponse(200, null, message)
    );
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const { userId } = req.user._id

    // Validate videoId
    if (commentId || !mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    const existingLike = await Like.findOne({
        comment: commentId,
        owner: userId
    })

    let message;

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id)
        message = "Comment Liked"
    } else {
        await Like.create({
            comment: commentId,
            owner: userId
        })
        message =  "Comment Unliked"
    }

    res
        .status(200)
        .json(
            new ApiResponse(200, null, message)
        );
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    // const {TweetId} = req.params
    // const {userId} = req.user._id

    //  if (TweetId || !mongoose.isValidObjectId(TweetId)) {
    //     throw new ApiError(400, "Invalid comment ID");
    // }
})

const getLikedVideos = asyncHandler(async (req, res) => {

})

export {
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
    getLikedVideos
}