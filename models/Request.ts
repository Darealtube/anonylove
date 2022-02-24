import { ObjectId } from "mongodb";
import { Schema } from "mongoose";
import mongoose from "mongoose";
import { DateTime } from "luxon";

const now = () => {
  return DateTime.now();
};

const RequestSchema = new Schema({
  id: ObjectId,
  date: {
    type: Date,
    default: now(),
  },
  sender: String,
  receiver: String,
  accepted: Boolean,
});

export default mongoose.models.Request ||
  mongoose.model("Request", RequestSchema);
