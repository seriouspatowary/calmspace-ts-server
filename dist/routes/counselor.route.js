"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fetchUser_1 = __importDefault(require("../middleware/fetchUser"));
const counselor_controller_1 = require("../controllers/counselor.controller");
const isVerifiedCounselor_1 = __importDefault(require("../middleware/isVerifiedCounselor"));
const router = express_1.default.Router();
router.get("/", fetchUser_1.default, counselor_controller_1.getAllcounselor); // for user screen
router.get("/preference", fetchUser_1.default, counselor_controller_1.getcounselorByPreference); // for user screen
router.post("/update-info", fetchUser_1.default, isVerifiedCounselor_1.default, counselor_controller_1.updateInfo); //
router.post("/Updateonline", fetchUser_1.default, isVerifiedCounselor_1.default, counselor_controller_1.toggleCounselorStatus);
router.get("/counselorbyid", fetchUser_1.default, isVerifiedCounselor_1.default, counselor_controller_1.getCounselorById);
router.put("/edit-info", fetchUser_1.default, isVerifiedCounselor_1.default, counselor_controller_1.editInfo);
router.get("/getuserforsidebar", fetchUser_1.default, isVerifiedCounselor_1.default, counselor_controller_1.getUserForSidebar);
router.post("/set-availabilty", fetchUser_1.default, isVerifiedCounselor_1.default, counselor_controller_1.postAvailability);
exports.default = router;
//# sourceMappingURL=counselor.route.js.map