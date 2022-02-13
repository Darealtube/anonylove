import { ObjectId } from "mongodb";
import { Schema } from "mongoose";
import mongoose from "mongoose";

const ChatSchema = new Schema({
  id: ObjectId,
  confesser: ObjectId,
  confessee: ObjectId,
  messages: ObjectId,
});

export default mongoose.models.Chat || mongoose.model("Chat", ChatSchema);
