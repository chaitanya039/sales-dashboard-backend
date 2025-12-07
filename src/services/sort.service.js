export const buildSortQuery = (sort, order = "asc") => {
  if (!sort) return {};

  return {
    [sort]: order === "desc" ? -1 : 1,
  };
};