import mongoose from "mongoose"
import {Like} from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { response } from "express"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user?._id;

    // Validate videoId
    if (!mongoose.isValidObjectId(videoId)) {
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

const toggleCommentLike = asyncHandler(async(req, res)=>{
    
})

const toggleTweetLike = asyncHandler(async(req, res)=>{

})

const getLikedVideos = asyncHandler(async(req, res)=>{
    
})

export {
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
    getLikedVideos
}