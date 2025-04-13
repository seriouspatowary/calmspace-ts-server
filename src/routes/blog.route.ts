import express from "express";
import { getBlogs } from "../controllers/blog.controller";
import fetchuser from "../middleware/fetchUser";

const router = express.Router();

router.get("/", fetchuser, getBlogs);

export default router;
