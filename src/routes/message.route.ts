import express from "express";
import { sendMessage,getMessage } from "../controllers/message.controller";
import fetchuser from "../middleware/fetchUser";
import checkChatAccess from "../middleware/checkChatSession";



const router = express.Router();

router.post("/send/:id", fetchuser, checkChatAccess ,sendMessage);
router.get("/getmessage/:userToChatid", fetchuser, getMessage);


export default router;
