import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import { REVIEW_TOOL_BACKEND } from "config";

const httpLink = createHttpLink({
  uri: REVIEW_TOOL_BACKEND,
});

const authLink = setContext((_, { headers }) => {
  if (localStorage.getItem("access")) {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem("access");
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  }
  return {
    headers: {
      ...headers,
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
export default client;
