import { Request, Response } from "express";
import CounselorModel from "../models/Counselor";
import MessageModel from "../models/Message";
import UserModel from "../models/User";
import ScheduleMasterModel from "../models/ScheduleMaster";

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




export const getAllcounselor = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get pagination parameters with default values
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Total count for pagination metadata
    const totalCount = await CounselorModel.countDocuments();

    // Fetch paginated counselors
    const counselors = await CounselorModel.find()
      .skip(skip)
      .limit(limit)
      .populate({
        path: "counselorId",
        select: "-password",
      })
      .populate("priceId")
      .lean();

    // Fetch all schedules
    const schedules = await ScheduleMasterModel.find().lean();

    // Create a map for quick lookup by userId
    const scheduleMap = new Map(
      schedules.map((sched) => [sched.userId.toString(), sched])
    );

    // Attach schedule to each counselor
    const enrichedCounselors = counselors.map((counselor) => {
      const userId = counselor.counselorId?._id?.toString();
      return {
        ...counselor,
        schedule: userId ? scheduleMap.get(userId) || null : null,
      };
    });

    // Respond with data and pagination info
    res.status(200).json({
      data: enrichedCounselors,
      meta: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error in getAllcounselor:", error);
    res.status(500).json({
      status_code: 500,
      message: "Internal Server Error",
    });
  }
};



export const getCounselorById  = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {      
      const counselorId = req.user?.id;
      const counselors = await CounselorModel.findOne({counselorId})
      .populate({
        path: "counselorId",
        select: "-password", // exclude password from User model
      })
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


export const getUserForSidebar = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const myId = req.user?.id;
    const messages = await MessageModel.find({
      $or: [
        { senderId: myId },
        { receiverId: myId },
      ]
    });

    // Step 2: Extract unique user IDs from messages
    const userIds = new Set<string>();

    messages.forEach((message) => {
      if (message.senderId.toString() !== myId) {
        userIds.add(message.senderId.toString());
      }
      if (message.receiverId.toString() !== myId) {
        userIds.add(message.receiverId.toString());
      }
    });

    // Step 3: Fetch users from UserModel
    const users = await UserModel.find({
      _id: { $in: Array.from(userIds) }
    }).select("-password");

    res.status(200).json(users);

  } catch (error) {
    console.error('Error fetching users for sidebar:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const postAvailability = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
 try {
    const userId = req.user?.id;
    const { scheduleAt, scheduleTimes, meetLink} = req.body;

    if (!userId || !scheduleAt || !meetLink || !Array.isArray(scheduleTimes)) {
      res.status(400).json({ message: 'Invalid request data' });
      return;
    }

    const result = await ScheduleMasterModel.findOneAndUpdate(
      { userId },
      {
        userId,
        scheduleAt,
        scheduleTimes,
        meetLink
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

   res.json({
     status_code:201,
     message: 'Schedule saved successfully',
   });
  } catch (error) {
    console.error('Error saving availability:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




export const getcounselorByPreference = async (req: Request, res: Response): Promise<void> => {
  try {
    const { language, minPrice, maxPrice, experience } = req.query;

    const counselors = await CounselorModel.find()
      .populate({ path: "counselorId", select: "-password" })
      .populate("priceId")
      .lean();

    const schedules = await ScheduleMasterModel.find().lean();
    const scheduleMap = new Map(schedules.map(sched => [sched.userId.toString(), sched]));

    const enrichedCounselors = counselors.map((counselor) => {
      const userId = (counselor.counselorId as any)?._id?.toString();
      return {
        ...counselor,
        schedule: userId ? scheduleMap.get(userId) || null : null,
      };
    });

    const min = minPrice ? Number(minPrice) : 0;
    const max = maxPrice ? Number(maxPrice) : Infinity;
    const exp = experience ? Number(experience) : 0;

    const allMatches = enrichedCounselors.filter((counselor) => {
      const matchesLanguage = language
        ? (counselor.languages ?? []).map((l: string) => l.toLowerCase()).includes(String(language).toLowerCase())
        : true;

      const matchesPrice = ["chat", "audio", "video"].some((mode) => {
        const priceObj = counselor.priceId as Record<string, number> | undefined;
        const price = priceObj?.[mode];
        return typeof price === "number" && price >= min && price <= max;
      });

      const matchesExperience = Number(counselor.experience) >= exp;

      return matchesLanguage && matchesPrice && matchesExperience;
    });

    // If enough matches, return top 5
    if (allMatches.length >= 5) {
      res.status(200).json(allMatches.slice(0, 5));
      return;
    }

    const matchedIds = new Set(allMatches.map((c) => c._id.toString()));

    // Relaxed match: only language
    const languageMatches = enrichedCounselors.filter((counselor) => {
      const id = counselor._id.toString();
      if (matchedIds.has(id)) return false;
      return language
        ? (counselor.languages ?? []).map((l: string) => l.toLowerCase()).includes(String(language).toLowerCase())
        : false;
    });

    languageMatches.forEach((c) => matchedIds.add(c._id.toString()));

    // Relaxed match: only price
    const priceMatches = enrichedCounselors.filter((counselor) => {
      const id = counselor._id.toString();
      if (matchedIds.has(id)) return false;
      return ["chat", "audio", "video"].some((mode) => {
        const priceObj = counselor.priceId as Record<string, number> | undefined;
        const price = priceObj?.[mode];
        return typeof price === "number" && price >= min && price <= max;
      });
    });

    priceMatches.forEach((c) => matchedIds.add(c._id.toString()));

    // Fallback: any other counselors to fill up
    const filler = enrichedCounselors.filter((c) => !matchedIds.has(c._id.toString()));

    // Merge results
    const combined = [
      ...allMatches,
      ...languageMatches,
      ...priceMatches,
      ...filler,
    ].slice(0, 5); // Ensure only 5 returned

    res.status(200).json(combined);
  } catch (error) {
    console.error("Error in getcounselorByPreference:", error);
    res.status(500).json({
      status_code: 500,
      message: "Internal Server Error",
    });
  }
};

