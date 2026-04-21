export const queryFormatter = async (searchParams) => {
  const searchParamsQuery = await searchParams;
  const query = new URLSearchParams();
  Object.entries(searchParamsQuery).forEach(([key, value]) => {
    if (typeof value === "string") {
      query.append(key, value);
    }
  });

  return query.toString();
};
