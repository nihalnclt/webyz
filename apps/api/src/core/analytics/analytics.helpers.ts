export const calculatePercentage = (
  value: number,
  total: number,
  precision = 2,
) => {
  return total === 0 ? 0 : Number(((value / total) * 100).toFixed(precision));
};

export const calcViewsPerVisit = (pageviews: number, visits: number) =>
  visits ? pageviews / visits : 0;

export const calcBounceRate = (bounces: number, visits: number) =>
  visits ? (bounces / visits) * 100 : 0;

export const calcVisitDuration = (duration: number, visits: number) =>
  visits ? duration / visits : 0;
