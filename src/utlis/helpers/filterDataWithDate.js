export const filterDataWithDate = ({ data, filterTime }) => {
  try {
    const filteredData = data.filter(
      ({ LectureDateTime }) => new Date(LectureDateTime) >= new Date(filterTime)
    );
    return filteredData;
  } catch (err) {
    console.error(err.message);
    return data;
  }
};
