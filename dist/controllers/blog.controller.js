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
exports.getBlogs = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Blog_1 = __importDefault(require("../models/Blog")); // Adjust path if needed
// Define controller
exports.getBlogs = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const articles = yield Blog_1.default.find({});
        res.status(201).json({
            status_code: 201,
            data: articles,
        });
    }
    catch (error) {
        console.error("Error fetching Blogs:", error);
        res.status(500).json({
            status_code: 500,
            message: "Internal Server Error",
        });
    }
}));
//# sourceMappingURL=blog.controller.js.map