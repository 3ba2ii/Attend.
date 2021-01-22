import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import MiniDrawer from './components/Dashboard/Drawer';
import Login from './components/Login/Login';

const Public = () => <div>Public</div>;

const Protected = () => <div>Protected</div>;

export const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true;
    setTimeout(cb, 100);
  },
};

const PrivateRoute = ({ children, ...rest }) => {
  return (
    <Route
      {...rest}
      render={({ location }) => {
        return fakeAuth.isAuthenticated === true ? (
          children
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: location } }} />
        );
      }}
    />
  );
};
const Routes = () => (
  <div>
    <Switch>
      {/*  <Route path='/' render={() => <Login />} /> */}
      <Route path='/' render={() => <MiniDrawer />} />
      {/* <PrivateRoute path='/'>
        <MiniDrawer />
      </PrivateRoute> */}
      <Route path='/public' render={() => <Public />} />
    </Switch>
  </div>
);

export default Routes;
