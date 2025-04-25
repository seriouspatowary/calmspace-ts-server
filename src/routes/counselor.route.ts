import express from "express";
import fetchuser from "../middleware/fetchUser";
import { getAllcounselor, updateInfo, toggleCounselorStatus, getCounselorById } from "../controllers/counselor.controller";
import isVerifiedCounselor from "../middleware/isVerifiedCounselor";

const router = express.Router();

router.get("/", fetchuser, getAllcounselor); // for user screen
router.put("/update-info", fetchuser, isVerifiedCounselor, updateInfo);//
router.post("/Updateonline", fetchuser, isVerifiedCounselor, toggleCounselorStatus);
router.get("/:id",fetchuser, getCounselorById)


export default router;
