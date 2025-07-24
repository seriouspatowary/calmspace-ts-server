import { Request, Response } from 'express';
import razorpay from '../util/razorpay';
import crypto from 'crypto';
import PaymentRequestModel from '../models/PaymentRequest';
import PaymentResponseModel from '../models/PaymentResponse';
import { startChatSession } from "../util/startSession"



interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}




export const createOrder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;
    const userId = req.user?.id;

    const options = {
      amount: amount * 100, 
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);
    // Step 2: Store order in PaymentResponse collection

    const amountInPaise = typeof order.amount === 'string' ? parseInt(order.amount) : order.amount;

    const paymentRecord = new PaymentRequestModel({
      userId:userId,
      transaction_id: order.id,
      razorpay_order_id: order.id,
      receipt: order.receipt,
      payment_amount: amountInPaise / 100,
      status: 'created', 
    });

    await paymentRecord.save();

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ success: false, error: 'Unable to create order' });
  }
};



export const verifySignature = async (req: AuthenticatedRequest, res: Response):Promise<void> => {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        amount,
        receipt,
        counselorId
      } = req.body;

      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized: user ID missing' });
        return
      }

      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_SECRET!)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      const status = expectedSignature === razorpay_signature ? 'success' : 'failed';

      try {
        const existing = await PaymentResponseModel.findOne({ transaction_id: razorpay_payment_id });

        if (!existing) {
          const payment = new PaymentResponseModel({
            userId,
            transaction_id: razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            receipt,
            payment_amount: amount,
            status, // 'success' or 'failed'
          });

          await payment.save();
        }

        if (status === 'success') {

          const session = await startChatSession(userId, counselorId, amount);

          res.status(200).json({ success: true, message: 'Payment verified and stored' });
        } else {
          res.status(400).json({ success: false, message: 'Invalid signature, stored as failed' });
        }

      } catch (error) {
        console.error('Error in VerifySignature:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
      }
    };

