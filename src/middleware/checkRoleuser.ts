import { Request, Response, NextFunction } from "express";
import UserModel from "../models/User"; // Replace with the correct path to your UserModel

interface CustomRequest extends Request {
  user?: {
    id: string;
  };
}

 const checkRole = (requiredRole: string) => {
  return async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(400).json({ status_code: 400, error: "User ID not found" });
        return;
      }

      const user = await UserModel.findById(userId);

      if (!user) {
        res.status(404).json({ status_code: 404, error: "User not found" });
        return;
      }

      if (user.role !== requiredRole) { // Compare user's role with requiredRole
        res.status(403).json({ status_code: 403, error: "Permission denied" });
        return;
      }

      next(); // User has the required role, proceed to the next middleware
    } catch (error) {
      console.error("Error in checkRole middleware:", error);
      res.status(500).json({ status_code: 500, error: "Internal Server Error" });
    }
  };
};

export default checkRole;
