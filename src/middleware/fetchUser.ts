import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET as string;

interface AuthRequest extends Request {
  user?: any; // You can replace `any` with a specific user type/interface
}

const fetchuser = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.header("Authorization");

  if (!token) {
    res.status(401).json({ error: "Dont have a correct access" });
    return;
  }
  try {
    const data = jwt.verify(token, jwtSecret) as { id: string };

    req.user = { id: data.id }; 
    next();
  } catch (error) {
    res.status(401).json({ error: "Please authenticate with a valid token" });
  }
};


export default fetchuser;
