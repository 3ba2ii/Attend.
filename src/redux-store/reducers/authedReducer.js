import Cookies from 'js-cookie';
import {
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
      localStorage.setItem('token', action?.authedUser.jwt);
      Cookies.set('authedUser', action?.authedUser?.user?.id, {
        expires: 30,
      });
      return { ...state, authedUser: { ...action.authedUser } };

    case SUCCESSFULLY_AUTHENTICATED_USING_COOKIES:
      return { ...state, authedUser: { ...action.authedUser } };
    case SIGNED_OUT_SUCCESSFULLY:
      Cookies.remove('authedUser');
      localStorage.removeItem('token');

      return { ...state, authedUser: null };

    default:
      return state;
  }
};

export default authReducer;
