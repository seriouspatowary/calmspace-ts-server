import express from "express";
import { sendPost, getPost , replyPost, fetchReplies} from "../controllers/comunity.controller";
import fetchuser from "../middleware/fetchUser";
import checkRole from "../middleware/checkRoleuser";


const router = express.Router();

router.post("/sendpost", fetchuser, sendPost);
router.get("/post", fetchuser, getPost);

router.post("/replypost", fetchuser, checkRole("counselor"), replyPost)
router.get("/replies/:postid", fetchuser, fetchReplies);


export default router;
