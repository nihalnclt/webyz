export const calculatePercentage = (
  value: number,
  total: number,
  precision = 2,
) => {
  return total === 0 ? 0 : Number(((value / total) * 100).toFixed(precision));
};
