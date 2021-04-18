import notFound from 'assets/404.svg';
import Logo from 'components/common/Logo';
import { useHistory } from 'react-router-dom';
import './404.css';

const NotFound404 = () => {
  const history = useHistory();

  const routeChange = () => {
    let path = `/`;
    history.push(path);
  };

  return (
    <main id='not-found-page'>
      <span className='not-found-logo'>
        <Logo className='small-logo' />
      </span>
      <header>
        <div>
          <h1>
            I have bad <br />
            news for you
          </h1>
          <p>
            The page you are looking for might be removed or temporarily
            unavailable
          </p>
          <button
            onClick={routeChange}
            className='back-home-btn-tablets back-btn-styles'
          >
            Come Home
          </button>
        </div>
      </header>
      <div className='error-img-container'>
        <img src={notFound} alt='page-not-found' />
      </div>
      <button
        onClick={routeChange}
        className='back-home-btn-mobile back-btn-styles'
      >
        Come Home
      </button>
    </main>
  );
};

export default NotFound404;
