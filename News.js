/**
 * news package
 */

import React, { Component } from 'react';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import NewsList from './NewsList';
import DbManager from '../app/DBManager';

/* Styles ==================================================================== */
const httpLink = new HttpLink({ uri: 'https://community.mongrov.com/graphql' });
const authLink = setContext((_, { headers }) => {
  const { token } = DbManager.app; // get token from meteor
  // console.log('AUTH TOKEN', token);
  return {
    headers: {
      ...headers,
      authorization: token,
    },
  };
});

/* Component ==================================================================== */
class News extends Component {
  constructor(props) {
    // link: new HttpLink({ uri: 'https://www.graphqlhub.com/graphql' }),
    super(props);
    this._client = new ApolloClient({
      // link: new HttpLink({ uri: 'https://community.mongrov.com/graphql' }),
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
    });
  }

  render() {
    return (
      <ApolloProvider client={this._client}>
        <NewsList />
      </ApolloProvider>
    );
  }
}

/* eslint-disable */
export const ApolloWrapper = (CMP) => {
  return class extends Component {
    render() {
      return (
        <ApolloProvider client={this._client}>
          <CMP {...this.props} />
        </ApolloProvider>
      );
    }
  };
};

/* Export Component ==================================================================== */
export default News;
