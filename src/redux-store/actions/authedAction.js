import axios from 'axios';
import {
  SUCCESSFULLY_AUTHENTICATED,
  FAILED_AUTHENTICATION,
  SIGNED_OUT_SUCCESSFULLY,
  SUCCESSFULLY_AUTHENTICATED_USING_COOKIES,
} from '../../types/constants/redux-constants';
import Cookies from 'js-cookie';

export const LoginAction = async (credentials) => {
  const url = process.env.STRAPI_APP_BACKEND_URL
    ? process.env.STRAPI_APP_BACKEND_URL
    : 'http://localhost:1337';
  try {
    const { data } = await axios.post(`${url}/auth/local`, {
      identifier: credentials.identifier,
      password: credentials.password,
    });
    return { type: SUCCESSFULLY_AUTHENTICATED, authedUser: data };
  } catch (err) {
    console.error(err.message);
    return { type: FAILED_AUTHENTICATION, error: err.message };
  }
};
export const LoginActionUsingCookies = () => {
  try {
    const body = Cookies.get('authedUser');
    const userInfo = JSON.parse(body);

    return {
      type: SUCCESSFULLY_AUTHENTICATED_USING_COOKIES,
      authedUser: { ...userInfo },
    };
  } catch (err) {
    console.error(err.message);
    return { type: FAILED_AUTHENTICATION, error: err.message };
  }
};
export const SignOut = () => {
  return { type: SIGNED_OUT_SUCCESSFULLY };
};
