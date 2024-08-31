import getUserBySearch from "../../database/User/getUserBySearch.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const getSearchUser = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;
  const { search } = req.query;

  if (!search) {
    return next(new HandleGlobalError("Please provide search text", 404));
  }

  const users = await getUserBySearch(userId, search);

  res.json(users);
});

export default getSearchUser;
