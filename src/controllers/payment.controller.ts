import { Request, Response } from "express";
import PaymentModel from "../models/Payment";
import { startChatSession } from "../util/startSession"
import ChatSessionModel from "../models/ChatSession";
    
    
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

export const sendPayment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const counselorId = req.params.id;
    const { transaction_id, payment_amount } = req.body;

    if (!userId || !counselorId || !transaction_id || !payment_amount) {
      res.status(400).json({
        status_code: 400,
        message: "Missing required fields",
      });
      return;
    }

    const payment = new PaymentModel({
      userId,
      counselorId,
      transaction_id,
      payment_amount,
      payment_at: new Date(),
    });

    await payment.save();

       // 2. Start Chat Session
    const session = await startChatSession(userId, counselorId, payment_amount);

    // 3. Return success response
    res.status(200).json({
      status_code: 200,
      message: "Payment and session created successfully",
      data: {
        payment,
        session,
      },
    });
  } catch (error) {
    console.error("Error in sendPayment:", error);
    res.status(500).json({
      status_code: 500,
      message: "Internal Server Error",
    });
  }
};


export const getPaymentStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const counselorId = req.params.counselorId;

    const chatSession = await ChatSessionModel.findOne({ userId, counselorId });

    if (!chatSession) {
      res.status(404).json({
        status_code: 404,
        message: "Chat session not found",
      });

      return;
    }

    const { amount, expiredAt } = chatSession;

    if (!expiredAt) {
      res.status(400).json({
        status_code: 400,
        message: "Chat session does not have an expiration time.",
      });
      return;
    }

    const now = new Date();
    let paidToBeAmount: number;

    if (now > expiredAt) {
      paidToBeAmount = 99;
    } else if (amount === 99 || amount === 199) {
      paidToBeAmount = 199;
    } else {
      paidToBeAmount = amount;
    }

    res.status(200).json({
      status_code: 200,
      paidToBeAmount,
    });

  } catch (error) {
    console.error("Error in getPaymentStatus:", error);
    res.status(500).json({
      status_code: 500,
      message: "Internal Server Error",
    });
  }
};
