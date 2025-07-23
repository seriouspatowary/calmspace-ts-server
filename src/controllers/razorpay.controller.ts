// controllers/paymentController.ts
import { Request, Response } from 'express';
import razorpay from '../util/razorpay';


interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

export const createOrder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    const options = {
      amount: amount * 100, // amount in paise
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
     res.status(500).json({ success: false, error: 'Unable to create order' });
  }
};
