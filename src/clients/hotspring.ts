import { ApolloClient, InMemoryCache } from "@apollo/client";

import { HOTSPRING_URL } from "config";

const client = new ApolloClient({
  uri: HOTSPRING_URL,
  cache: new InMemoryCache(),
});

export default client;
