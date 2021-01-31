import { FAILED_AUTHENTICATION } from '../../types/constants/redux-constants';
import { LoginActionUsingCookies } from '../../redux-store/actions/authedAction';

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
  if (action.type !== FAILED_AUTHENTICATION) {
    dispatch(action);
    setRedirectToReferrer(true);
    setMounted(false);
  } else {
    setMounted(true);
  }
  setLoading(false);
  setCheckingCookiesLoading(false);
  setMounted(false);
}
