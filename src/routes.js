import React from 'react';
import { useSelector } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import MiniDrawer from './components/Drawer/Drawer';
import Login from './components/Login/Login';

const PrivateRoute = ({ children, ...rest }) => {
  const { authedUser } = useSelector((state) => state.authReducer);

  return (
    <Route
      {...rest}
      render={({ location }) => {
        return authedUser ? (
          children
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: location } }} />
        );
      }}
    />
  );
};

const Routes = () => (
  <Switch>
    <Route path='/login' render={() => <Login />} />
    <PrivateRoute path='/'>
      <MiniDrawer />
    </PrivateRoute>
  </Switch>
);

export default Routes;
