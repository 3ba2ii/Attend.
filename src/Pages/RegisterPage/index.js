import { GET_USER_INVITATION_INFO } from 'api/queries/getUserInvitation';
import Logo from 'components/common/Logo';
import Query from 'components/Query';
import { useState } from 'react';
import { useParams } from 'react-router';
import './register.css';
import { SignupForm } from './SignUpForm';

const RegisterPage = () => {
  let { token } = useParams();
  const [tokenInfo, setTokenInfo] = useState({});
  const [validToken, setValidToken] = useState(true);
  const [startAnimation, setStartAnimation] = useState(false);

  const onFetchRegistrationToken = ({ userInvitation }) => {
    setTokenInfo(userInvitation);
  };
  const onFetchErrorFunction = () => {
    setValidToken(false);
  };

  const handleNextStep = () => {
    setStartAnimation(true);
  };

  if (!validToken) {
    return <div>No Token</div>;
  }

  if (!token) {
    return <div>No Token</div>;
  }

  return (
    <main id='registration-page'>
      <Query
        query={GET_USER_INVITATION_INFO}
        variables={{ id: token?.split('token=')[1] }}
        onCompletedFunction={onFetchRegistrationToken}
        onErrorFunction={onFetchErrorFunction}
        errorComponent={<>No invitations found</>}
      >
        {({
          data: {
            userInvitation: { id, department, role, email },
            users,
          },
        }) => {
          return (
            <>
              <Logo className='small-logo' />
              <section className='register-page-container'>
                <SignupForm
                  existingUsernames={users.map((user) => user.username)}
                  {...{
                    email,
                    department: department,
                    role: role,
                    invitationID: id,
                    handleNextStep,
                    startAnimation,
                  }}
                />
                <section
                  className={`avatar-upload-step ${
                    startAnimation && 'animation-begin-next-stage'
                  }`}
                >
                  <UploadImageStep startAnimation={startAnimation} />
                </section>
              </section>
            </>
          );
        }}
      </Query>
    </main>
  );
};

export default RegisterPage;

function UploadImageStep() {
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState('');
  console.log(`🚀 ~ file: index.js ~ line 84 ~ UploadImageStep ~ image`, image);

  const handleUploadImage = (e) => {
    try {
      const img = e.currentTarget.files[0];

      const { size, name, type } = img;
      console.log(
        `🚀 ~ file: index.js ~ line 92 ~ handleUploadImage ~ size`,
        size > 2097152
      );
      if (!['image/png', 'image/jpg', 'image/jpeg', 'image/*'].includes(type)) {
        setImageError('Not Supported Type');
        return;
      }
      if (size > 2097152) {
        alert('File is too big');
        return;
      }

      setImage(e.currentTarget.files[0]);
    } catch (err) {
      console.error(err.message);
    }
  };
  return (
    <>
      <header>
        <h5 className='create-account-title'>Select a Profile Picture</h5>
        <div
          style={{
            marginBottom: '1rem',
            marginTop: '1rem',
            marginLeft: '1rem',
          }}
        />
      </header>
      <input
        id='file'
        name='file'
        type='file'
        onChange={handleUploadImage}
        accept='image/*'
      />
    </>
  );
}
