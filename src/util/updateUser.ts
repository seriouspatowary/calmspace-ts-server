import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from 'path';


dotenv.config({ path: path.resolve(__dirname, '../../../../', '.env') });


const MONGO_URI = process.env.MONGO_URI as string;

mongoose.connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
  role: String,
  password: String,
}, { collection: 'users' });

const User = mongoose.model("User", userSchema);

async function updateUsersWithHashedPassword() {
  try {
    const salt = await bcrypt.genSalt(10);
    const securePassword = await bcrypt.hash("123456", salt);

    const result = await User.updateMany(
      {
        role: "counselor",
        password: { $exists: false }
      },
      {
        $set: { password: securePassword }
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} users`);
  } catch (error) {
    console.error("❌ Error updating users:", error);
  } finally {
    mongoose.connection.close();
  }
}

updateUsersWithHashedPassword();
