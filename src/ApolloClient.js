// src/ApolloClient.js
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  concat,
} from "@apollo/client";

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      //  authorization: `Bearer ${process.env.REACT_APP_AUTH_TOKEN}`,
    },
  }));
  return forward(operation);
});

const httpLink = new HttpLink({
  uri: "/graphql",
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink),
});

export default client;
