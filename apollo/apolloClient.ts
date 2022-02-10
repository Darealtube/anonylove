import { useMemo } from "react";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getSession } from "next-auth/react";

export const APOLLO_STATE_PROP_NAME = "__APOLLO_STATE__";

let apolloClient: null | ApolloClient<NormalizedCacheObject>;

const authLink = setContext(async (_, { headers }) => {
  const session = await getSession();
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: `Bearer foue12i30nbr2o1`,
    },
  };
});

// Creates an HttpLink towards the website's api on https://anonylove.vercel.app/api/graphql.
// In order to work in dev environment, set the uri to http://localhost:4000/api/graphql.
// Before pushing to main, make sure to set it back to https://anonylove.vercel.app/api/graphql.

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: new HttpLink({
      uri: `https://anonylove.vercel.app/api/graphql`,
      credentials: "same-origin",
    }),
    cache: new InMemoryCache({}),
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
