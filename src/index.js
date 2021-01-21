import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import './index.css';
import App from './App';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from 'redux-logger';
import rootReducer from './redux-store/reducers/index';

import { ApolloProvider } from '@apollo/client';
import client from './utlis/apollo/apolloClient';

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(logger))
);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </Router>
  </Provider>,
  document.getElementById('root')
);
