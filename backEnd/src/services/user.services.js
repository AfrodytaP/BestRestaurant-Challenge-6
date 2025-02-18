import User from "../models/user.model.js";
export default class UserService {
  getAllUsersService = async () => {
    try {
      return await User.find();
    } catch (e) {
      throw e;
    }
  };

  getUserByIDService = async (_id) => {
    try {
      const user = await User.findById(_id, "email");
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (e) {
      throw new Error(`Unable to fetch user: ${e.message}`);
    }
  };
}
