"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fetchUser_1 = __importDefault(require("../middleware/fetchUser"));
const counselor_controller_1 = require("../controllers/counselor.controller");
const router = express_1.default.Router();
router.get("/", fetchUser_1.default, counselor_controller_1.getAllcounselor);
exports.default = router;
//# sourceMappingURL=counselor.route.js.map