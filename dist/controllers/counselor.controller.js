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
exports.getcounselorByPreference = exports.postAvailability = exports.getUserForSidebar = exports.getCounselorById = exports.getAllcounselor = exports.toggleCounselorStatus = exports.editInfo = exports.updateInfo = void 0;
const Counselor_1 = __importDefault(require("../models/Counselor"));
const Message_1 = __importDefault(require("../models/Message"));
const User_1 = __importDefault(require("../models/User"));
const ScheduleMaster_1 = __importDefault(require("../models/ScheduleMaster"));
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
        // Get pagination parameters with default values
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        // Total count for pagination metadata
        const totalCount = yield Counselor_1.default.countDocuments();
        // Fetch paginated counselors
        const counselors = yield Counselor_1.default.find()
            .skip(skip)
            .limit(limit)
            .populate({
            path: "counselorId",
            select: "-password",
        })
            .populate("priceId")
            .lean();
        // Fetch all schedules
        const schedules = yield ScheduleMaster_1.default.find().lean();
        // Create a map for quick lookup by userId
        const scheduleMap = new Map(schedules.map((sched) => [sched.userId.toString(), sched]));
        // Attach schedule to each counselor
        const enrichedCounselors = counselors.map((counselor) => {
            var _a, _b;
            const userId = (_b = (_a = counselor.counselorId) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString();
            return Object.assign(Object.assign({}, counselor), { schedule: userId ? scheduleMap.get(userId) || null : null });
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
const postAvailability = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { scheduleAt, scheduleTimes, meetLink } = req.body;
        if (!userId || !scheduleAt || !meetLink || !Array.isArray(scheduleTimes)) {
            res.status(400).json({ message: 'Invalid request data' });
            return;
        }
        const result = yield ScheduleMaster_1.default.findOneAndUpdate({ userId }, {
            userId,
            scheduleAt,
            scheduleTimes,
            meetLink
        }, {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
        });
        res.json({
            status_code: 201,
            message: 'Schedule saved successfully',
        });
    }
    catch (error) {
        console.error('Error saving availability:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.postAvailability = postAvailability;
const getcounselorByPreference = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { language, minPrice, maxPrice, experience } = req.query;
        const counselors = yield Counselor_1.default.find()
            .populate({ path: "counselorId", select: "-password" })
            .populate("priceId")
            .lean();
        const schedules = yield ScheduleMaster_1.default.find().lean();
        const scheduleMap = new Map(schedules.map(sched => [sched.userId.toString(), sched]));
        const enrichedCounselors = counselors.map((counselor) => {
            var _a, _b;
            const userId = (_b = (_a = counselor.counselorId) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString();
            return Object.assign(Object.assign({}, counselor), { schedule: userId ? scheduleMap.get(userId) || null : null });
        });
        const min = minPrice ? Number(minPrice) : 0;
        const max = maxPrice ? Number(maxPrice) : Infinity;
        const exp = experience ? Number(experience) : 0;
        const allMatches = enrichedCounselors.filter((counselor) => {
            var _a;
            const matchesLanguage = language
                ? ((_a = counselor.languages) !== null && _a !== void 0 ? _a : []).map((l) => l.toLowerCase()).includes(String(language).toLowerCase())
                : true;
            const matchesPrice = ["chat", "audio", "video"].some((mode) => {
                const priceObj = counselor.priceId;
                const price = priceObj === null || priceObj === void 0 ? void 0 : priceObj[mode];
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
            var _a;
            const id = counselor._id.toString();
            if (matchedIds.has(id))
                return false;
            return language
                ? ((_a = counselor.languages) !== null && _a !== void 0 ? _a : []).map((l) => l.toLowerCase()).includes(String(language).toLowerCase())
                : false;
        });
        languageMatches.forEach((c) => matchedIds.add(c._id.toString()));
        // Relaxed match: only price
        const priceMatches = enrichedCounselors.filter((counselor) => {
            const id = counselor._id.toString();
            if (matchedIds.has(id))
                return false;
            return ["chat", "audio", "video"].some((mode) => {
                const priceObj = counselor.priceId;
                const price = priceObj === null || priceObj === void 0 ? void 0 : priceObj[mode];
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
    }
    catch (error) {
        console.error("Error in getcounselorByPreference:", error);
        res.status(500).json({
            status_code: 500,
            message: "Internal Server Error",
        });
    }
});
exports.getcounselorByPreference = getcounselorByPreference;
//# sourceMappingURL=counselor.controller.js.map