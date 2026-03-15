import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { addComment, deleteComment, getAllComment, updateComment } from "../controllers/comment.controller";
const router = Router()

app.use(verifyJWT)

router.route("/addComment/:videoId").post(addComment)
router.route("/deleteComment/:commentId").delete(deleteComment)
router.route("/updateComment/:commentId").patch(updateComment)
router.route("/GetAllComment/:videoId").get(getAllComment)

export default router

