import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel  from "../models/User";
import sendCustomEmail from "../util/sendMail";
import OtpModel from "../models/Otp";
import ProgressBarModel from "../models/ProgressBar";

const jwtsecret = process.env.JWT_SECRET as string;
const otpsecret = process.env.OTP_SECRET as string

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, age, password, gender, role } = req.body;

    if (!name || !email || !age || !password || !gender || !role) {
      res.json({
        status_code: 400,
        error: "Required fields missing",
        message: "Missing required fields",
      });
      return;
    }

    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      res.json({
        status_code: 409,
        message: "User already exists",
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const securePassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({ name, email, age, gender, role, password: securePassword });
    await newUser.save();

    res.json({
      status_code: 201,
      message: "You have registered successfully",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.json({
      status_code: 500,
      message: "Internal Server Error",
    });
  }
};


export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const userExists = await UserModel.findOne({ email });
    if (!userExists) {
      res.json({
        status_code: 404,
        error: "User does not exist",
      });
        return 
    }

    const passCompare = await bcrypt.compare(password, userExists.password);
    if (!passCompare) {
     res.json({
        status_code: 401,
        error: "Incorrect credentials",
     });
        return 
    }

    const authToken = jwt.sign({ id: userExists._id }, jwtsecret, { expiresIn: "10d" });

  res.json({
      status_code: 200,
      profileStatus: userExists.profileMaking,
      role:userExists.role,
      authToken,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
   res.json({
      status_code: 500,
      message: "Internal Server Error",
    });
  }
};

export const makeProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {

    if (!req.user || !req.user.id) {
      res.json({
        status_code: 401,
        message: "Unauthorized: User ID missing",
      });
      return;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user.id,
      { profileMaking: true },
      { new: true }
    );

    if (!updatedUser) {
      res.json({
        status_code: 404,
        message: "User not found",
      });
      return;
    }

    res.json({
      status_code: 201,
      message: "Profile making set to true",
    });

  } catch (error) {
    console.error("Error in makeProfile:", error);
    res.json({
      status_code: 500,
      message: "Internal Server Error",
    });
  }
};


const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};


export const sendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    const userExists = await UserModel.findOne({ email });
    if (!userExists) {
      res.status(404).json({
        status_code: 404,
        error: 'Invalid Credentials',
      });
      return;
    }

    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);

    await OtpModel.deleteMany({ email }); 
    await OtpModel.create({
      email,
      otp: hashedOtp,
    });

    // Step 4: Email HTML Template
    const htmlTemplate = `
    <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>OTP Email Template</title>
      </head>
      <body>
      <div style="font-family: Helvetica, Arial, sans-serif; min-width: 1000px; overflow: auto; line-height: 2">
        <div style="margin: 50px auto; width: 70%; padding: 20px 0">
          <div style="border-bottom: 1px solid #eee">
            <a href="" style="font-size: 1.4em; color: #000; text-decoration: none; font-weight: 600">Calmspace</a>
          </div>
          <p style="font-size: 1.1em">Hi,</p>
          <p>Thank you for choosing Calmspace. Use the following OTP to complete your Password Recovery Procedure. OTP is valid for 5 minutes</p>
          <h2 style="background: #0074D9; margin: 0 auto; width: max-content; padding: 0 10px; color: #fff; border-radius: 4px;">${otp}</h2>
          <p style="font-size: 0.9em;">Regards,<br />Calmspace</p>
          <hr style="border: none; border-top: 1px solid #eee" />
          <div style="float: right; padding: 8px 0; color: #aaa; font-size: 0.8em; line-height: 1; font-weight: 300">
            <p>Calmspace</p>
            <p style="font-size: 0.7em; color: #aaa;">Disclaimer: This email template is for illustrative purposes only and does not imply any official endorsement from Calmspace.</p>
          </div>
        </div>
      </div>
      </body>
      </html>
    `;

    await sendCustomEmail(email, 'Forgot Password', htmlTemplate);

    res.json({
      status_code: 201,
      message: 'OTP sent successfully',
    });
  } catch (error) {
    console.error('Error in sendOtp:', error);
    res.json({
      status_code: 500,
      message: 'Internal Server Error',
    });
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { otp,email } = req.body;

    const userExists = await OtpModel.findOne({ email });
    if (!userExists) {
      res.status(404).json({
        status_code: 404,
        error: 'Incorrect OTP',
      });
      return;
    }

    const otpCompare = await bcrypt.compare(otp, userExists.otp);
    if (!otpCompare) {
     res.json({
        status_code: 401,
        error: "Incorrect OTP",
     });
        return 
    }

    const userData = await UserModel.findOne({ email });
    if (!userData) {
      res.status(404).json({
        status_code: 404,
        error: 'User does not exist',
      });
      return;
    }

    const tempToken = jwt.sign({ id: userData._id }, otpsecret, { expiresIn: "1h" });


    res.json({
      status_code: 201,
      tempToken:tempToken,
      message:"OTP Verified Successfully"
      
    });
    
  } catch (error) {
    console.error('Error in verifyOtp:', error);
    res.json({
      status_code: 500,
      message: 'Internal Server Error',
    });
  }

}

export const resetPassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { resetpassword } = req.body;
    const user = await UserModel.findById(req.user?.id);
    
    if (!user) {
      res.json({
        status_code: 404,
        error: 'User not found',
      });
      return;
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(resetpassword, saltRounds);

    user.password = hashedPassword;
    await user.save();

    res.json({
      status_code: 201,
      message: "Password has been updated successfully"
    });
    
  } catch (error) {
    console.error('Error in resetPassword:', error);
    res.json({
      status_code: 500,
      message: 'Internal Server Error',
    });
  }

}

export const getUser  = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const user = await UserModel.findById(userId).select("name email");

    if (!user) {
       res.json({
        status_code: 404,
        message: "User Does not exist",
       });
      return;
    }

    const progress = await ProgressBarModel.findOne({ userId }).select("QuestionScore");

    res.json({
      status_code: 200,
      message: "User data retrieved successfully",
      user: {
        name: user.name,
        email: user.email,
      },
      questionScore: progress ? progress.QuestionScore : null,
    });

    
  } catch (error) {
    console.error('Error in getUser:', error);
    res.json({
      status_code: 500,
      message: 'Internal Server Error',
    });
  }

}