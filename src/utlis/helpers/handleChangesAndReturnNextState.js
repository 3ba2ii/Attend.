export const handleChangesAndReturnNextState = (
  e,
  handleCurrentState,
  handeNextState,
  data,
  neededField
) => {
  handleCurrentState(e.target.value);
  const selectedData = data.filter((x) => x.id === e.target.value);
  handeNextState(selectedData[0][neededField]);
};
