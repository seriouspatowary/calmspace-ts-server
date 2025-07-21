import { Request, Response } from "express";
import PostModel from "../models/Comunity";
import ReplyPostModel from "../models/ReplyPost";



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


export const replyPost=  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const {text,postId} = req.body;
    const userId = req.user?.id;

    try {
    const replyPost = new ReplyPostModel({
      userId: userId,
      postId:postId,
      text: text
    })
    
    await replyPost.save();
    res.json({
      status_code:200,
      message: "Reply has been sent Successfully",
    });
  } catch (error) {
    console.error("Error in sending Post:", error);
    res.json({
      status_code:500,
      message: "Error in sending Post",
    });
  }
}



export const fetchReplies = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
      const postId = req.params.postid
      

        // Validate postId
        if (!postId || !userId) {
            res.status(400).json({
                status_code: 400,
                message: "Missing required fields",
            });
            return;
        }

        // Fetch replies for the specific post and populate user details
        const replies = await ReplyPostModel.find({ postId })
            .populate('userId', 'name pic') // Populate user details (name and pic)
            .sort({ createdAt: -1 }); // Sort by newest first

        // Return the replies
        res.status(200).json({
            data: replies,
        });
        
    } catch (error) {
        console.error("Error in fetchReplies:", error);
        res.status(500).json({
            status_code: 500,
            message: "Internal Server Error",
        });
    }
}


export const addReactions = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const {text,postId} = req.body;
  const userId = req.user?.id;

  try {
  const replyPost = new ReplyPostModel({
    userId: userId,
    postId:postId,
    text: text
  })
  
  await replyPost.save();
  res.json({
    status_code:200,
    message: "Reply has been sent Successfully",
  });
} catch (error) {
  console.error("Error in sending Post:", error);
  res.json({
    status_code:500,
    message: "Error in sending Post",
  });
}
}