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
exports.getUserForSidebar = exports.getCounselorById = exports.getAllcounselor = exports.toggleCounselorStatus = exports.editInfo = exports.updateInfo = void 0;
const Counselor_1 = __importDefault(require("../models/Counselor"));
const Message_1 = __importDefault(require("../models/Message"));
const User_1 = __importDefault(require("../models/User"));
const updateInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { info, expertise, languages, experience, degree, therapy, speciality, } = req.body;
    const counselorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const counselor = new Counselor_1.default({
            counselorId: counselorId,
            info: info,
            expertise: expertise,
            languages: languages,
            experience: experience,
            degree: degree,
            therapy: therapy,
            speciality: speciality,
        });
        yield counselor.save();
        res.json({
            status_code: 200,
            message: "Saved counselor info",
        });
    }
    catch (error) {
        console.error("Error creating counselor info:", error);
        res.json({
            status_code: 500,
            message: "Error creating counselor info",
        });
    }
});
exports.updateInfo = updateInfo;
const editInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { info, expertise, languages, experience, degree, therapy, speciality, } = req.body;
    const counselorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        let counselor = yield Counselor_1.default.findOne({ counselorId });
        if (!counselor) {
            res.json({
                message: "Counselor not found",
                status_code: 404
            });
            return;
        }
        if (info !== undefined)
            counselor.info = info;
        if (expertise !== undefined)
            counselor.expertise = expertise;
        if (languages !== undefined)
            counselor.languages = languages;
        if (experience !== undefined)
            counselor.experience = experience;
        if (degree !== undefined)
            counselor.degree = degree;
        if (therapy !== undefined)
            counselor.therapy = therapy;
        if (speciality !== undefined)
            counselor.speciality = speciality;
        // Save the updated counselor profile
        yield counselor.save();
        res.json({
            status_code: 201,
            message: "Counselor information updated successfully",
        });
    }
    catch (error) {
        console.error("Error updating counselor info:", error);
        res.json({
            status_code: 500,
            message: "Internal Server Error",
        });
    }
});
exports.editInfo = editInfo;
const toggleCounselorStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const counselorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        let counselor = yield Counselor_1.default.findOne({ counselorId });
        if (!counselor) {
            res.json({
                status_code: 404,
                message: "Counselor not found"
            });
            return;
        }
        counselor.status = counselor.status === "online" ? "offline" : "online";
        yield counselor.save();
        res.json({
            status_code: 201,
            message: `Counselor status toggled to ${counselor.status}`,
        });
    }
    catch (error) {
        console.error("Error toggling counselor status:", error);
        res.status(500).json({
            status_code: 500,
            message: "Internal Server Error",
        });
    }
});
exports.toggleCounselorStatus = toggleCounselorStatus;
const getAllcounselor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const counselors = yield Counselor_1.default.find()
            .populate({
            path: "counselorId",
            select: "-password",
        })
            .populate("priceId");
        res.status(201).json(counselors);
    }
    catch (error) {
        console.error("Error in getAllcounselor:", error);
        res.status(500).json({
            status_code: 500,
            message: "Internal Server Error",
        });
    }
});
exports.getAllcounselor = getAllcounselor;
const getCounselorById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const counselorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const counselors = yield Counselor_1.default.findOne({ counselorId })
            .populate({
            path: "counselorId",
            select: "-password", // exclude password from User model
        })
            .populate("priceId");
        res.status(201).json(counselors);
    }
    catch (error) {
        console.error("Error in getAllcounselor:", error);
        res.status(500).json({
            status_code: 500,
            message: "Internal Server Error",
        });
    }
});
exports.getCounselorById = getCounselorById;
const getUserForSidebar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const myId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const messages = yield Message_1.default.find({
            $or: [
                { senderId: myId },
                { receiverId: myId },
            ]
        });
        // Step 2: Extract unique user IDs from messages
        const userIds = new Set();
        messages.forEach((message) => {
            if (message.senderId.toString() !== myId) {
                userIds.add(message.senderId.toString());
            }
            if (message.receiverId.toString() !== myId) {
                userIds.add(message.receiverId.toString());
            }
        });
        // Step 3: Fetch users from UserModel
        const users = yield User_1.default.find({
            _id: { $in: Array.from(userIds) }
        }).select("-password");
        res.status(200).json(users);
    }
    catch (error) {
        console.error('Error fetching users for sidebar:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getUserForSidebar = getUserForSidebar;
//# sourceMappingURL=counselor.controller.js.map