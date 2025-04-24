import express from "express";
import { sendMessage,getMessage } from "../controllers/message.controller";
import fetchuser from "../middleware/fetchUser";

const router = express.Router();

router.post("/send/:id", fetchuser, sendMessage);
router.get("/getmessage/:userToChatid", fetchuser, getMessage);


export default router;
