import { ApolloProvider } from '@apollo/client';
import {
  createMuiTheme,
  ThemeProvider as MuiThemeProvider,
} from '@material-ui/core/styles';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from 'redux-logger';
import App from './App';
import './index.css';
import rootReducer from './redux/reducers/index';
import client from './utlis/apollo/apolloClient';

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(logger))
);
const THEME = createMuiTheme({
  typography: {
    fontFamily: `"Poppins", "Helvetica", "Arial", sans-serif`,
    color: '#334d6e',
  },
});
ReactDOM.render(
  <MuiThemeProvider theme={THEME}>
    <Provider store={store}>
      <Router>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </Router>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
);
