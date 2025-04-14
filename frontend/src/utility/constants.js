export const toCapitalizeCase = (str) => {
  if (!str) return null;
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const checkValidation = (data = {}, requireData) => {
  const errors = {};
  const requiredKeys =
    Array.isArray(requireData) && requireData?.length > 0
      ? requireData
      : Object.keys(data);

  if (requiredKeys.length < 1) return null;
  // console.log(Object.entries(data));
  Object.entries(data).forEach(([key, value]) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isRequired = requiredKeys.includes(key);
    if (isRequired) {
      if (
        value === undefined ||
        value === null ||
        value === "" ||
        (Array.isArray(value) && value.length === 0)
      ) {
        errors[key] = `${toCapitalizeCase(key)} is required!`;
        return;
      }

      if (key.toLowerCase() === "email" && typeof value === "string") {
        if (!emailRegex.test(value)) {
          errors[key] = `Invalid email format`;
        }
      }
      if (key.toLowerCase() === "password" && value.length < 6) {
        errors[key] = `Password must be minimun six charactors`;
      }
    }
  });
  return Object.keys(errors).length > 0 ? errors : false;
};
