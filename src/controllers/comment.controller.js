import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Video} from "../models/video.models.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    let { page = 1, limit = 10 } = req.query;

    //  Validate videoId
    if (!videoId || !mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId");
    }

    //  Convert safely
    const pageNumber = Math.max(1, parseInt(page));
    const limitNumber = Math.max(1, parseInt(limit));

    const skip = (pageNumber - 1) * limitNumber;

    //  Check video exists
    const videoExists = await Video.exists({ _id: videoId });
    if (!videoExists) {
        throw new ApiError(404, "Video not found");
    }

    // Total comments
    const totalComments = await Comment.countDocuments({
        video: videoId
    });

    //  Fetch comments
    const comments = await Comment.find({
        video: videoId
    })
        .sort({ createdAt: -1 }) // newest first
        .skip(skip)
        .limit(limitNumber)
        .populate("owner", "username avatar");

    //  Response
    return res.status(200).json(
        new ApiResponse(200, {
            comments,
            totalComments,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalComments / limitNumber),
            hasNextPage: pageNumber * limitNumber < totalComments
        }, comments.length ? "Comments fetched successfully" : "No Comments Yet")
    );
});

const addComment = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const { videoId } = req.params;
    const userId = req.user?._id;

    // Check authentication
    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }

    // Validate content
    if (!content || content.trim() === "") {
        throw new ApiError(400, "Comment cannot be empty");
    }

    // Validate videoId
    if (!videoId || !mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    // Check if video exists (VERY IMPORTANT)
    const videoExists = await Video.exists({ _id: videoId });

    if (!videoExists) {
        throw new ApiError(404, "Video not found");
    }

    // Create comment
    const comment = await Comment.create({
        content: content.trim(),
        video: videoId,
        owner: userId
    });

    return res.status(201).json(
        new ApiResponse(201, comment, "Comment successfully created")
    );
});

const updateComment = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const { commentId } = req.params;
    const userId = req.user?._id;

    //  Check authentication
    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }

    //  Validate content
    if (!content || content.trim() === "") {
        throw new ApiError(400, "Comment cannot be empty");
    }

    //  Validate commentId
    if (!commentId || !mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid CommentId");
    }

    //  Update with ownership check in query
    const updatedComment = await Comment.findOneAndUpdate(
        {
            _id: commentId,
            owner: userId   // authorization inside query
        },
        {
            $set: {
                content: content.trim(),
                updatedAt: new Date()
            }
        },
        {
            new: true
        }
    );

    // If not found or not authorized
    if (!updatedComment) {
        throw new ApiError(
            404,
            "Comment not found or you are not allowed to update it"
        );
    }

    // Response
    return res.status(200).json(
        new ApiResponse(200, updatedComment, "Comment updated successfully")
    );
});

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user?._id;

    // Check user
    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }

    // Validate commentId
    if (!commentId || !mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid commentId");
    }

    // Find comment first
    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    // Check ownership
    if (comment.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not allowed to delete this comment");
    }

    // Delete comment
    await comment.deleteOne();

    return res.status(200).json(
        new ApiResponse(200, {}, "Comment deleted successfully")
    );
});

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}