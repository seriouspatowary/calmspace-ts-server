"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const fetchUser_1 = __importDefault(require("../middleware/fetchUser"));
const checkToken_1 = __importDefault(require("../middleware/checkToken"));
const checkRoleuser_1 = __importDefault(require("../middleware/checkRoleuser"));
const router = express_1.default.Router();
router.post("/register", user_controller_1.registerUser);
router.post("/login", user_controller_1.loginUser);
router.post("/make-profile", fetchUser_1.default, (0, checkRoleuser_1.default)("user"), user_controller_1.makeProfile);
router.post("/send-otp", user_controller_1.sendOtp);
router.post("/verify-otp", user_controller_1.verifyOtp);
router.post("/reset-password", checkToken_1.default, user_controller_1.resetPassword);
router.get("/user-data", fetchUser_1.default, user_controller_1.getUser);
router.post("/user-promt", fetchUser_1.default, user_controller_1.postUserPromt);
router.get("/count", user_controller_1.getWeeklyUserCounts);
router.post("/book-appointment", fetchUser_1.default, user_controller_1.bookAppointment);
router.get("/appointment", fetchUser_1.default, user_controller_1.getAppointments);
router.post("/update-profile", fetchUser_1.default, user_controller_1.updateProfile);
exports.default = router;
//# sourceMappingURL=user.route.js.map