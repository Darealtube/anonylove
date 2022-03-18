import { Context } from "@apollo/client";
import { GraphQLResolveInfo } from "graphql";
import { DateTime } from "luxon";
import { ObjectId } from "mongodb";
import Chat from "../../models/Chat";
import Message from "../../models/Message";
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
    messages: async (parent, args, _context, _info) => {
      const totalCount = await Message.count({ chat: parent._id });
      const messages = await Message.find({
        chat: parent._id,
        ...(args.after && { date: { $gt: Decursorify(args.after) } }),
      })
        .limit(10)
        .sort({ date: 1 });

      const data = relayPaginate({
        finalArray: messages,
        cursorIdentifier: "date",
        limit: args.limit,
      });
      return { ...data, totalCount };
    },
    latestMessage: async (parent, _args, _context, _info) => {
      const latestMessage = await Message.find({ chat: parent._id })
        .sort({
          date: -1,
        })
        .limit(1);
      return latestMessage[0];
    },
  },
  Message: {
    sender: async (parent, _args, _context, _info) => {
      return await User.findOne({ name: parent.sender });
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
    sendMessage: async (_parent, args, _context, _info) => {
      const message = await Message.create(args);
      await Chat.findByIdAndUpdate(args.chat, {
        updatedAt: DateTime.local(),
        ...(args.anonymous
          ? { anonLastSeen: DateTime.local() }
          : { confesseeLastSeen: DateTime.local() }),
      });
      return message;
    },
    seenChat: async (_parent, args, _context, _info) => {
      const updatedChat = await Chat.findByIdAndUpdate(
        args.chat,
        {
          ...(args.person === "anonymous"
            ? { anonLastSeen: DateTime.local() }
            : { confesseeLastSeen: DateTime.local() }),
        },
        { new: true }
      );
      return {
        anonLastSeen: updatedChat.anonLastSeen,
        confesseeLastSeen: updatedChat.confesseeLastSeen,
      };
    },
  },
};
