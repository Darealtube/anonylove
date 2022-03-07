import { ObjectId } from "mongodb";
import { Schema } from "mongoose";
import mongoose from "mongoose";
import { DateTime } from "luxon";

const Chat = new Schema({
  anonymous: String,
  confessee: String,
  messages: ObjectId,
  updatedAt: {
    type: Date,
    default: DateTime.local,
  },
});

const UserSchema = new Schema({
  id: ObjectId,
  name: String,
  email: String,
  image: String,
  cover: String,
  bio: String,
  status: String,
  activeChat: Chat,
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
