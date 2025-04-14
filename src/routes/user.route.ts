import express from "express";
import { registerUser, loginUser, makeProfile,sendOtp ,verifyOtp ,resetPassword, getUser} from "../controllers/user.controller";
import fetchUser from "../middleware/fetchUser";
import checkToken from "../middleware/checkToken";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/make-profile", fetchUser, makeProfile)
router.post("/send-otp", sendOtp)
router.post("/verify-otp", verifyOtp)
router.post("/reset-password",checkToken,resetPassword)
router.get("/user-data", fetchUser, getUser)

export default router;
