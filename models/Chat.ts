import { ObjectId } from "mongodb";
import { Schema } from "mongoose";
import mongoose from "mongoose";
import { DateTime } from "luxon";

const ChatSchema = new Schema({
  id: ObjectId,
  confesser: String,
  confessee: String,
  messages: ObjectId,
  updatedAt: {
    type: Date,
    default: DateTime.local,
  },
});

export default mongoose.models.Chat || mongoose.model("Chat", ChatSchema);
