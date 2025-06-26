import express from "express";
import fetchuser from "../middleware/fetchUser";
import { sendPayment, getPaymentStatus } from "../controllers/payment.controller";
const router = express.Router();

router.post("/send-payment/:id", fetchuser, sendPayment);
router.get("/paymentstatus/:counselorId", fetchuser, getPaymentStatus)


export default router;
