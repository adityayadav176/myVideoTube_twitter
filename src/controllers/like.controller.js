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
    if (!videoId || !mongoose.isValidObjectId(videoId)) {
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
    if (!commentId || !mongoose.isValidObjectId(commentId)) {
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
        message = "Comment Unliked"
    }

    res
        .status(200)
        .json(
            new ApiResponse(200, null, message)
        );
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    const { userId } = req.user._id

    if (!tweetId || !mongoose.isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid Tweet ID");
    }

    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: userId
    })
    let message;

    if (existingLike) {
        // unlike
        await Like.findByIdAndDelete(existingLike._id);
        message = "Tweet unliked"
    } else {
        await Like.create({
            tweet: tweetId,
            likedBy: userId
        })
        message = "Tweet liked"
    }

    res
    .status(200)
    .json(
        new ApiResponse(200, null, message)
    )
})

const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }

    const likedVideos = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videoDetails"
            }
        },
        { $unwind: "$videoDetails" },
        {
            $lookup: {
                from: "users",
                localField: "videoDetails.owner",
                foreignField: "_id",
                as: "ownerDetails"
            }
        },
        { $unwind: "$ownerDetails" },
        {
            $project: {
                _id: 0,
                videoId: "$videoDetails._id",
                title: "$videoDetails.title",
                thumbnail: "$videoDetails.thumbnail",
                owner: {
                    username: "$ownerDetails.username",
                    avatar: "$ownerDetails.avatar"
                }
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, likedVideos, "Liked videos fetched successfully")
    );
});

export {
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
    getLikedVideos
}