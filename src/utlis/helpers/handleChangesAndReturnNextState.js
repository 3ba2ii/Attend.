export const handleChangesAndReturnNextState = (
  e,
  handleCurrentState,
  handleNextState,
  data,
  neededField
) => {
  handleCurrentState(e.target.value);
  const selectedData = data.filter((x) => x.id === e.target.value);

  handleNextState(selectedData[0][neededField]);
};
