"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fetchUser_1 = __importDefault(require("../middleware/fetchUser"));
const progressBar_controller_1 = require("../controllers/progressBar.controller");
const router = express_1.default.Router();
router.post("/create-progressbar", fetchUser_1.default, progressBar_controller_1.createProgressBar);
exports.default = router;
//# sourceMappingURL=progressbar.route.js.map