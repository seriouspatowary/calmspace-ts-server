import UserModel from "../models/User";
import ChatSessionModel from "../models/ChatSession";
import { Request, Response, NextFunction } from "express";


interface AuthRequest extends Request {
  user?: any; 
}



const checkChatAccess = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id; 
    const userExist = await UserModel.findById(userId)
   
    const role = userExist?.role;
    
    if (role === 'counselor') {
      return next();
    }


    const counselorId = req.params.id;

    if (!counselorId) {
      res.status(400).json({ error: 'Counselor ID is required.' });
      return;
    }

    const now = new Date();

    const activeSession = await ChatSessionModel.findOne({
      userId,
      counselorId,
      expiredAt: { $gt: now }
    }).sort({ expiredAt: -1 });

    if (!activeSession) {
      res.status(403).json({
        error: 'No active chat session. Please make a payment to start chatting.',
      });
      return
    }

    next();
  } catch (err) {
    console.error('Chat access check failed:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default checkChatAccess;
