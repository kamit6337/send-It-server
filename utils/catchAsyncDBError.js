const catchAsyncDBError = (func) => {
  return (...args) => {
    try {
      return func(...args);
    } catch (error) {
      throw error;
    }
  };
};

export default catchAsyncDBError;
