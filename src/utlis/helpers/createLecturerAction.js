const CreateLecturerAccount = async (
  {
    email,
    username,
    password,
    TeachingRole,
    nameInEnglish,
    nameInArabic,
    departments,
  },
  createLecturer,
  setSubmitLoading,
  setOpenSnackbar,
  setSnackbarType
) => {
  setSubmitLoading(true);
  const depIDs = departments.map((dep) => dep.id);
  const RoleID =
    TeachingRole === 'TA'
      ? '6018080ea6926f2164cb93f7'
      : '6018080da6926f2164cb93f6';

  try {
    const { data } = await createLecturer({
      variables: {
        email,
        username,
        password,
        nameInArabic,
        nameInEnglish,
        departments: depIDs,
        role: RoleID,
      },
    });
    setOpenSnackbar(true);
    setSnackbarType('success');
  } catch (err) {
    console.error(err.message);
    setOpenSnackbar(true);
    setSnackbarType('error');
  }
  setSubmitLoading(false);
};

export default CreateLecturerAccount;
