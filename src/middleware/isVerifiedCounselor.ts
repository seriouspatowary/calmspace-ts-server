import { Request, Response, NextFunction } from "express";
import UserModel from "../models/User"; 
import VerificationMasterModel from "../models/VerificationMaster";

interface CustomRequest extends Request {
  user?: {
    id: string;
  };
}

const isVerifiedCounselor = async (req: CustomRequest,res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;

    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404).json({ status_code: 404, error: "User not found" });
      return;
    }

    const verification = await VerificationMasterModel.findOne({
      user_id: userId,
      adminVerified: true,
    });

    if (!verification) {
      res.status(403).json({ status_code: 403, error: "User is not verified by admin" });
      return;
    }

    next();
  } catch (error) {
    console.error("Error in isVerifiedCounselor middleware:", error);
    res.status(500).json({ status_code: 500, error: "Internal Server Error" });
  }
};

export default isVerifiedCounselor;
