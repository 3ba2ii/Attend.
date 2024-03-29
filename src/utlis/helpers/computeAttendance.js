export const computeOverallAttendanceRate = ({ data, studentsLength }) => {
  if (studentsLength === 0 || data?.length === 0) {
    return 0;
  }
  try {
    const count = data.length;

    let result = 0;
    data.forEach(({ attendances }) => {
      result += (attendances.length / studentsLength) * 100;
    });
    return (result / count).toFixed(1);
  } catch (e) {
    console.error(e.message);
    return 0;
  }
};

export const computeGrowth = ({ data, studentsLength }) => {
  if (studentsLength === 0) {
    return 0;
  }
  const sortedLectures = data
    .slice()
    .sort((a, b) => new Date(b.LectureDateTime) - new Date(a.LectureDateTime));

  const totalAttendance = computeOverallAttendanceRate({
    data,
    studentsLength,
  });
  const totalAttendanceWithoutLastLecture = computeOverallAttendanceRate({
    data: sortedLectures.slice(1, data.length),
    studentsLength,
  });

  return (totalAttendance - totalAttendanceWithoutLastLecture).toFixed(1);
};
