import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

dotenv.config();

const otpSecret = process.env.OTP_SECRET as string;

interface AuthRequest extends Request {
  user?: any; // You can replace `any` with a specific user type/interface
}

const checkToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const token = req.header("Authorization");

  if (!token) {
    res.status(401).json({ error: "Dont have a correct access" });
    return;
  }
  try {
    const decoded = jwt.verify(token, otpSecret) as { id: string };
    if (!decoded || !decoded.id) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }
 
      req.user = { id: decoded.id }; 
      console.log("first:",req.user)
      
    next();
  } catch (error) {
    res.status(401).json({ error: "Please authenticate with a valid token" });
  }
};


export default checkToken;
