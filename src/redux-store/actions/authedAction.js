import { GET_USER_BY_ID } from '../../api/queries/getUserByID';
import {
  FAILED_AUTHENTICATION,
  SIGNED_OUT_SUCCESSFULLY,
  SUCCESSFULLY_AUTHENTICATED,
  SUCCESSFULLY_AUTHENTICATED_USING_COOKIES,
} from '../../types/constants/redux-constants';
import client from '../../utlis/apollo/apolloClient';

export const LoginAction = async ({ identifier, password, LoginMutation }) => {
  try {
    const { data } = await LoginMutation({
      variables: {
        identifier: identifier,
        password: password,
      },
    });

    const userInfo = await client.query({
      query: GET_USER_BY_ID,
      variables: {
        id: data?.login?.user?.id,
      },
    });

    return {
      type: SUCCESSFULLY_AUTHENTICATED,
      authedUser: { ...userInfo?.data?.user, jwt: data?.login?.jwt },
    };
  } catch (err) {
    console.error(err.message);
    return { type: FAILED_AUTHENTICATION, error: err.message };
  }
};
export const LoginActionUsingCookies = async ({ _, userID }) => {
  try {
    const { data } = await client.query({
      query: GET_USER_BY_ID,
      variables: {
        id: userID,
      },
    });

    return {
      type: SUCCESSFULLY_AUTHENTICATED_USING_COOKIES,
      authedUser: { ...data?.user },
    };
  } catch (err) {
    console.error(err.message);
    return { type: FAILED_AUTHENTICATION, error: err.message };
  }
};
export const SignOut = () => {
  return { type: SIGNED_OUT_SUCCESSFULLY };
};
