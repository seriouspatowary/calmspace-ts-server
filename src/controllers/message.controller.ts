import { Request, Response } from "express";
import MessageModel from "../models/Message";
import { getReceiverSocketId ,io} from "../lib/socket.js";


interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

export const sendMessage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
      const senderId = req.user?.id;
      const { text} = req.body;
      const { id: receiverId } = req.params;

      const newMessage = new MessageModel({
            senderId,
            receiverId,
            text   
        });
        await newMessage.save();

        const ReceiverSocketId = getReceiverSocketId(receiverId)
        if (ReceiverSocketId) {
            io.to(ReceiverSocketId).emit("newMessage",newMessage)
        }

        res.status(200).json(newMessage)
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({
      status_code: 500,
      message: "Internal Server Error",
    });
  }
}
export const getMessage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
        const { userToChatid } = req.params;
        const myId = req.user?.id;
        const messages = await MessageModel.find({
            $or: [
                 {senderId: myId, receiverId: userToChatid},
                 {senderId:userToChatid,receiverId:myId}
             ]

        });
        res.status(200).json(messages);
    } catch (error) {
         console.log("Error in getMessage Controller:", error)
         res.status(500).json({message:"Internal Server Error"})
    }
}