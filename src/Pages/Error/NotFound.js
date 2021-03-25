import { Link } from 'react-router-dom';
import notFoundImage from 'assets/clip-fatal-error.png';
import './not-found.css';
const NotFound = () => {
  return (
    <main id='page-not-found'>
      <header>
        <h3>
          Oops...
          <br />
          You are lost!
        </h3>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <Link to='/' className='go-to-home-btn'>
          Go Home
        </Link>
      </header>
      <div className='page-not-found-img-container'>
        <img src={notFoundImage} alt={'404'} />
      </div>
    </main>
  );
};

export default NotFound;
