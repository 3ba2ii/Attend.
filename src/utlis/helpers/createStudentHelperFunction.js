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
      console.log(
        `🚀 ~ file: createStudentHelperFunction.js ~ line 20 ~ studentsFile.forEach ~ data`,
        data
      );

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

/* ID: 123456
اسم الطالب: "احمد عبد الباقي عبد المنعم غنيم"
الايميل: "aghonem@gmail.com"
الرقم القومي: "2981120xxxx" */
