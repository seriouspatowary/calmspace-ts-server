import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import crypto from "crypto";
import dotenv from "dotenv";
import TransactionModel from "../models/Transaction";

dotenv.config();

const {
  PHONEPE_MERCHANT_ID,
  PHONEPE_SALT_KEY,
  PHONEPE_SALT_INDEX,
  PHONEPE_HOST_URL,
  BACKEND_SERVER_URL
} = process.env;



function calculateXVerify(
  payloadBase64: string,
  endpoint: string,
  saltKey: string,
  saltIndex: string
): string {
  const stringToHash = payloadBase64 + endpoint + saltKey;
  const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex");
  return `${sha256}###${saltIndex}`;
}

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

interface PhonePeApiResponse {
  success: boolean;
  code: string;
  message?: string;
  data?: {
    instrumentResponse: {
      redirectInfo: {
        url: string;
      };
    };
  };
}

export const initiatePhonePePayment = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { amount, mobileNumber } = req.body;
    const userId = req.user?.id;

    if (!userId || !amount) {
      res.status(400).json({
        success: false,
        message: "Amount and userId are required.",
      });
      return;
    }

    const merchantTransactionId = `MT_${uuidv4().slice(0, 8)}_${Date.now()}`;
    const callbackUrl = `${BACKEND_SERVER_URL}/api/payment/callback`;

    const data = {
      merchantId: PHONEPE_MERCHANT_ID,
      merchantTransactionId,
      merchantUserId: userId,
      amount: parseInt(amount) * 100,
      callbackUrl,
      mobileNumber,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    const payload = JSON.stringify(data);
    const payloadBase64 = Buffer.from(payload).toString("base64");
    const apiEndpoint = "/pg/v1/pay";

    const xVerify = calculateXVerify(
      payloadBase64,
      apiEndpoint,
      PHONEPE_SALT_KEY as string,
      PHONEPE_SALT_INDEX as string
    );

    const headers = {
      "Content-Type": "application/json",
      "X-VERIFY": xVerify,
      accept: "application/json",
    };

    const url = `${PHONEPE_HOST_URL}${apiEndpoint}`;

    const response = await axios.post<PhonePeApiResponse>(
      url,
      { request: payloadBase64 },
      { headers }
    );

    const { success, data: responseData, message } = response.data;

    if (success && responseData?.instrumentResponse?.redirectInfo?.url) {
      await TransactionModel.create({
        merchantTransactionId,
        userId,
        amount: parseInt(amount),
        mobileNumber,
        status: "PENDING",
      });

      res.status(200).json({
        success: true,
        message: "PhonePe payment initiated",
        data: {
          redirectUrl: responseData.instrumentResponse.redirectInfo.url,
          merchantTransactionId,
        },
      });
    } else {
      res.status(500).json({
        success: false,
        message: message || "PhonePe initiation failed",
      });
    }
  } catch (error: any) {
    console.error("PhonePe initiation error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error during payment initiation",
    });
  }
};



function calculateCallbackXVerify(
  payloadBase64: string,
  saltKey: string,
  saltIndex: string
): string {
  const stringToHash = payloadBase64 + saltKey;
  const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex");
  return `${sha256}###${saltIndex}`;
}


export const handlePhonePeCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const callbackResponseBase64 = req.body.response;
    const receivedXVerify = req.headers["x-verify"] as string;

    if (!callbackResponseBase64 || !receivedXVerify) {
      res.status(400).send("Missing required callback data");
      return;
    }

    const calculatedXVerify = calculateCallbackXVerify(
      callbackResponseBase64,
      PHONEPE_SALT_KEY as string,
      PHONEPE_SALT_INDEX as string
    );

    if (calculatedXVerify !== receivedXVerify) {
      res.status(400).send("Checksum mismatch");
      return;
    }

    const decodedPayload = JSON.parse(
      Buffer.from(callbackResponseBase64, "base64").toString("utf-8")
    );

    const { status, merchantTransactionId } = decodedPayload;

    console.log("✅ Decoded Callback Payload:", decodedPayload);

    // Update transaction status in MongoDB
    await TransactionModel.findOneAndUpdate(
      { merchantTransactionId },
      { status, updatedAt: new Date() }
    );

    res.status(200).send("Callback received successfully");
  } catch (error) {
    console.error("❌ Callback processing error:", error);
    res.status(500).send("Internal Server Error");
  }
};


export const checkPhonePePaymentStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { transactionId } = req.params;
  console.log(`🔍 Checking payment status for Transaction ID: ${transactionId}`);

  try {
    const transaction = await TransactionModel.findOne({ merchantTransactionId: transactionId });

    if (!transaction) {
      console.warn(`⚠️ Transaction ${transactionId} not found.`);
      res.status(404).json({
        success: false,
        status: "UNKNOWN",
        message: "Transaction not found",
        transactionId,
      });
      return;
    }

    console.log(`✅ Found transaction: ${transactionId}, Status: ${transaction.status}`);

    res.status(200).json({
      success: true,
      status: transaction.status,
      transactionId,
    });
  } catch (error) {
    console.error(`❌ Error checking payment status for ${transactionId}:`, error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error while checking payment status",
    });
  }
};
