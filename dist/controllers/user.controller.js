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
exports.loginUser = exports.registerUser = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const jwtsecret = process.env.JWT_SECRET;
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, age, password, gender, role } = req.body;
        if (!name || !email || !age || !password || !gender || !role) {
            res.json({
                status_code: 400,
                error: "Required fields missing",
                message: "Missing required fields",
            });
            return;
        }
        const userExists = yield User_1.User.findOne({ email });
        if (userExists) {
            res.json({
                status_code: 409,
                message: "User already exists",
            });
            return;
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const securePassword = yield bcryptjs_1.default.hash(password, salt);
        const newUser = new User_1.User({ name, email, age, gender, role, password: securePassword });
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
        const userExists = yield User_1.User.findOne({ email });
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
        const authToken = jsonwebtoken_1.default.sign({ id: userExists._id }, jwtsecret, { expiresIn: "10d" });
        res.json({
            status_code: 200,
            profileStatus: userExists.profileMaking,
            authToken,
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
//# sourceMappingURL=user.controller.js.map