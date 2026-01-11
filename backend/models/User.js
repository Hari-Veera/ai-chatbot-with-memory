import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: String,
  summary: String
});

export default mongoose.model("User", UserSchema);
