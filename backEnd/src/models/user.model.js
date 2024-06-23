import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: { type: String, enum: ["manager", "customer"], default: "customer" },
});

const User = mongoose.model("user", userSchema);

export default User;
