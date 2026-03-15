import {like} from "../models/like.model"
import { ApiError } from "../utils/ApiError"
import { ApiResponse } from "../utils/ApiResponse"
import { asyncHandler } from "../utils/asyncHandler"

const toggleVideoLike = asyncHandler(async(req, res)=>{

})

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