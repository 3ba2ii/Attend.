import React, { useState } from 'react';
import { Switch, Route, Link, Redirect, useLocation } from 'react-router-dom';

const Public = () => <div>Public</div>;

const Protected = () => <div>Protected</div>;

const Login = () => {
  const [redirectToReferrer, setRedirectToReferrer] = useState(false);
  const { state } = useLocation();
  console.log('🚀 ~ file: routes.js ~ line 11 ~ Login ~ state', state);

  const onLogin = () => {
    fakeAuth.authenticate(() => {
      setRedirectToReferrer(true);
    });
  };
  if (redirectToReferrer) {
    return <Redirect to={state?.from || '/'} />;
  }
  return (
    <div>
      <p>You must login in </p>
      <button onClick={onLogin}>Login</button>
    </div>
  );
};

const fakeAuth = {
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
    <ul>
      <li>
        <Link to='/login'>Login page</Link>
      </li>
      <li>
        <Link to='/protected'>Protected page</Link>
      </li>
      <li>
        <Link to='/public'>Public page</Link>
      </li>
    </ul>
    <Switch>
      <Route path='/login' render={() => <Login />} />

      <PrivateRoute path='/protected'>
        <Protected />
      </PrivateRoute>
      <Route path='/public' render={() => <Public />} />
    </Switch>
  </div>
);

export default Routes;
