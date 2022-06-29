import NextAuth from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";
import clientPromise from "../../../lib/dbAdapter";
import { initializeApollo } from "../../../apollo/apolloClient";
import { CREATE_UNIQUE_TAG } from "../../../apollo/mutation/createUniqueTag";
import dbConnect from "../../../lib/dbConnect";

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_OAUTH_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_OAUTH_CLIENT_SECRET as string,
      version: "2.0",
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.AUTH_SECRET,
  events: {
    signIn: async ({ user, isNewUser }) => {
      if (isNewUser) {
        await dbConnect();
        const apolloClient = initializeApollo();
        await apolloClient.mutate({
          mutation: CREATE_UNIQUE_TAG,
          variables: {
            userId: user.id,
            name: user.name,
          },
        });
      }
    },
  },
  callbacks: {
    session: async ({ session, user }) => {
      session.user.id = user.id as string;
      return session;
    },
  },
});
