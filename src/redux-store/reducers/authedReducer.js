import {
  SIGNED_OUT_SUCCESSFULLY,
  SUCCESSFULLY_AUTHENTICATED,
} from '../../types/constants/redux-constants';
import Cookies from 'js-cookie';

const initialState = { authedUser: null };

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SUCCESSFULLY_AUTHENTICATED:
      console.log(
        `🚀 ~ file: authedReducer.js ~ line 11 ~ authReducer ~ action.type`,
        action
      );

      Cookies.set(
        'authedUser',
        { ...action.authedUser },
        {
          expires: 30,
        }
      );
      return { ...state, authedUser: { ...action.authedUser } };
    case SIGNED_OUT_SUCCESSFULLY:
      Cookies.remove('user');

      return { ...state, authedUser: null };

    default:
      return state;
  }
};

export default authReducer;
