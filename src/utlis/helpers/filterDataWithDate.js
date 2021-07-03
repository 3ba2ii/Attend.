export const filterDataWithDate = ({ data, filterTime }) => {
  try {
    if (!filterTime) return data;
    const filteredData = data.filter(
      ({ LectureDateTime, SectionDateTime }) =>
        new Date(LectureDateTime || SectionDateTime) >= new Date(filterTime)
    );

    return filteredData;
  } catch (err) {
    console.error(err.message);
    return data;
  }
};
