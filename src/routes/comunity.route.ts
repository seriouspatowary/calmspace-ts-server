import express from "express";
import { sendPost, getPost , replyPost, fetchReplies,addReactions} from "../controllers/comunity.controller";
import fetchuser from "../middleware/fetchUser";
import checkRole from "../middleware/checkRoleuser";


const router = express.Router();

router.post("/sendpost", fetchuser, sendPost);
router.get("/post", fetchuser, getPost);

router.post("/replypost", fetchuser, checkRole("counselor"), replyPost)
router.get("/replies/:postid", fetchuser, fetchReplies);
router.post("/add-reaction", fetchuser, addReactions)

export default router;
