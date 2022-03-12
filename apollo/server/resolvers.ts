import { Context } from "@apollo/client";
import { GraphQLResolveInfo } from "graphql";
import { ObjectId } from "mongodb";
import Chat from "../../models/Chat";
import Request from "../../models/Request";
import User from "../../models/User";
import { Decursorify } from "../../utils/Pagination/cursorify";
import relayPaginate from "../../utils/Pagination/relayPaginate";

type ResolverFn = (
  parent: any,
  args: any,
  ctx: Context,
  info: GraphQLResolveInfo
) => any;

interface ResolverMap {
  [field: string]: ResolverFn;
}
interface Resolvers {
  [resolver: string]: ResolverMap;
}

export const resolvers: Resolvers = {
  User: {
    sentConfessionRequests: async (parent, args, _context, _info) => {
      const totalCount = await Request.count({ anonymous: parent.name });
      const sentConfessions = await Request.find({
        anonymous: parent.name,
        ...(args.after && { date: { $lt: Decursorify(args.after) } }),
      })
        .sort({
          date: -1,
        })
        .limit(args.limit);

      const data = relayPaginate({
        finalArray: sentConfessions,
        cursorIdentifier: "date",
        limit: args.limit,
      });
      return { ...data, totalCount };
    },
    receivedConfessionRequests: async (parent, args, _context, _info) => {
      const totalCount = await Request.count({ receiver: parent.name });
      const receivedConfessions = await Request.find({
        receiver: parent.name,
        ...(args.after && { date: { $lt: Decursorify(args.after) } }),
      })
        .sort({
          date: -1,
        })
        .limit(args.limit);

      const data = relayPaginate({
        finalArray: receivedConfessions,
        cursorIdentifier: "date",
        limit: args.limit,
      });
      return { ...data, totalCount };
    },
    activeChat: async (parent, _args, _context, _info) => {
      return await Chat.findById(parent.activeChat);
    },
  },
  Request: {
    anonymous: async (parent, _args, _context, _info) => {
      return await User.findOne({ name: parent.anonymous }).lean();
    },
    receiver: async (parent, _args, _context, _info) => {
      return await User.findOne({ name: parent.receiver }).lean();
    },
  },
  Chat: {
    anonymous: async (parent, _args, _context, _info) => {
      return await User.findOne({ name: parent.anonymous });
    },
    confessee: async (parent, _args, _context, _info) => {
      return await User.findOne({ name: parent.confessee });
    },
  },
  Query: {
    searchUser: async (_parent, args, _context, _info) => {
      const searchUserResult = await User.find({
        name: {
          $regex: new RegExp(args.key.trim(), "i"),
        },
      })
        .sort({ name: 1 })
        .limit(5);

      return searchUserResult;
    },
    getUser: async (_parent, args, _context, _info) => {
      return await User.findOne({ name: args.name });
    },
    getUserActiveChat: async (_parent, args, _context, _info) => {
      return await Chat.findOne({
        $or: [{ anonymous: args.name }, { confessee: args.name }],
      });
    },
  },

  Mutation: {
    createUser: async (_parent, args, _context, _info) => {
      await User.create(args);
      return true;
    },
    createUniqueTag: async (_parent, args, _context, _info) => {
      await User.updateOne(
        { _id: new ObjectId(args.userId) },
        { name: `${args.name}${Math.floor(1000 + Math.random() * 9000)}` },
        { new: true }
      );
      return true;
    },
    editUser: async (_parent, args, _context, _info) => {
      const { originalName, ...updatedFields } = args;
      await User.updateOne({ name: originalName }, updatedFields, {
        new: true,
      });
      return true;
    },
    sendConfessionRequest: async (_parent, args, _context, _info) => {
      const sentRequest = await Request.create({
        anonymous: args.anonymous,
        receiver: args.receiver,
        accepted: false,
      });
      return sentRequest;
    },
    rejectConfessionRequest: async (_parent, args, _context, _info) => {
      await Request.deleteOne({
        _id: args.requestID,
      });
      return true;
    },
    acceptConfessionRequest: async (_parent, args, _context, _info) => {
      const request = await Request.findByIdAndDelete(args.requestID);
      const newChat = await Chat.create({
        anonymous: request.anonymous,
        confessee: request.receiver,
      });
      await User.findOneAndUpdate(
        { name: request.anonymous },
        { activeChat: newChat._id }
      );
      await User.findOneAndUpdate(
        { name: request.receiver },
        { activeChat: newChat._id }
      );
      return newChat;
    },
  },
};
