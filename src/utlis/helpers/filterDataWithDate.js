export const filterDataWithDate = ({ data, filterTime }) => {
  try {
    const filteredData = data.filter(
      ({ LectureDateTime, SectionDateTime }) =>
        new Date(LectureDateTime || SectionDateTime) >= new Date(filterTime)
    );
    console.log(
      `🚀 ~ file: filterDataWithDate.js ~ line 7 ~ filterDataWithDate ~ filteredData`,
      filteredData
    );
    return filteredData;
  } catch (err) {
    console.error(err.message);
    return data;
  }
};
