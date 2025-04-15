"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const cors_1 = __importDefault(require("cors"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const question_route_1 = __importDefault(require("./routes/question.route"));
const blog_route_1 = __importDefault(require("./routes/blog.route"));
const feature_route_1 = __importDefault(require("./routes/feature.route"));
const counselor_route_1 = __importDefault(require("./routes/counselor.route"));
dotenv_1.default.config();
(0, db_1.default)();
const app = (0, express_1.default)();
const PORT = 5000;
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type, Authorization" // Allowed headers
}));
app.use("/api/auth", user_route_1.default);
app.use("/api/questions", question_route_1.default);
app.use("/api/blogs", blog_route_1.default);
app.use("/api/feauture", feature_route_1.default);
app.use("/api/counselor", counselor_route_1.default);
app.listen(PORT, () => {
    console.log(`Server running on Port:${PORT}`);
});
//# sourceMappingURL=index.js.map