export const handleChangesAndReturnNextState = (
  e,
  handleCurrentState,
  handleNextState,
  data,
  neededField
) => {
  handleCurrentState(e.target.value);
  const selectedData = data.filter((x) => x.id === e.target.value);
  console.log(
    `🚀 ~ file: handleChangesAndReturnNextState.js ~ line 10 ~ selectedData`,
    selectedData
  );
  handleNextState(selectedData[0][neededField]);
};
