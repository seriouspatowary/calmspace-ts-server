import express from "express";
import fetchuser from "../middleware/fetchUser";
import { sendPayment, getPaymentStatus } from "../controllers/payment.controller";
import { checkPhonePePaymentStatus, handlePhonePeCallback, initiatePhonePePayment } from "../controllers/phonepay.controller";

const router = express.Router();

router.post("/send-payment/:id", fetchuser, sendPayment);
router.get("/paymentstatus/:counselorId", fetchuser, getPaymentStatus)

// phonepay
router.post("/mobile/initiate", fetchuser, initiatePhonePePayment);
router.post("/api/payment/callback",fetchuser, handlePhonePeCallback);
router.get("/api/payment/status/:transactionId", fetchuser, checkPhonePePaymentStatus);


export default router;
