import User from "../models/user.model.js";

export const getAllUsersService = async () => {
  try {
    return await User.find();
  } catch (e) {
    throw e;
  }
};

export const getUserByIDService = async (_id) => {
  try {
    return await User.findById(_id);
  } catch (e) {
    throw e;
  }
};
