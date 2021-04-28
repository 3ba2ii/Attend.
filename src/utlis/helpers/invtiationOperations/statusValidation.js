export const checkStatus = ({
  email,
  department,
  role,
  users,
  departments,
}) => {
  if (!email || !departments || !department || !role) return 'Invalid';

  if (!validateEmail(email)) return 'Invalid Email';
  if (users.includes(email)) return 'User Exists';
  if (!['Lecturer', 'Teacher Assistant'].includes(role)) {
    return 'Unknown Role';
  }
  if (!departments.includes(department.toLowerCase().trim())) {
    return 'Unknown Department';
  }
  return 'Valid';
};
function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
