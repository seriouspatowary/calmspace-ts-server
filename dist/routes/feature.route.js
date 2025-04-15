"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const feature_controller_1 = require("../controllers/feature.controller");
const fetchUser_1 = __importDefault(require("../middleware/fetchUser"));
const router = express_1.default.Router();
router.get("/", fetchUser_1.default, feature_controller_1.getfeature);
exports.default = router;
//# sourceMappingURL=feature.route.js.map