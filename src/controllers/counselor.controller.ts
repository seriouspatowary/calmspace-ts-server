import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import CounselorModel from "../models/Counselor";




export const getAllcounselor  = async (req: Request, res: Response): Promise<void> => {
  try {      
      const counselors = await CounselorModel.find()
      .populate("counselorId")
          .populate("priceId"); 
    
      res.status(201).json(counselors);

  } catch (error) {
    console.error("Error in getAllcounselor:", error);
    res.status(500).json({
      status_code: 500,
      message: "Internal Server Error",
    });
  }
}
