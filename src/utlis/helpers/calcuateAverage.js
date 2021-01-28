export const average = (array) => array.reduce((a, b) => a + b) / array.length;

export const calculateGrowth = (array) => {
  const oldAverage = average(array.slice(0, array.length - 1));
  const newAverage = average(array);

  return (newAverage - oldAverage).toFixed(1);
};
