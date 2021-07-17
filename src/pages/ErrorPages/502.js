import BadGatewayImage from 'assets/BadGateway.png';
import './502.css';
const BadGatewayPage = () => {
  return (
    <main id='bad-gateway-page'>
      <div className='bad-gateway-img'>
        <img src={BadGatewayImage} alt={'Server Issue'} />
      </div>
      <header className='bad-gateway-header'>
        <h2>SERVER ISSUES</h2>
        <p>
          Please, try to refresh the page (sometimes this helps) or try again in
          30 minutes. We now know about this mistake and are working to fix it.
        </p>
        <span className='bad-gateway-502-text'>502 Bad Gateway</span>
      </header>
    </main>
  );
};

export default BadGatewayPage;
