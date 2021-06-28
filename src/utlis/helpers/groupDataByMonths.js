export const groupDataByMonths = (data) => {
  var output = {};

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  data.forEach((meeting) => {
    const LectureDateTime = meeting?.LectureDateTime;
    const SectionDateTime = meeting?.SectionDateTime;
    const monthNumber = new Date(LectureDateTime || SectionDateTime).getMonth();

    const monthName = months[monthNumber];

    if (output?.hasOwnProperty(monthName)) {
      output[monthName] = output[monthName].concat({
        ...meeting,
        monthName,
        monthNumber,
      });
    } else {
      output[monthName] = [{ ...meeting, monthName, monthNumber }];
    }
  });
  return output;
};
