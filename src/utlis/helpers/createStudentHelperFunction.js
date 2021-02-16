export const createStudentHelperFunction = ({
  createStudent,
  studentsFile,
  group,
  setUploadLoading,
  setOpenSnackbar,
  setSnackbarType,
}) => {
  setUploadLoading(true);
  studentsFile.forEach(async (student) => {
    try {
      let StudentNameInArabic = student['اسم الطالب'];
      let StudentOfficialEmail = student['الايميل'];
      let sid = student['ID'] + '';
      let NationalID = student['الرقم القومي'] + '';

      const { data } = await createStudent({
        variables: {
          StudentNameInArabic,
          StudentOfficialEmail,
          sid,
          NationalID,
          group,
        },
      });

      setOpenSnackbar(true);
      setSnackbarType('success');
    } catch (e) {
      console.error(e.message);
      setOpenSnackbar(true);
      setSnackbarType('error');
    }
    setUploadLoading(false);
  });
};
