import axios from 'axios';
import Cookies from 'js-cookie';

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
