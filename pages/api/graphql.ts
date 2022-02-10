import { ApolloServer } from "apollo-server-micro";
import { schema } from "../../apollo/server/schema";
import dbConnect from "../../lib/dbConnect";
import Cors from "micro-cors";

// We initialize cors because the new Apollo Server is done on a different site now, instead of /api/graphql.
const cors = Cors();

dbConnect();

const apolloServer = new ApolloServer({
  schema,
  context: ({ req }) => {
    console.log(req.cookies["next-auth.session-token"]);
  },
  formatError: (err) => {
    // Don't give the specific errors to the client.
    if (err.message.startsWith("Database Error: ")) {
      return new Error("Internal server error");
    }
    // Otherwise return the original error. The error can also
    // be manipulated in other ways, as long as it's returned.
    return err;
  },
});

// We need to start the server first before creating the handler, unlike in the previous versions of Apollo Server.
const startServer = apolloServer.start();

export const config = {
  api: {
    bodyParser: false,
  },
};

// Starts the Server and Creates Handler after that
const handler = cors(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }

  await startServer;
  await apolloServer.createHandler({
    path: "/api/graphql",
  })(req, res);
});

export default handler;
