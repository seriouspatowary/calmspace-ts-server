import express from "express";
import { getfeature } from "../controllers/feature.controller";
import fetchuser from "../middleware/fetchUser";

const router = express.Router();

router.get("/", fetchuser, getfeature);

export default router;
