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

const authLink = setContext(async (_, req) => {
  const session = await getSession(req);
  return {
    headers: {
      ...req.headers,
      authorization: session?.user?.id,
    },
  };
});

const httpLink = new HttpLink({
  uri: "https://anony-api-3.herokuapp.com/graphql",
  credentials: "include",
  fetchOptions: {
    mode: "cors", // This should always be CORS as our API server is on another domain.
  },
});

const wsLink =
  typeof window !== "undefined"
    ? new GraphQLWsLink(
        createClient({
          url: "wss://anony-api-3.herokuapp.com/graphql",
        })
      )
    : null;
// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
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

// Creates an HttpLink towards the website's api on https://anonylove.vercel.app/api/graphql.
// In order to work in dev environment, set the uri to http://localhost:4000/api/graphql.
// Before pushing to main, make sure to set it back to https://anonylove.vercel.app/api/graphql.

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
