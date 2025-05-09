"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const jwtSecret = process.env.JWT_SECRET;
const fetchuser = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        res.status(401).json({ error: "Dont have a correct access" });
        return;
    }
    try {
        const data = jsonwebtoken_1.default.verify(token, jwtSecret);
        req.user = { id: data.id };
        next();
    }
    catch (error) {
        res.status(401).json({ error: "Please authenticate with a valid token" });
    }
};
exports.default = fetchuser;
//# sourceMappingURL=fetchUser.js.map