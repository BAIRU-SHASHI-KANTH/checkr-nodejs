export const createNameFilter = (name: string) => {
  return {
    $or: [
      createRegexFilter("firstName", name),
      createRegexFilter("middleName", name),
      createRegexFilter("lastName", name),
    ],
  };
};

const createRegexFilter = (field: string, value: string) => {
  return {
    [field]: { $regex: value, $options: "i" },
  };
};
