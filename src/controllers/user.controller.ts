import dotenv from "dotenv";
import path from 'path';


dotenv.config({ path: path.resolve(__dirname, '../../../../', '.env') });


import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel  from "../models/User";
import sendCustomEmail from "../util/sendMail";
import OtpModel from "../models/Otp";
import ProgressBarModel from "../models/ProgressBar";
import UserPromptModel from "../models/Promt";
import VerificationMasterModel from "../models/VerificationMaster";
import VideoCallOrderModel from "../models/VideoCallOrder";
import { v4 as uuidv4 } from 'uuid';




const jwtsecret = process.env.JWT_SECRET as string;
const otpsecret = process.env.OTP_SECRET as string

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}


export const getWeeklyUserCounts = async (req: Request, res: Response): Promise<void> => {
  try {
    const weeklyData = await UserModel.aggregate([
      {
        $match: {
          createdAt: { $exists: true },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            week: { $isoWeek: "$createdAt" },
          },
          totalUsers: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.week": 1 },
      },
    ]);

    const result = weeklyData.map((entry, index) => {
      const previous = weeklyData[index - 1];
      const currentCount = entry.totalUsers;
      const previousCount = previous ? previous.totalUsers : 0;

      let percentChange: number | null = null;

      if (previousCount === 0) {
        percentChange = null; // Or define as 100 if currentCount > 0
      } else {
        percentChange = ((currentCount - previousCount) / previousCount) * 100;
        percentChange = Math.min(Math.max(percentChange, -100), 100); // Clamp between -100% and 100%
        percentChange = Math.round(percentChange * 100) / 100; // Round to 2 decimals
      }

      return {
        year: entry._id.year,
        week: entry._id.week,
        totalUsers: currentCount,
        percentChangeFromPreviousWeek: percentChange,
      };
    });

    res.json({ result });
  } catch (error) {
    console.error("Error in getWeeklyUserCounts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};




export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password,  role } = req.body;

    if (!email || !password || !role) {
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

    const newUser = new UserModel({ email, role, password: securePassword });
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

   // Check verification status
    const verification = await VerificationMasterModel.findOne({
      userId: userExists._id,
      adminVerified: true,
    });

    const isVerified = !!verification; 

    const authToken = jwt.sign({ id: userExists._id }, jwtsecret, { expiresIn: "10d" });

   res.json({
      status_code: 200,
      profileStatus: userExists.profileMaking,
      role: userExists.role,
      user:userExists._id,
      authToken,
      isVerified
      
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
    const user = await UserModel.findById(userId).select("-password");

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
      user: user,
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


 export const postUserPromt  = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const {
      age,
      gender,
      maxBudget,
      minBudget,
      language
    } = req.body;

  try {
    const existingPromt = await UserPromptModel .findOne({ userId });

    if (existingPromt) {
      res.json({
        status_code: 400,
        message: "Prompt already exists for this user."
      });
      return;
    }

    const userPromt = new UserPromptModel ({
      userId,
      age,
      gender,
      maxBudget,
      minBudget,
      language
    });

    const saveuserPromt = await userPromt.save();

    if (saveuserPromt && saveuserPromt._id) {
       res.json({
        status_code: 201,
        message: "Prompt saved successfully"
       });
      return
    } else {
      res.json({
        status_code: 500,
        message: "Failed to save prompt"
      });
      return
    }

  } catch (error) {
    console.error("Error Inserting UserPromt:", error);
    res.status(500).json({
      status_code: 500,
      message: "Error inserting prompt",
      error
    });
  }
 }


export const bookAppointment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
   
  const userId = req.user?.id;
  const {
    counselorId,
    counselorName,
    scheduleDate,
    scheduleTime,
    meetLink,
  } = req.body;

  if (!userId || !counselorId || !counselorName || !scheduleDate || !scheduleTime || !meetLink) {
    res.status(400).json({
      status_code: 400,
      message: "Missing required fields",
    });
    return;
  }

  try {
    const orderId = `CS-${uuidv4()}`;

    const appointment = new VideoCallOrderModel({
      userId: userId,
      counselorId: counselorId,
      counselorName,
      scheduleDate: new Date(scheduleDate),
      scheduleTime,
      meetLink,
      orderId,
    });

    const savedAppointment = await appointment.save();

    if (savedAppointment && savedAppointment._id) {
      res.status(201).json({
        status_code: 201,
        message: "Appointment booked successfully",
      });
    } else {
      res.status(500).json({
        status_code: 500,
        message: "Failed to save appointment",
      });
    }
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({
      status_code: 500,
      message: "Error booking appointment",
    });
  }
};


export const getAppointments = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({
      status_code: 401,
      message: "Unauthorized: User ID not found",
    });
    return;
  }

  try {
    const appointments = await VideoCallOrderModel.find({ userId }).sort({ createdAt: -1 }); 

    res.status(200).json({
      data: appointments,
    });
  } catch (error) {
    console.error("Error retrieving appointments:", error);
    res.status(500).json({
      status_code: 500,
      message: "Error retrieving appointments",
    });
  }
};