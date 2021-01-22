import axios from 'axios';
import {
  SUCCESSFULLY_AUTHENTICATED,
  FAILED_AUTHENTICATION,
} from '../../types/constants/redux-constants';

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
