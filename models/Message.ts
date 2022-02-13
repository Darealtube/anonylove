import { ObjectId } from "mongodb";
import { Schema } from "mongoose";
import mongoose from "mongoose";

const MessageSchema = new Schema({
  id: ObjectId,
  date: Date,
  sender: ObjectId,
  message: String,
  favorite: Boolean,
});

export default mongoose.models.Message ||
  mongoose.model("Message", MessageSchema);
