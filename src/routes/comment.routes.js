import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
    addComment,
    deleteComment,
    getAllComment,
    updateComment
} from "../controllers/comment.controller";
const router = Router()

app.use(verifyJWT)

router.route("/:videoId").post(addComment).post(getAllComment)
router.route("/c/:commentId").delete(deleteComment).patch(updateComment)

export default router

