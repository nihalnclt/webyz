export const calcViewsPerVisit = (pageviews: number, visits: number) =>
  visits ? pageviews / visits : 0;

export const calcBounceRate = (bounces: number, visits: number) =>
  visits ? (bounces / visits) * 100 : 0;

export const calcVisitDuration = (duration: number, visits: number) =>
  visits ? duration / visits : 0;
