export const computeOverallAttendanceRate = ({ lectures, studentsLength }) => {
  try {
    const count = lectures.length;

    let result = 0;
    lectures.forEach(({ attendances }) => {
      result += (attendances.length / studentsLength) * 100;
    });
    return (result / count).toFixed(0);
  } catch (e) {
    console.error(e.message);
    return 0;
  }
};

export const computeGrowth = ({ lectures, studentsLength }) => {
  const sortedLectures = lectures
    .slice()
    .sort((a, b) => new Date(b.LectureDateTime) - new Date(a.LectureDateTime));

  const totalAttendance = computeOverallAttendanceRate({
    lectures,
    studentsLength,
  });
  const totalAttendanceWithoutLastLecture = computeOverallAttendanceRate({
    lectures: sortedLectures.slice(1, lectures.length),
    studentsLength,
  });

  return totalAttendance - totalAttendanceWithoutLastLecture;
};
