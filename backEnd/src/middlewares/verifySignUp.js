import User from "../models/user.model.js";

export const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    const userByUsername = await User.findOne({ username: req.body.username });
    if (userByUsername) {
      return res
        .status(400)
        .send({ message: "Failed! Username is already in use!" });
    }

    const userByEmail = await User.findOne({ email: req.body.email });
    if (userByEmail) {
      return res
        .status(400)
        .send({ message: "Failed! Email is already in use!" });
    }

    next();
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
