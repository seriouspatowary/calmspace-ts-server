import express from "express";
import fetchuser from "../middleware/fetchUser";
import { getAllcounselor } from "../controllers/counselor.controller";

const router = express.Router();

router.get("/", fetchuser, getAllcounselor);

export default router;
