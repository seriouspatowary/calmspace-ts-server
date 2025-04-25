import express from "express";
import fetchuser from "../middleware/fetchUser";
import { getAllcounselor, updateInfo, toggleCounselorStatus, getCounselorById,editInfo } from "../controllers/counselor.controller";
import isVerifiedCounselor from "../middleware/isVerifiedCounselor";

const router = express.Router();

router.get("/", fetchuser, getAllcounselor); // for user screen
router.post("/update-info", fetchuser, isVerifiedCounselor, updateInfo);//
router.post("/Updateonline", fetchuser, isVerifiedCounselor, toggleCounselorStatus);
router.get("/counselorbyid",fetchuser,isVerifiedCounselor, getCounselorById)
router.put("/edit-info", fetchuser, isVerifiedCounselor, editInfo);


export default router;
