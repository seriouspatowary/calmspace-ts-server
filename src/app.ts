import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import connectDB from "./config/db"; 
import cors from "cors";
import authRoutes from "./routes/user.route"
import QuestionRoutes from "./routes/question.route"
import Blogs from "./routes/blog.route"
import feature from "./routes/feature.route"
import counselor from './routes/counselor.route';
import progressBarRoutes from './routes/progressbar.route'
import messageRoutes from './routes/message.route';
import CommunityRoutes from './routes/comunity.route';
import PaymentRoutes from './routes/payment.route'
  
import {app, server} from './lib/socket'


dotenv.config({ path: path.resolve(__dirname, '../../../', '.env') });



connectDB();

const PORT = Number(process.env.PORT) || 3000;


app.use(express.json());
app.use(cors({
  origin: "*", 
  methods: "GET,POST,PUT,DELETE,PATCH", 
  allowedHeaders: "Content-Type, Authorization" // Allowed headers
}));

app.get("/", (req, res) => {
     res.send("Hello Calmspace")
})
app.use("/api/auth",authRoutes)
app.use("/api/questions", QuestionRoutes);
app.use("/api/blogs", Blogs)
app.use("/api/feauture", feature)
app.use("/api/counselor",counselor)
app.use("/api/progress", progressBarRoutes)
app.use("/api/message", messageRoutes)
app.use("/api/comunity", CommunityRoutes)
app.use("/api/payment", PaymentRoutes)

server.listen(PORT, () => {
  console.log(`Server running on Port:${PORT}`);
});
