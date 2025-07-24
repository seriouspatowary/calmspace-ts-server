// controllers/paymentController.ts
import { Request, Response } from 'express';
import razorpay from '../util/razorpay';
import crypto from 'crypto';
import PaymentModel from '../models/Payment';
import PaymentResponseModel from '../models/PaymentResponse';

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
    const paymentRecord = new PaymentResponseModel({
      userId:userId,
      transaction_id: order.id,
      razorpay_order_id: order.id,
      receipt: order.receipt,
      payment_amount: order.amount,
      status: 'created', 
    });

    await paymentRecord.save();

    // Step 3: Return response
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ success: false, error: 'Unable to create order' });
  }
};



export const verifySignature = async (req: AuthenticatedRequest, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, currency = 'INR', receipt } = req.body;
  const userId = req.user?.id;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expectedSignature === razorpay_signature) {
    try {
      const existing = await PaymentResponseModel.findOne({ transaction_id: razorpay_payment_id });

      if (!existing) {
        const payment = new PaymentResponseModel({
          userId,
          transaction_id: razorpay_payment_id, // <- THIS is your transaction_id
          razorpay_order_id,
          razorpay_signature,
          receipt,
          payment_amount: amount,
          status: 'success', // Optional: set to 'pending' if you're waiting for webhook
        });

        await payment.save();
      }

      res.status(200).json({ success: true, message: 'Payment verified and stored' });
    } catch (error) {
      console.error('DB Error:', error);
      res.status(500).json({ success: false, message: 'DB save failed' });
    }
  } else {
    res.status(400).json({ success: false, message: 'Invalid signature' });
  }
};
