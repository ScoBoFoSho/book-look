import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import {
  ApolloProvider, // special type of React component that provides data to all of the other components.
  ApolloClient, // constructor function that will help initialize connection to the GraphQL API server.
  InMemoryCache, // enables the Apollo Client instance to cache API response data so that we can perform requests more efficiently.
  createHttpLink, // allows us to control how the Apollo Client makes a request. Think of it like middleware for the outbound network requests.
} from "@apollo/client";

import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';
import { setContext } from "@apollo/client/link/context";

// establish a new link to the GraphQL server at its /graphql endpoint 
const httpLink = createHttpLink({
  uri: "/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// constructor to instantiate the Apollo Client instance and create the connection to the API endpoint.
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(), // new cache object using new InMemoryCache()
});


function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Switch>
            <Route exact path="/" component={SearchBooks} />
            <Route exact path="/saved" component={SavedBooks} />
            <Route render={() => <h1 className="display-2">Wrong page!</h1>} />
          </Switch>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
