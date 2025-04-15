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

export const getStatusColor = (status) => {
  switch (status) {
    case "in progress":
      return "bg-yellow-200 text-yellow-700";
    case "to do":
      return "bg-blue-200 text-blue-700";
    case "completed":
      return "bg-green-200 text-green-700";
    default:
      return "bg-gray-200 text-gray-700";
  }
};

export const getPriorityColor = (priority) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-600";
    case "medium":
      return "bg-yellow-100 text-yellow-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};
