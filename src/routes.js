import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import ResponsiveDrawer from './components/Drawer/ResponsiveDrawer';
import Login from './pages/Login/Login';

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
      <ResponsiveDrawer />
    </PrivateRoute>
  </Switch>
);

export default Routes;
