"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const otpSecret = process.env.OTP_SECRET;
const checkToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        res.status(401).json({ error: "Dont have a correct access" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, otpSecret);
        if (!decoded || !decoded.id) {
            res.status(401).json({ error: "Invalid token" });
            return;
        }
        req.user = { id: decoded.id };
        console.log("first:", req.user);
        next();
    }
    catch (error) {
        res.status(401).json({ error: "Please authenticate with a valid token" });
    }
};
exports.default = checkToken;
//# sourceMappingURL=checkToken.js.map