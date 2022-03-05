import { Context } from "@apollo/client";
import { GraphQLResolveInfo } from "graphql";
import { ObjectId } from "mongodb";
import Chat from "../../models/Chat";
import Request from "../../models/Request";
import User from "../../models/User";
import { Decursorify } from "../../utils/Pagination.ts/cursorify";
import relayPaginate from "../../utils/Pagination.ts/relayPaginate";

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
      const totalCount = await Request.count({ sender: parent.name });
      const sentConfessions = await Request.find({
        sender: parent.name,
        ...(args.after && { date: { $lt: Decursorify(args.after) } }),
      })
        .sort({
          date: 1,
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
          date: 1,
        })
        .limit(args.limit);

      const data = relayPaginate({
        finalArray: receivedConfessions,
        cursorIdentifier: "date",
        limit: args.limit,
      });
      return { ...data, totalCount };
    },
    chats: async (parent, args, _context, _info) => {
      const totalCount = await Chat.count({
        $or: [{ confesser: parent.name }, { confessee: parent.name }],
      });
      const chats = await Chat.find({
        $or: [{ confesser: parent.name }, { confessee: parent.name }],
        ...(args.after && { updatedAt: { $gt: Decursorify(args.after) } }),
      }).limit(args.limit);
      
      const data = relayPaginate({
        finalArray: chats,
        cursorIdentifier: "updatedAt",
        limit: args.limit,
      });
      return { ...data, totalCount };
    },
  },
  Chat: {
    confesser: async (parent, _args, _context, _info) => {
      return await User.findOne({ name: parent.confesser });
    },
    confessee: async (parent, _args, _context, _info) => {
      return await User.findOne({ name: parent.confessee });
    },
  },
  Request: {
    sender: async (parent, _args, _context, _info) => {
      return await User.findOne({ name: parent.sender }).lean();
    },
    receiver: async (parent, _args, _context, _info) => {
      return await User.findOne({ name: parent.receiver }).lean();
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
        sender: args.sender,
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
        confesser: request.sender,
        confessee: request.receiver,
      });
      return newChat;
    },
  },
};
