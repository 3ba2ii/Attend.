import closeIcon from 'assets/icons/closeIcon.svg';
import './errorIndicator.css';
export function Error({ ignoreError }) {
  return (
    <div className='login-error full-width-separated'>
      <span>Incorrect username or password.</span>
      <aside onClick={ignoreError}>
        <img src={closeIcon} alt={'close'} className='error-close-icon' />
      </aside>
    </div>
  );
}
