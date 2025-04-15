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
exports.createProgressBar = void 0;
const ProgressBar_1 = __importDefault(require("../models/ProgressBar"));
const createProgressBar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { QuestionScore } = req.body;
        const existingProgress = yield ProgressBar_1.default.findOne({ userId });
        if (existingProgress) {
            res.json({
                status_code: 400,
                message: "Progress Bar already exists for this user."
            });
            return;
        }
        const progressBar = new ProgressBar_1.default({
            userId,
            QuestionScore
        });
        const saveprogressBar = yield progressBar.save();
        res.status(201).json(saveprogressBar);
    }
    catch (error) {
        console.error("Error in createProgressBar:", error);
        res.status(500).json({
            status_code: 500,
            message: "Internal Server Error",
        });
    }
});
exports.createProgressBar = createProgressBar;
//# sourceMappingURL=progressBar.controller.js.map