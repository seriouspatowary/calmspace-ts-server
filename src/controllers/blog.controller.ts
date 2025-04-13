import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Article from "../models/Blog"; // Adjust path if needed

export const getBlogs = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const articles = await Article.find({});
    res.status(201).json({
      status_code: 201,
      data: articles,
    });
  } catch (error) {
    console.error("Error fetching Blogs:", error);
    res.status(500).json({
      status_code: 500,
      message: "Internal Server Error",
    });
  }
});
