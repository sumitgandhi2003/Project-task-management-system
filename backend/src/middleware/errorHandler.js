const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong!";
  const errors = err.errors;

  // if (err.name === "ZodError") {
  //   res.status(422).json({
  //     success: false,
  //     message: "Validation Error",
  //     errors: errors.map((item) => {
  //       const { code, expected, message, path } = item;
  //       return { code, expected, message, name: path[0] };
  //     }),
  //     //   errrrr: errors,
  //   });
  // }

  res.status(statusCode).json({
    success: false,
    message: message,
  });
};

export default errorHandler;
