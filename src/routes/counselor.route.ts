import express from "express";
import fetchuser from "../middleware/fetchUser";
import {
    getAllcounselor, updateInfo, toggleCounselorStatus, getCounselorById, editInfo,
    getUserForSidebar, postAvailability,getcounselorByPreference
} from "../controllers/counselor.controller";
import isVerifiedCounselor from "../middleware/isVerifiedCounselor";

const router = express.Router();

router.get("/", fetchuser, getAllcounselor); // for user screen
router.get("/preference", fetchuser, getcounselorByPreference); // for user screen


router.post("/update-info", fetchuser, isVerifiedCounselor, updateInfo);//
router.post("/Updateonline", fetchuser, isVerifiedCounselor, toggleCounselorStatus);
router.get("/counselorbyid",fetchuser,isVerifiedCounselor, getCounselorById)
router.put("/edit-info", fetchuser, isVerifiedCounselor, editInfo);
router.get("/getuserforsidebar" ,fetchuser, isVerifiedCounselor, getUserForSidebar)
router.post("/set-availabilty", fetchuser, isVerifiedCounselor, postAvailability);

export default router;
