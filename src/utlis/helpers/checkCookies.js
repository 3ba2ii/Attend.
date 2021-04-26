import { LoginActionUsingCookies } from 'redux/actions/authedAction';
import { FAILED_AUTHENTICATION } from 'types/constants/redux-constants';

export async function checkCookies({
  setLoading,
  dispatch,
  setRedirectToReferrer,
  setCheckingCookiesLoading,
  token,
  userID,
}) {
  setLoading(true);
  const action = await LoginActionUsingCookies({ token, userID });
  dispatch(action);
  if (action.type !== FAILED_AUTHENTICATION) {
    setRedirectToReferrer(true);
  }
  setLoading(false);
  setCheckingCookiesLoading(false);
}
