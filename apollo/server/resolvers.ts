import { Context } from "@apollo/client";
import { GraphQLResolveInfo } from "graphql";
import { ObjectId } from "mongodb";
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
      return data;
    },
    receivedConfessionRequests: async (parent, args, _context, _info) => {
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
      return data;
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
    confessionRequestAction: async (_parent, args, _context, _info) => {
      const actRequest = await Request.updateOne(
        { _id: args.requestID },
        { accepted: args.accepted },
        { new: true }
      );
      return actRequest;
    },
  },
};
