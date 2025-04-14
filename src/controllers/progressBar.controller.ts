import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import ProgressBarModel from "../models/ProgressBar";


interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}


export const createProgressBar = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { QuestionScore } = req.body;

    const existingProgress = await ProgressBarModel.findOne({ userId });

    if (existingProgress) {
        res.json({
            status_code: 400,
            message: "Progress Bar already exists for this user."
        }) 
        return;
    }
    const progressBar = new ProgressBarModel({
      userId,
      QuestionScore
   });
    const saveprogressBar = await progressBar.save();
    res.status(201).json(saveprogressBar);
  } catch (error) {
    console.error("Error in createProgressBar:", error);
    res.status(500).json({
      status_code: 500,
      message: "Internal Server Error",
    });
  }
}
