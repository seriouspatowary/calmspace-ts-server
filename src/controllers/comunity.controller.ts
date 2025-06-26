import { Request, Response } from "express";
import PostModel from "../models/Comunity";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}


export const sendPost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const {text} = req.body;
    const userId = req.user?.id;

      try {
        const post = new PostModel({
            userId: userId,
            text:text  })
    
    await post.save();
    res.json({
      status_code:200,
      message: "Post has been sent Successfully",
    });
  } catch (error) {
    console.error("Error in sending Post:", error);
    res.json({
      status_code:500,
      message: "Error in sending Post",
    });
  }
}

export const getPost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id

        const posts = await PostModel.find().sort({ createdAt: -1 }).populate({
                            path: "userId",
                            select: "name pic", 
                            })

        res.status(201).json(posts)
        
    } catch (error) {
        console.error("Error in getPost :", error);
        res.json({
        status_code:500,
        message: "Internal Server Error",
        });
    }
    
}