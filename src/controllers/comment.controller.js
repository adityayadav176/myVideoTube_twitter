import mongoose from "mongoose";
import {comment} from "../models/comment.model"
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const getAllComment = asyncHandler(async(req, res)=>{

})

const addComment = asyncHandler(async(req, res)=>{

})

const updateComment = asyncHandler(async(req, res)=>{
    
})

const deleteComment = asyncHandler(async(req, res)=>{

})

export {
    getAllComment,
    addComment,
    updateComment,
    deleteComment
}