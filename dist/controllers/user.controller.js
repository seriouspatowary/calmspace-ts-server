"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getAppointments = exports.bookAppointment = exports.postUserPromt = exports.getUser = exports.resetPassword = exports.verifyOtp = exports.sendOtp = exports.makeProfile = exports.loginUser = exports.registerUser = exports.getWeeklyUserCounts = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../../../', '.env') });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const sendMail_1 = __importDefault(require("../util/sendMail"));
const Otp_1 = __importDefault(require("../models/Otp"));
const ProgressBar_1 = __importDefault(require("../models/ProgressBar"));
const Promt_1 = __importDefault(require("../models/Promt"));
const VerificationMaster_1 = __importDefault(require("../models/VerificationMaster"));
const VideoCallOrder_1 = __importDefault(require("../models/VideoCallOrder"));
const uuid_1 = require("uuid");
const jwtsecret = process.env.JWT_SECRET;
const otpsecret = process.env.OTP_SECRET;
const getWeeklyUserCounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const weeklyData = yield User_1.default.aggregate([
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
            let percentChange = null;
            if (previousCount === 0) {
                percentChange = null; // Or define as 100 if currentCount > 0
            }
            else {
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
    }
    catch (error) {
        console.error("Error in getWeeklyUserCounts:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getWeeklyUserCounts = getWeeklyUserCounts;
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            res.json({
                status_code: 400,
                error: "Required fields missing",
                message: "Missing required fields",
            });
            return;
        }
        const userExists = yield User_1.default.findOne({ email });
        if (userExists) {
            res.json({
                status_code: 409,
                message: "User already exists",
            });
            return;
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const securePassword = yield bcryptjs_1.default.hash(password, salt);
        const newUser = new User_1.default({ email, role, password: securePassword });
        yield newUser.save();
        res.json({
            status_code: 201,
            message: "You have registered successfully",
        });
    }
    catch (error) {
        console.error("Error registering user:", error);
        res.json({
            status_code: 500,
            message: "Internal Server Error",
        });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const userExists = yield User_1.default.findOne({ email });
        if (!userExists) {
            res.json({
                status_code: 404,
                error: "User does not exist",
            });
            return;
        }
        const passCompare = yield bcryptjs_1.default.compare(password, userExists.password);
        if (!passCompare) {
            res.json({
                status_code: 401,
                error: "Incorrect credentials",
            });
            return;
        }
        const { name, age, gender, profileMaking, role, _id } = userExists;
        const isComplete = !!(name && age && gender);
        const authToken = jsonwebtoken_1.default.sign({ id: _id }, jwtsecret, { expiresIn: "10d" });
        res.json({
            status_code: 200,
            profileStatus: profileMaking,
            role,
            user: _id,
            authToken,
            isComplete
        });
    }
    catch (error) {
        console.error("Error logging in user:", error);
        res.json({
            status_code: 500,
            message: "Internal Server Error",
        });
    }
});
exports.loginUser = loginUser;
const makeProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || !req.user.id) {
            res.json({
                status_code: 401,
                message: "Unauthorized: User ID missing",
            });
            return;
        }
        const updatedUser = yield User_1.default.findByIdAndUpdate(req.user.id, { profileMaking: true }, { new: true });
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
    }
    catch (error) {
        console.error("Error in makeProfile:", error);
        res.json({
            status_code: 500,
            message: "Internal Server Error",
        });
    }
});
exports.makeProfile = makeProfile;
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
const sendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const userExists = yield User_1.default.findOne({ email });
        if (!userExists) {
            res.status(404).json({
                status_code: 404,
                error: 'Invalid Credentials',
            });
            return;
        }
        const otp = generateOTP();
        const hashedOtp = yield bcryptjs_1.default.hash(otp, 10);
        yield Otp_1.default.deleteMany({ email });
        yield Otp_1.default.create({
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
        yield (0, sendMail_1.default)(email, 'Forgot Password', htmlTemplate);
        res.json({
            status_code: 201,
            message: 'OTP sent successfully',
        });
    }
    catch (error) {
        console.error('Error in sendOtp:', error);
        res.json({
            status_code: 500,
            message: 'Internal Server Error',
        });
    }
});
exports.sendOtp = sendOtp;
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { otp, email } = req.body;
        const userExists = yield Otp_1.default.findOne({ email });
        if (!userExists) {
            res.status(404).json({
                status_code: 404,
                error: 'Incorrect OTP',
            });
            return;
        }
        const otpCompare = yield bcryptjs_1.default.compare(otp, userExists.otp);
        if (!otpCompare) {
            res.json({
                status_code: 401,
                error: "Incorrect OTP",
            });
            return;
        }
        const userData = yield User_1.default.findOne({ email });
        if (!userData) {
            res.status(404).json({
                status_code: 404,
                error: 'User does not exist',
            });
            return;
        }
        const tempToken = jsonwebtoken_1.default.sign({ id: userData._id }, otpsecret, { expiresIn: "1h" });
        res.json({
            status_code: 201,
            tempToken: tempToken,
            message: "OTP Verified Successfully"
        });
    }
    catch (error) {
        console.error('Error in verifyOtp:', error);
        res.json({
            status_code: 500,
            message: 'Internal Server Error',
        });
    }
});
exports.verifyOtp = verifyOtp;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { resetpassword } = req.body;
        const user = yield User_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        if (!user) {
            res.json({
                status_code: 404,
                error: 'User not found',
            });
            return;
        }
        const saltRounds = 10;
        const hashedPassword = yield bcryptjs_1.default.hash(resetpassword, saltRounds);
        user.password = hashedPassword;
        yield user.save();
        res.json({
            status_code: 201,
            message: "Password has been updated successfully"
        });
    }
    catch (error) {
        console.error('Error in resetPassword:', error);
        res.json({
            status_code: 500,
            message: 'Internal Server Error',
        });
    }
});
exports.resetPassword = resetPassword;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const user = yield User_1.default.findById(userId).select("-password");
        if (!user) {
            res.json({
                status_code: 404,
                message: "User Does not exist",
            });
            return;
        }
        const { name, age, gender } = user;
        const isComplete = !!(name && age && gender);
        const verification = yield VerificationMaster_1.default.findOne({ userId });
        let adminVerified = false;
        if (verification) {
            adminVerified = verification.adminVerified;
        }
        const progress = yield ProgressBar_1.default.findOne({ userId }).select("QuestionScore");
        res.json({
            status_code: 200,
            message: "User data retrieved successfully",
            user: user,
            questionScore: progress ? progress.QuestionScore : null,
            isComplete,
            adminVerified
        });
    }
    catch (error) {
        console.error('Error in getUser:', error);
        res.json({
            status_code: 500,
            message: 'Internal Server Error',
        });
    }
});
exports.getUser = getUser;
const postUserPromt = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { age, gender, maxBudget, minBudget, language } = req.body;
    try {
        const existingPromt = yield Promt_1.default.findOne({ userId });
        if (existingPromt) {
            res.json({
                status_code: 400,
                message: "Prompt already exists for this user."
            });
            return;
        }
        const userPromt = new Promt_1.default({
            userId,
            age,
            gender,
            maxBudget,
            minBudget,
            language
        });
        const saveuserPromt = yield userPromt.save();
        if (saveuserPromt && saveuserPromt._id) {
            res.json({
                status_code: 201,
                message: "Prompt saved successfully"
            });
            return;
        }
        else {
            res.json({
                status_code: 500,
                message: "Failed to save prompt"
            });
            return;
        }
    }
    catch (error) {
        console.error("Error Inserting UserPromt:", error);
        res.status(500).json({
            status_code: 500,
            message: "Error inserting prompt",
            error
        });
    }
});
exports.postUserPromt = postUserPromt;
const bookAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { counselorId, counselorName, scheduleDate, scheduleTime, meetLink, } = req.body;
    if (!userId || !counselorId || !counselorName || !scheduleDate || !scheduleTime || !meetLink) {
        res.status(400).json({
            status_code: 400,
            message: "Missing required fields",
        });
        return;
    }
    try {
        const orderId = `CS-${(0, uuid_1.v4)()}`;
        const appointment = new VideoCallOrder_1.default({
            userId: userId,
            counselorId: counselorId,
            counselorName,
            scheduleDate: new Date(scheduleDate),
            scheduleTime,
            meetLink,
            orderId,
        });
        const savedAppointment = yield appointment.save();
        if (savedAppointment && savedAppointment._id) {
            res.status(201).json({
                status_code: 201,
                message: "Appointment booked successfully",
            });
        }
        else {
            res.status(500).json({
                status_code: 500,
                message: "Failed to save appointment",
            });
        }
    }
    catch (error) {
        console.error("Error booking appointment:", error);
        res.status(500).json({
            status_code: 500,
            message: "Error booking appointment",
        });
    }
});
exports.bookAppointment = bookAppointment;
const getAppointments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        res.status(401).json({
            status_code: 401,
            message: "Unauthorized: User ID not found",
        });
        return;
    }
    try {
        const appointments = yield VideoCallOrder_1.default.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json({
            data: appointments,
        });
    }
    catch (error) {
        console.error("Error retrieving appointments:", error);
        res.status(500).json({
            status_code: 500,
            message: "Error retrieving appointments",
        });
    }
});
exports.getAppointments = getAppointments;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { name, age, gender } = req.body;
        if (!name || !age || !gender) {
            res.status(400).json({
                status_code: 400,
                message: "Missing Required Fields"
            });
            return;
        }
        const user = yield User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({
                status_code: 404,
                error: 'User not found',
            });
            return;
        }
        const updatedUser = yield User_1.default.findByIdAndUpdate(userId, { name, age, gender }, { new: true });
        res.status(200).json({
            status_code: 200,
            message: 'Profile updated successfully'
        });
    }
    catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({
            status_code: 500,
            message: "Error updating profile",
        });
    }
});
exports.updateProfile = updateProfile;
//# sourceMappingURL=user.controller.js.map