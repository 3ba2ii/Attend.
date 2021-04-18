import logo from 'assets/logo.svg';
import '../styles/logo.css';
const Logo = (props) => {
  return (
    <div className={`${props.className}`}>
      <img src={logo} alt='logo' />
    </div>
  );
};

export default Logo;
