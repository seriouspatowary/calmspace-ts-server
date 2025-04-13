import express from "express";
import { registerUser, loginUser, makeProfile,sendOtp  } from "../controllers/user.controller";
import fetchUser from "../middleware/fetchUser";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/make-profile", fetchUser, makeProfile)
router.post("/send-otp",sendOtp)

export default router;
