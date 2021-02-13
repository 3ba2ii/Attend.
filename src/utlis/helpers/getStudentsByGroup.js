export const getStudentsByGroup = async ({ getStudentsIDs, GroupID }) => {
  const { data } = await getStudentsByGroup({
    variables: {
      group: GroupID,
    },
  });
  console.log(
    `🚀 ~ file: getStudentsByGroup.js ~ line 3 ~ getStudentsByGroup ~ data`,
    data
  );
};
