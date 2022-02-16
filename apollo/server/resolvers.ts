import { Context } from "@apollo/client";
import { GraphQLResolveInfo } from "graphql";
import User from "../../models/User";

export const resolvers = {
  Query: {
    getUsers: async (
      _parent: any,
      args: any,
      _context: Context,
      _info: GraphQLResolveInfo
    ) => {
      return await User.find({});
    },
    searchUser: async (
      _parent: any,
      args: any,
      _context: Context,
      _info: GraphQLResolveInfo
    ) => {
      const searchUserResult = await User.find({
        name: {
          $regex: new RegExp(args.key.trim(), "i"),
        },
      })
        .sort({ name: 1 })
        .limit(5);

      return searchUserResult;
    },
  },

  Mutation: {
    createUser: async (
      _parent: any,
      args: any,
      _context: Context,
      _info: GraphQLResolveInfo
    ) => {
      await User.create(args);
      return true;
    },
  },
};
