import express from "express";
import {
    registerUser, loginUser, makeProfile, sendOtp, verifyOtp, resetPassword, getUser,
    postUserPromt, getWeeklyUserCounts, bookAppointment,getAppointments
} from "../controllers/user.controller";
import fetchUser from "../middleware/fetchUser";
import checkToken from "../middleware/checkToken";
import checkRole  from "../middleware/checkRoleuser";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/make-profile", fetchUser, checkRole("user"),makeProfile)
router.post("/send-otp", sendOtp)
router.post("/verify-otp", verifyOtp)
router.post("/reset-password",checkToken,resetPassword)
router.get("/user-data", fetchUser, getUser);
router.post("/user-promt", fetchUser, postUserPromt);
router.get("/count", getWeeklyUserCounts);
router.post("/book-appointment", fetchUser, bookAppointment);
router.get("/appointment", fetchUser, getAppointments)


export default router;
