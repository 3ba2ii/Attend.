import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from 'apollo-link-error';
import Cookies from 'js-cookie';
import { createUploadLink } from 'apollo-upload-client';

const uri = process.env.REACT_APP_BACKEND_URL
  ? `${process.env.REACT_APP_BACKEND_URL}/graphql`
  : 'http://localhost:1337/graphql';

const httpLink = createUploadLink({
  uri: uri,
});
const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) graphQLErrors.map(({ message }) => console.log(message));
});

const authLink = setContext((_, { headers }) => {
  const token = Cookies.get('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        UsersPermissionsUser: {
          role: {
            merge: true,
          },
          merge: true,
        },
        course: {
          merge: true,
        },
        user: {
          merge: true,
        },
      },
    },
  },
});

const client = new ApolloClient({
  link: ApolloLink.from([authLink, errorLink, httpLink]),
  cache,
});
export default client;
