import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment
} from "../controllers/comment.controller.js";
const router = Router()

router.use(verifyJWT)

router.post("/addComment/:videoId", addComment)

router.patch("/update-comment/:commentId", updateComment)

router.delete("/delete-comment/:commentId", deleteComment)

router.patch("/fetched-video-comment/:videoId", getVideoComments)

export default router

