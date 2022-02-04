import mongoose from "mongoose";

type mongooseConnection = {
  conn: typeof mongoose | null;
  promise: Promise | null;
};

declare global {
  var mongoose: mongooseConnection;
  var _mongoClientPromise: Promise<MongoClient>;
}
