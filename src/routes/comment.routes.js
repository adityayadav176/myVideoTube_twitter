import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    addComment,
    deleteComment,
    getAllComment,
    updateComment
} from "../controllers/comment.controller.js";
const router = Router()

router.use(verifyJWT)

router.route("/:videoId").post(addComment).post(getAllComment)
router.route("/c/:commentId").delete(deleteComment).patch(updateComment)

export default router

