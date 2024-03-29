import { useMemo } from "react";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { relayStylePagination } from "@apollo/client/utilities";
import { split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { setContext } from "@apollo/client/link/context";
import { getSession } from "next-auth/react";
import { encrypt } from "../utils/encrypt";

// http://localhost:3000/graphql for test servers
// https://anony-api-3.herokuapp.com/graphql for production
// ws://localhost:3000/graphql for test websocket
// wss://anony-api-3.herokuapp.com/graphql

// ADDS AUTHENTICATION TO REQUESTS AND IS HANDLED IN THE API FOR RATE LIMITING AND AUTHORIZATION
const authLink = setContext(async (_, previousContext) => {
  const session = await getSession();
  return {
    headers: {
      ...previousContext.headers,
      Authorization: `Basic ${encrypt(
        previousContext.Authorization ?? session?.user?.id
      )} `,
    },
  };
});

// THE LINK TO THE APOLLO GRAPHQL API
const httpLink = new HttpLink({
  uri: "https://anony-api-3.herokuapp.com/graphql",
  credentials: "include",
  fetchOptions: {
    mode: "cors", // This should always be CORS as our API server is on another domain.
  },
});

// CREATES A WEBSOCKET LINK FOR THE CHATS
const wsLink =
  typeof window !== "undefined"
    ? new GraphQLWsLink(
        createClient({
          url: "wss://anony-api-3.herokuapp.com/graphql",
          connectionParams: async () => {
            const session = await getSession();
            return { Authorization: session?.user.id };
          },
        })
      )
    : null;

// THIS LINK TAKES IN CONSIDERATION OF THE SERVER SIDE RENDERING FUNCTIONALITY OF NEXTJS
// IF IT'S SSRing, KNOW IF THE REQUEST IS A QUERY OR A SUBSCRIPTION
// IF NOT, DEFAULT TO HTTP REQUESTS
const splitLink =
  typeof window !== "undefined"
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
          );
        },
        wsLink as GraphQLWsLink,
        httpLink
      )
    : httpLink;

export const APOLLO_STATE_PROP_NAME = "__APOLLO_STATE__";

let apolloClient: null | ApolloClient<NormalizedCacheObject>;

// CREATES APOLLO CLIENT FOR THE HOOKS TO FUNCTION
function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: authLink.concat(splitLink),
    cache: new InMemoryCache({
      typePolicies: {
        User: {
          fields: {
            sentConfessionRequests: relayStylePagination(),
            receivedConfessionRequests: relayStylePagination(),
            userNotifications: relayStylePagination(),
          },
        },
        Chat: {
          fields: {
            messages: relayStylePagination(),
          },
        },
      },
    }),
  });
}

// Initializes Apollo Client. This should be used before every request backend
// such as ```await apolloClient.query. This should not be changed in any way.

export function initializeApollo(initialState = null) {
  const _apolloClient: null | ApolloClient<NormalizedCacheObject> =
    apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

// This is to add the cache of every server's request on the cache found
// in Apollo Client. In every page that uses getStaticProps or getServerSideProps,
// the "apolloClient" should be passed as first parameter, then page props.

export function addApolloState(
  client: ApolloClient<NormalizedCacheObject>,
  pageProps: any
) {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
  }

  return pageProps;
}

// It memoizes the apolloClient in order for it not to repeat everytime a
// user navigates on another page.

export function useApollo(pageProps: any) {
  const state = pageProps[APOLLO_STATE_PROP_NAME];
  const store = useMemo(() => initializeApollo(state), [state]);
  return store;
}
