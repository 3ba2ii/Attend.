import { LoginActionUsingCookies } from 'redux-store/actions/authedAction';
import { FAILED_AUTHENTICATION } from 'types/constants/redux-constants';

export async function checkCookies({
  setLoading,
  dispatch,
  setRedirectToReferrer,
  setMounted,
  setCheckingCookiesLoading,
  token,
  userID,
}) {
  setLoading(true);
  const action = await LoginActionUsingCookies({ token, userID });
  dispatch(action);
  if (action.type !== FAILED_AUTHENTICATION) {
    setRedirectToReferrer(true);
    setMounted(false);
  } else {
    setMounted(true);
  }
  setLoading(false);
  setCheckingCookiesLoading(false);
}
