import express from 'express';
import dotenv from "dotenv";
import connectDB from "./config/db"; 
import cors from "cors";
import authRoutes from "./routes/user.route"
import QuestionRoutes from "./routes/question.route"
import Blogs from "./routes/blog.route"
import feature from "./routes/feature.route"
import counselor from './routes/counselor.route';


dotenv.config();


connectDB();

const app = express();
const PORT = 5000;



app.use(express.json());
app.use(cors({
  origin: "*", 
  methods: "GET,POST,PUT,DELETE", 
  allowedHeaders: "Content-Type, Authorization" // Allowed headers
}));

app.use("/api/auth",authRoutes)
app.use("/api/questions", QuestionRoutes);
app.use("/api/blogs", Blogs)
app.use("/api/feauture", feature)
app.use("/api/counselor",counselor)

app.listen(PORT, () => {
  console.log(`Server running on Port:${PORT}`);
});
