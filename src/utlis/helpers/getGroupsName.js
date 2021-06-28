const reducer = (accumulator, currentValue) =>
  accumulator + ' & ' + currentValue;
export const extractGroupsName = (groupNumbers) => {
  const groupsName =
    groupNumbers.length > 1
      ? `Groups ${groupNumbers.reduce(reducer)}`
      : `Group ${groupNumbers[0]}`;
  return groupsName;
};
