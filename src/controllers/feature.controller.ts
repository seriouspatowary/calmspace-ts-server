import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import FeatureModel from "../models/Feature";

export const getfeature = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const articles = await FeatureModel.find({});
    res.status(201).json({
      status_code: 201,
      data: articles,
    });
  } catch (error) {
    console.error("Error fetching Features:", error);
    res.status(500).json({
      status_code: 500,
      message: "Internal Server Error",
    });
  }
});
