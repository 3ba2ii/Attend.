import SpinnerElement from 'components/Spinner/spinner';
import React, { lazy } from 'react';
import { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import ResponsiveDrawer from './components/Drawer/ResponsiveDrawer';

const LoginPage = lazy(() => import('pages/LoginPage'));
const ForgotPasswordPage = lazy(() =>
  import('pages/PasswordReset/ForgotPassword')
);
const ResetPasswordPage = lazy(() =>
  import('pages/PasswordReset/ResetPassword')
);
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
  <Suspense
    fallback={
      <div className='center-spinner'>
        <SpinnerElement />
      </div>
    }
  >
    <Switch>
      <Route path='/login' render={() => <LoginPage />} />
      <Route
        exact
        path='/forgot-password'
        render={() => <ForgotPasswordPage />}
      />
      <Route
        exact
        path='/reset-password/:code'
        render={() => <ResetPasswordPage />}
      />
      <PrivateRoute path='/'>
        <ResponsiveDrawer />
      </PrivateRoute>
    </Switch>
  </Suspense>
);

export default Routes;
