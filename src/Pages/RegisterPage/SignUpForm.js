import { useMutation } from '@apollo/client';
import { TextField } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import {
  CREATE_ACCOUNT,
  UPDATE_USER_INVITATION_USED,
} from 'api/mutations/createUserAccount';
import { useFormik } from 'formik';
import React from 'react';
import * as Yup from 'yup';

export const SignupForm = ({
  existingUsernames,
  email,
  department,
  role,
  invitationID,
  handleNextStep,
  startAnimation,
  setCreatedUserInfo,
}) => {
  const [createUserAccount, { loading }] = useMutation(CREATE_ACCOUNT);
  const [updateUserInvitation, { loading: updateLoading }] = useMutation(
    UPDATE_USER_INVITATION_USED
  );

  const formik = useFormik({
    initialValues: {
      username: '',
      NameInEnglish: '',
      NameInArabic: '',
      password: '',
      confirmPassword: '',
    },

    validationSchema: Yup.object({
      username: Yup.string()
        .required('Required!')
        .test(
          'unique-username',
          'This username is already taken.',
          (value) =>
            !!value && !existingUsernames.includes(value?.toLowerCase())
        )
        .max(30, 'Must be 30 characters or less')
        .matches(
          /^[a-z0-9_-]{3,30}$/gim,
          'Username must be at minimum 3 characters with no spaces'
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
      password: Yup.string()
        .required('Required!')
        .min(8, 'Password is too short - should be 8 chars minimum.')
        .matches(
          /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/,
          'Password can only contain Latin letters.'
        ),

      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Please confirm your password!'),
    }),

    onSubmit: async ({ NameInArabic, NameInEnglish, username, password }) => {
      try {
        const {
          data: {
            createUser: { user },
          },
        } = await createUserAccount({
          variables: {
            role: role.id,
            email,
            department: department.id,
            nameInArabic: NameInArabic,
            nameInEnglish: NameInEnglish,
            username,
            password,
            confirmed: true,
          },
        });

        await updateUserInvitation({
          variables: {
            id: invitationID,
            isUsed: true,
          },
        });

        setCreatedUserInfo(user);
        handleNextStep(1);
      } catch (err) {
        console.error(err.message);
      }
    },
  });

  return (
    <div
      className={`first-stage-container ${
        startAnimation > 0 && 'animation-begin-previous-stage'
      }`}
    >
      {(loading || updateLoading) && <LinearProgress className='loading-bar' />}
      <div className={`${(loading || updateLoading) && 'disabled-form'}`} />
      <header>
        <h5 className='create-account-title'> Create New Account</h5>
        <div
          style={{
            marginBottom: '1rem',
            marginTop: '1rem',
            marginLeft: '1rem',
          }}
        />
      </header>
      <div className='pre-form-information'>
        <span>
          You will be registered using{' '}
          <span className='font-weight600'>{email}</span> as a{' '}
          <span className='font-weight600'>{role?.name}</span> of{' '}
          <span className='font-weight600'>
            {department?.DepartmentNameInEnglish} Department.
          </span>{' '}
        </span>
      </div>
      <form onSubmit={formik.handleSubmit} className={`signup-form`}>
        <div>
          <TextField
            label='Username'
            id='username'
            name='username'
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            autoFocus
            value={formik.values.username}
            variant='outlined'
            size='small'
            fullWidth
            error={Boolean(formik.touched.username && formik.errors.username)}
          />

          {formik.touched.username && formik.errors.username ? (
            <div className='form-error-message'>{formik.errors.username}</div>
          ) : null}
        </div>
        <div className='row-fields'>
          <div>
            <TextField
              id='password'
              name='password'
              type='password'
              label='Password'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              variant='outlined'
              size='small'
              fullWidth
              error={Boolean(formik.touched.password && formik.errors.password)}
            />

            {formik.touched.password && formik.errors.password ? (
              <div className='form-error-message'>{formik.errors.password}</div>
            ) : null}
          </div>

          <div>
            <TextField
              id='confirmPassword'
              name='confirmPassword'
              type='password'
              label='Confirm Password'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
              variant='outlined'
              size='small'
              fullWidth
              error={Boolean(
                formik.touched.confirmPassword && formik.errors.confirmPassword
              )}
            />

            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <div className='form-error-message'>
                {formik.errors.confirmPassword}
              </div>
            ) : null}
          </div>
        </div>

        <div>
          <TextField
            label='Name in English'
            id='NameInEnglish'
            name='NameInEnglish'
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.NameInEnglish}
            variant='outlined'
            size='small'
            fullWidth
            error={Boolean(
              formik.touched.NameInEnglish && formik.errors.NameInEnglish
            )}
          />

          {formik.touched.NameInEnglish && formik.errors.NameInEnglish ? (
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
            size='small'
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

        <button type='submit' className='register-submit-btn'>
          <span>Sign up</span>
          <span className='icons8-right' />
        </button>
      </form>
    </div>
  );
};
