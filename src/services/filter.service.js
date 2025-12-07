export const buildFilterQuery = (params) => {
  const {
    region,
    gender,
    category,
    paymentMethod,
    ageMin,
    ageMax,
    startDate,
    endDate,
    tags
  } = params;

  const query = {};

  if (region) query.customerRegion = region;
  if (gender) query.gender = gender;
  if (category) query.productCategory = category;
  if (paymentMethod) query.paymentMethod = paymentMethod;

  // Age filter
  if (ageMin || ageMax) {
    query.age = {};
    if (ageMin) query.age.$gte = Number(ageMin);
    if (ageMax) query.age.$lte = Number(ageMax);
  }

  // Date filter
  if (startDate && endDate) {
    query.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }
  
   // Tag Filter
  if (tags) {
    query.tags = { $regex: tags, $options: "i" };
  }

  return query;
};