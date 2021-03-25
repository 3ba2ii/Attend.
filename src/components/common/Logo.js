import logo from 'assets/logo.png';
const Logo = (props) => {
  return (
    <div className={`${props.className}`}>
      <img src={logo} alt='logo' />
    </div>
  );
};

export default Logo;
