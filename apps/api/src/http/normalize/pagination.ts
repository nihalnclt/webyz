export const normalizePagination = (query: {
  limit?: string;
  page?: string;
}) => {
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
  const page = Math.max(Number(query.page) || 1, 1);

  return { limit, page };
};
