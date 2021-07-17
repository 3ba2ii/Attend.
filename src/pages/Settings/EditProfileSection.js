import { useMutation } from '@apollo/client';
import { TextField } from '@material-ui/core';
import { UPDATE_USER_INFO } from 'api/mutations/updateUserInfo';
import { UPLOAD_IMAGE } from 'api/mutations/uploadImage';
import { GET_ALL_USERNAMES } from 'api/queries/getAllUserNames';
import ImageSelector from 'components/ImageSelector/ImageSelector';
import Query from 'components/Query';
import { useFormik } from 'formik';
import { dataURLtoFile } from 'pages/RegisterPage';
import { useContext, useState } from 'react';
import * as Yup from 'yup';
import {
  CustomizeAvatarWithFormsLoader,
  SettingsPageContext,
} from './SettingsPage';

export const EditProfileSection = () => {
  const { authedUser } = useContext(SettingsPageContext);
  const {
    id,
    avatar,
    username,
    email,
    LecturerNameInEnglish,
    LecturerNameInArabic,
    PhoneNumber,
  } = authedUser;
  const [previousUsers, setPreviousUsers] = useState([]);
  const [currentImageState, setCurrentImageState] = useState(null);
  const [uploadImageMutation, { loading }] = useMutation(UPLOAD_IMAGE);
  const [updateUserInfo, { loading: updateUserInfoLoading }] =
    useMutation(UPDATE_USER_INFO);

  const handleUploadImage = async () => {
    try {
      const imageFile = dataURLtoFile(
        currentImageState.croppedImg,
        'profile-avatar'
      );

      if (imageFile) {
        if (
          !/([a-zA-Z0-9\s_\\.\-\(\):])+(.png|.jpg|.jpeg|.tiff|.webp|)$/i.test(
            imageFile.type
          )
        ) {
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
        return id;
      }
    } catch (err) {
      console.error(err.message);
    }
  };
  const onUsernamesFetched = ({ users }) => {
    try {
      let resultList = new Set([]);
      users.forEach(({ username: fetchedUsername, email: fetchedEmail }) => {
        if (fetchedUsername.toLowerCase() === username) return;
        if (fetchedEmail.toLowerCase() === email) return;
        resultList.add(fetchedUsername);
        resultList.add(fetchedEmail);
      });

      setPreviousUsers(resultList);
    } catch (e) {
      console.error(e.message);
    }
  };

  const formik = useFormik({
    initialValues: {
      username: username,
      email: email,
      NameInEnglish: LecturerNameInEnglish,
      NameInArabic: LecturerNameInArabic,
      PhoneNumber: PhoneNumber || '',
    },

    validationSchema: Yup.object({
      username: Yup.string()
        .required('Required!')
        .max(30, 'Must be 30 characters or less')
        .test(
          'unique-username',
          'This username is already taken.',
          (value) => !!value && !previousUsers.has(value.toLowerCase())
        ),

      email: Yup.string()
        .required('Required!')
        .test(
          'unique-email',
          'an account is already associated with this email',
          (value) => !!value && !previousUsers.has(value.toLowerCase())
        ),
      NameInEnglish: Yup.string()
        .matches(/^[a-zA-Z\s]*$/, 'Must contain only english characters')
        .min(10, 'Must be 10 characters or more')
        .max(50, 'Must be 50 characters or less')
        .required('Required!'),
      NameInArabic: Yup.string()
        .matches(
          /^[\u0621-\u064A\s\p{N}]+$/,
          'Must contain only arabic characters'
        )
        .min(10, 'Must be 10 characters or more')
        .max(50, 'Must be 50 characters or less')
        .required('Required!'),
    }),

    onSubmit: async ({
      PhoneNumber,
      email,
      NameInArabic,
      NameInEnglish,
      username,
    }) => {
      let { id: avatarID } = avatar || { id: '' };

      //check if the image has changed
      const isImageChanged =
        !currentImageState?.croppedImg.includes('res.cloudinary');

      if (isImageChanged) {
        //upload to server and then get the id of the file
        avatarID = await handleUploadImage();
      }
      //now update the user info
      await updateUserInfo({
        variables: {
          id: id,
          LecturerNameInArabic: NameInArabic,
          LecturerNameInEnglish: NameInEnglish,
          PhoneNumber: PhoneNumber,
          avatar: avatarID,
          email: email.toLowerCase(),
          username: username.toLowerCase(),
        },
      });

      window.location.reload();

      try {
      } catch (err) {
        console.error(err.message);
      }
    },
  });

  return (
    <section className='settings-section'>
      <header>
        <h3 className='third-color'>Edit Profile</h3>
      </header>
      <Query
        query={GET_ALL_USERNAMES}
        loadingComponent={<CustomizeAvatarWithFormsLoader />}
        onCompletedFunction={onUsernamesFetched}
      >
        {() => {
          return (
            <form className='edit-profile-form'>
              <ImageSelector
                createdUserInfo={authedUser}
                setCurrentImageState={setCurrentImageState}
                defaultImage={avatar?.url}
                includeUserInfo={false}
                imageClassName='settings-page-avatar'
              />
              <div className='row-fields'>
                <div>
                  <TextField
                    label='Username'
                    id='username'
                    name='username'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.username}
                    variant='outlined'
                    fullWidth
                    error={Boolean(
                      formik.touched.username && formik.errors.username
                    )}
                  />
                  {formik.touched.username && formik.errors.username ? (
                    <div className='form-error-message'>
                      {formik.errors.username}
                    </div>
                  ) : null}
                </div>

                <div>
                  <TextField
                    label='Email'
                    id='email'
                    name='email'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    variant='outlined'
                    fullWidth
                    error={Boolean(formik.touched.email && formik.errors.email)}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className='form-error-message'>
                      {formik.errors.email}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className='row-fields'>
                <div>
                  <TextField
                    label='Name in English'
                    id='NameInEnglish'
                    name='NameInEnglish'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.NameInEnglish}
                    variant='outlined'
                    fullWidth
                    error={Boolean(
                      formik.touched.NameInEnglish &&
                        formik.errors.NameInEnglish
                    )}
                  />
                  {formik.touched.NameInEnglish &&
                  formik.errors.NameInEnglish ? (
                    <div className='form-error-message'>
                      {formik.errors.NameInEnglish}
                    </div>
                  ) : null}
                </div>
                <div>
                  <TextField
                    label='Name in Arabic'
                    id='NameInArabic'
                    name='NameInArabic'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.NameInArabic}
                    variant='outlined'
                    fullWidth
                    error={Boolean(
                      formik.touched.NameInArabic && formik.errors.NameInArabic
                    )}
                  />
                  {formik.touched.NameInArabic && formik.errors.NameInArabic ? (
                    <div className='form-error-message'>
                      {formik.errors.NameInArabic}
                    </div>
                  ) : null}
                </div>
              </div>
              <div>
                <div>
                  <TextField
                    label='Phone Number'
                    id='phoneNumber'
                    name='PhoneNumber'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.PhoneNumber}
                    variant='outlined'
                    type='tel'
                    error={Boolean(
                      formik.touched.PhoneNumber && formik.errors.PhoneNumber
                    )}
                  />
                  {formik.touched.PhoneNumber && formik.errors.PhoneNumber ? (
                    <div className='form-error-message'>
                      {formik.errors.PhoneNumber}
                    </div>
                  ) : null}
                </div>
              </div>

              <button
                type='submit'
                className='save-changes-btn'
                onClick={formik.handleSubmit}
                disabled={loading || updateUserInfoLoading}
              >
                <span>Save Changes</span>
              </button>
            </form>
          );
        }}
      </Query>
    </section>
  );
};
