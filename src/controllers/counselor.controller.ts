import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import CounselorModel from "../models/Counselor";


interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}


export const updateInfo = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const {
    info,
    expertise,
    languages,
    experience,
    degree,
    therapy,
    speciality,
  } = req.body;
  const counselorId = req.user?.id;

  try {
    const counselor = new CounselorModel({
      counselorId: counselorId,
      info: info,
      expertise: expertise,
      languages: languages,
      experience: experience,
      degree: degree,
      therapy: therapy,
      speciality: speciality,
    });

    await counselor.save();
    res.json({
      status_code:200,
      message: "Saved counselor info",
    });
  } catch (error) {
    console.error("Error creating counselor info:", error);
    res.json({
      status_code:500,
      message: "Error creating counselor info",
    });
  }
}


export const editInfo = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
   const {
    info,
    expertise,
    languages,
    experience,
    degree,
    therapy,
    speciality,
  } = req.body;
  const counselorId = req.user?.id;

  try {
    let counselor = await CounselorModel.findOne({ counselorId });

    if (!counselor) {
      
      res.json({
        message: "Counselor not found",
        status_code: 404
      });
      return
    }

    if (info !== undefined) counselor.info = info;
    if (expertise !== undefined) counselor.expertise = expertise;
    if (languages !== undefined) counselor.languages = languages;
    if (experience !== undefined) counselor.experience = experience;
    if (degree !== undefined) counselor.degree = degree;
    if (therapy !== undefined) counselor.therapy = therapy;
    if (speciality !== undefined) counselor.speciality = speciality;

    // Save the updated counselor profile
    await counselor.save();
    res.json({
      status_code: 201,
      message: "Counselor information updated successfully",

    });
  } catch (error) {
    console.error("Error updating counselor info:", error);
    res.json({
      status_code: 500,
      message: "Internal Server Error",
    });
  }
}



export const toggleCounselorStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const counselorId = req.user?.id;
    let counselor = await CounselorModel.findOne({ counselorId });

    if (!counselor) {
      res.json({
        status_code:404,
        message: "Counselor not found"
      });
      return
    }
    counselor.status = counselor.status === "online" ? "offline" : "online";
    await counselor.save();
    res.json({
      status_code:201,
      message: `Counselor status toggled to ${counselor.status}`,
    });
  } catch (error) {
    console.error("Error toggling counselor status:", error);
    res.status(500).json({
      status_code: 500,
      message: "Internal Server Error",
    });
  }

}



export const getAllcounselor  = async (req: Request, res: Response): Promise<void> => {
  try {      
      const counselors = await CounselorModel.find()
      .populate("counselorId")
          .populate("priceId"); 
    
      res.status(201).json(counselors);

  } catch (error) {
    console.error("Error in getAllcounselor:", error);
    res.status(500).json({
      status_code: 500,
      message: "Internal Server Error",
    });
  }
}

export const getCounselorById  = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {      
      const counselorId = req.user?.id;
      const counselors = await CounselorModel.findOne({counselorId})
      .populate("counselorId")
          .populate("priceId"); 
    
      res.status(201).json(counselors);

  } catch (error) {
    console.error("Error in getAllcounselor:", error);
    res.status(500).json({
      status_code: 500,
      message: "Internal Server Error",
    });
  }
}
