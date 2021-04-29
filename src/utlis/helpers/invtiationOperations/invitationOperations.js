import { GET_USER_INVITATION_WITH_EMAIL } from 'api/queries/getInvitationWithEmail';
import axios from 'axios';
import Cookies from 'js-cookie';
import client from 'utlis/apollo/apolloClient';
import { getFullName } from '../getFullName';

export async function checkPreviousInvitations({ email }) {
  return await client.query({
    query: GET_USER_INVITATION_WITH_EMAIL,
    variables: {
      email,
    },
  });
}

export async function createNewInvitation({
  createInvitation,
  email,
  selectedRole,
  id,
  department,
}) {
  const {
    data: {
      createUserInvitation: { userInvitation },
    },
  } = await createInvitation({
    variables: {
      email,
      role: selectedRole,
      user: id,
      department,
      latest_invitation_time: new Date(),
    },
  });
  return { invitationID: userInvitation.id };
}

export async function sendInvitationEmail({
  email,
  token,
  department,
  teaching_role,
  name,
  prefix,
}) {
  try {
    await axios
      .post(
        'http://localhost:1337/invitation-email',
        {
          email,
          token,
          department,
          teaching_role,
          name,
          prefix,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
        }
      )
      .then(function (response) {
        console.log(response);
      });
  } catch (e) {
    console.error(e.message);
  }
}

export const handleSubmitInvitationForm = async ({
  departments,
  department,
  roles,
  userInvitations,
  email,
  selectedRole,
  userID,
  createInvitation,
  updateInvitationDate,
  LecturerNameInEnglish,
}) => {
  try {
    let tokenID;
    const departmentData = departments.find((d) =>
      [d.DepartmentNameInEnglish, d.DepartmentNameInArabic, d.id].includes(
        department
      )
    );
    console.log(
      `🚀 ~ file: invitationOperations.js ~ line 92 ~ departmentData`,
      departmentData
    );

    const roleDate = roles.find((r) => [r.name, r.id].includes(selectedRole));

    if (!departmentData || !roleDate) return false;

    const userInvitation = userInvitations.find(
      (userInvite) => userInvite.email === email
    );

    if (!userInvitation) {
      const { invitationID } = await createNewInvitation({
        createInvitation,
        email,
        selectedRole: roleDate.id,
        id: userID,
        department: departmentData.id,
      });
      tokenID = invitationID;
    } else {
      if (userInvitation.isUsed) {
        console.log('Not Valid');
        return false;
      }
      tokenID = userInvitation.id;
      await updateInvitationDate({
        variables: {
          id: tokenID,
          latest_invitation_time: new Date(),
          department: departmentData.id,
          role: roleDate.id,
          user: userID,
        },
      });
    }
    await sendInvitationEmail({
      email,
      token: tokenID,
      department: departmentData.DepartmentNameInEnglish,
      teaching_role: roleDate.name,
      name: getFullName(LecturerNameInEnglish),
      prefix: 'Dr. ',
    });
    return tokenID;
  } catch (err) {
    console.error(err.message);
  }
};
