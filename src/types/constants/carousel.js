import statics from '../../assets/profit.png';
import time from '../../assets/time2.png';
import kingdom from '../../assets/kingdom.png';
import mail from '../../assets/Mail.png';

const carouselItems = [
  {
    name: 'Easy Reports',
    description:
      'Select and download your attendance reports with a lot of options and types.',
    image: statics,
  },
  {
    name: 'Automated Mails',
    description:
      'Alerts and notifications are sent to you via your email and appears on your account as well.',
    image: mail,
  },
  {
    name: 'Your Time Matters',
    description:
      'Save your precious time and get your attendance reports and statics right away!',
    image: time,
  },
  {
    name: 'Reward your Top Students',
    description:
      'Get to know how are your top students and send congratulations emails to them.',
    image: kingdom,
  },
];

export default carouselItems;
