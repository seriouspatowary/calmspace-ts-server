import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Question from "../models/Question";

export const getQuestions = asyncHandler(async (req: Request, res: Response) => {
  try {
    const questions = await Question.find({}).sort({ sort_order: 1 });
    res.status(200).json(questions);
  } catch (error: any) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});