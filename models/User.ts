import { ObjectId } from "mongodb";
import { Schema } from "mongoose";
import mongoose from "mongoose";

const UserSchema = new Schema({
  id: ObjectId,
  name: String,
  email: String,
  image: String,
  cover: String,
  bio: String,
  status: String,
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
