import express from "express";
import { sendPost,getPost } from "../controllers/comunity.controller";
import fetchuser from "../middleware/fetchUser";

const router = express.Router();

router.post("/sendpost", fetchuser, sendPost);
router.get("/post", fetchuser, getPost);


export default router;
