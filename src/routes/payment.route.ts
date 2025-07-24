import express from "express";
import fetchuser from "../middleware/fetchUser";
import { sendPayment, getPaymentStatus } from "../controllers/payment.controller";
import {  createOrder,verifySignature } from "../controllers/razorpay.controller";

const router = express.Router();

router.post("/send-payment/:id", fetchuser, sendPayment);
router.get("/paymentstatus/:counselorId", fetchuser, getPaymentStatus)

// razorpay
router.post("/create-order", fetchuser, createOrder);
router.post("/verify-signaturer", fetchuser, verifySignature);


export default router;
