import { FAILED_AUTHENTICATION } from '../../types/constants/redux-constants';
import { LoginActionUsingCookies } from '../../redux-store/actions/authedAction';

export function checkCookies({ setLoading, dispatch, setRedirectToReferrer }) {
  setLoading(true);
  const action = LoginActionUsingCookies();
  if (action.type !== FAILED_AUTHENTICATION) {
    dispatch(action);
    setRedirectToReferrer(true);
  }

  setLoading(false);
}
