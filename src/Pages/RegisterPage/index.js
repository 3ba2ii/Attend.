import { useMutation } from '@apollo/client';
import { LinearProgress } from '@material-ui/core';
import { UPDATE_USER_AVATAR } from 'api/mutations/updateUserAvatar';
import { UPLOAD_IMAGE } from 'api/mutations/uploadImage';
import { GET_USER_INVITATION_INFO } from 'api/queries/getUserInvitation';
import { Error } from 'components/common/ErrorIndicator';
import Logo from 'components/common/Logo';
import ImageSelector from 'components/ImageSelector/ImageSelector';
import Query from 'components/Query';
import { useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import './register.css';
import { SignupForm } from './SignUpForm';

const RegisterPage = () => {
  let { token } = useParams();
  const [tokenInfo, setTokenInfo] = useState({});
  const [validToken, setValidToken] = useState(true);
  const [startAnimation, setStartAnimation] = useState(0);
  const [createdUserInfo, setCreatedUserInfo] = useState(null);

  const onFetchRegistrationToken = ({ userInvitation }) => {
    setTokenInfo(userInvitation);
  };
  const onFetchErrorFunction = () => {
    setValidToken(false);
  };

  const handleNextStep = (stepNumber) => {
    setStartAnimation(stepNumber);
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
                  existingUsernames={users.map((user) =>
                    user.username.toLowerCase()
                  )}
                  {...{
                    email,
                    department: department,
                    role: role,
                    invitationID: id,
                    handleNextStep,
                    startAnimation,
                    setCreatedUserInfo,
                  }}
                />
                <section
                  className={`avatar-upload-step ${
                    startAnimation === 1 && 'animation-begin-next-stage'
                  } ${startAnimation > 1 && 'animation-begin-previous-stage'}`}
                >
                  <UploadImageStep
                    createdUserInfo={createdUserInfo}
                    handleNextStep={handleNextStep}
                  />
                </section>
                <section
                  className={`final-register-stage ${
                    startAnimation === 2 &&
                    'final-register-stage-begin-animation'
                  }`}
                >
                  <header>
                    <h1>🎉</h1>
                    <span className='bold-text-label'>
                      Congratulations, Your account was created successfully.
                      <br />
                      You can now go back to login page.
                    </span>
                  </header>
                  <Link style={{ width: '100%' }} to='/login'>
                    <button
                      type='submit'
                      className='register-submit-btn'
                      style={{ width: '100%' }}
                    >
                      <span>Go Back to Login</span>
                      <span className='icons8-right' />
                    </button>
                  </Link>
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

function UploadImageStep({ createdUserInfo, handleNextStep }) {
  const [currentImageState, setCurrentImageState] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [uploadImageMutation, { loading }] = useMutation(UPLOAD_IMAGE);
  const [updateUserAvatar, { loading: updateAvatarLoading }] = useMutation(
    UPDATE_USER_AVATAR
  );

  const onUploadImage = async () => {
    try {
      const imageFile = dataURLtoFile(
        currentImageState.croppedImg,
        'profile-avatar'
      );

      if (imageFile) {
        if (imageFile.size > 2097152) {
          setErrorMessage('Image is too big, please select a smaller image.');
          return;
        }
        if (
          !/([a-zA-Z0-9\s_\\.\-\(\):])+(.png|.jpg|.jpeg|.tiff|.webp|)$/i.test(
            imageFile.type
          )
        ) {
          setErrorMessage('Not a supported image type!');
          return;
        }
        const {
          data: {
            upload: { id },
          },
        } = await uploadImageMutation({
          variables: {
            file: imageFile,
          },
        });

        await updateUserAvatar({
          variables: {
            id: createdUserInfo.id,
            avatar: id,
          },
        });
        console.log('DONEEEE');
        handleNextOrSkip(2);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const ignoreError = () => {
    setErrorMessage(null);
  };

  const handleNextOrSkip = () => {
    handleNextStep(2);
  };
  return (
    <>
      {(loading || updateAvatarLoading) && (
        <LinearProgress className='loading-bar' />
      )}
      <div
        className={`${(loading || updateAvatarLoading) && 'disabled-form'}`}
      />
      <div className='image-uploader-step'>
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
        {errorMessage && <Error {...{ message: errorMessage, ignoreError }} />}

        <ImageSelector
          createdUserInfo={createdUserInfo}
          setCurrentImageState={setCurrentImageState}
        />
        <div className='upload-avatar-btns'>
          <button
            disabled={loading || updateAvatarLoading}
            onClick={handleNextOrSkip}
          >
            Skip
          </button>
          <button
            onClick={onUploadImage}
            disabled={loading || updateAvatarLoading}
          >
            Set Profile Picture
          </button>
        </div>
      </div>
    </>
  );
}

function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}
