import express from "express";
import fetchuser from "../middleware/fetchUser";
import {createProgressBar} from "../controllers/progressBar.controller"

const router = express.Router();

router.post("/create-progressbar", fetchuser, createProgressBar);


export default router;

