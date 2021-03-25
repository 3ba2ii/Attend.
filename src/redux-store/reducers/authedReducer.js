import Cookies from 'js-cookie';
import {
  FAILED_AUTHENTICATION,
  SIGNED_OUT_SUCCESSFULLY,
  SUCCESSFULLY_AUTHENTICATED,
  SUCCESSFULLY_AUTHENTICATED_USING_COOKIES,
} from '../../types/constants/redux-constants';

const initialState = { authedUser: null };

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SUCCESSFULLY_AUTHENTICATED:
      if (!action.authedUser) {
        return { ...state, authedUser: null };
      }
      console.log(
        `🚀 ~ file: authedReducer.js ~ line 12 ~ authReducer ~ action`,
        action
      );

      Cookies.set('token', action?.authedUser?.jwt, {
        expires: 30,
      });
      Cookies.set('authedUser', action?.authedUser?.id, {
        expires: 30,
      });
      return { ...state, authedUser: { ...action.authedUser } };

    case SUCCESSFULLY_AUTHENTICATED_USING_COOKIES:
      return { ...state, authedUser: { ...action.authedUser } };
    case SIGNED_OUT_SUCCESSFULLY:
      Cookies.remove('authedUser');
      Cookies.remove('token');
      return { ...state, authedUser: null };
    case FAILED_AUTHENTICATION:
      if (action.error === 'Invalid token.') {
        Cookies.remove('token');
        Cookies.remove('authedUser');
      }
      return { ...state, authedUser: null };

    default:
      return state;
  }
};

export default authReducer;
