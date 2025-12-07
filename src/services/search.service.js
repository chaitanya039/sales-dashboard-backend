export const buildSearchQuery = (search) => {
  if (!search) return {};

  return {
    $or: [
      { customerName: { $regex: search, $options: "i" } },
      { productName: { $regex: search, $options: "i" } },
      { brand: { $regex: search, $options: "i" } },
      { storeLocation: { $regex: search, $options: "i" } },
    ],
  };
};