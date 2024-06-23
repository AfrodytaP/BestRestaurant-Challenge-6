import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import {
  getAllUsersService,
  getUserByIDService,
} from "../services/user.services.js";
import mongoose from "mongoose";
import User from "../models/user.model.js";
mongoose.Promise = global.Promise;

export const userGetDbController = async (req, res) => {
  const users = await getAllUsersService();
  res.json(users);
};

export const userGetByIDController = async (req, res) => {
  console.log(req.body);
  const user = await getUserByIDService(req.body._id);
  res.json(user);
};

export const userLoginController = async (req, res) => {
  try {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      const err = new Error(`Validation failed`);
      err.statusCode = 422;
      err.data = errors.array();
      throw err;
    }

    User.findOne({ username: req.body.username })
      .exec()
      .then((user) => {
        if (!user) {
          return res.status(404).send({ message: `User not found` });
        }

        const passwordIsInvalid = bcrypt.compareSync(
          req.body.password,
          user.password
        );
        if (!passwordIsInvalid) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid username/password combination",
          });
        }

        const token = jwt.sign({ id: user.id }, process.env.SECRET, {
          expiresIn: 86400,
        });

        res.status(200).send({
          id: user._id,
          username: user.username,
          email: user.email,
          accessToken: token,
        });
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "An error occurred while logging in",
        });
      });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode ?? 500).send({ message: err.data });
  }
};

export const userRegisterController = async (req, res) => {
  console.log(req.body);
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error("Validation failed");
      err.statusCode = 422;
      err.data = errors.array();
      throw err;
    }

    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    });

    await user.save();

    res.status(201).send({ message: "User was registered successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(err.statusCode ?? 500)
      .send({ message: err.data || err.message });
  }
};

export const userChangePasswordController = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .send({ message: "Old password and new password are required." });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    const passwordIsValid = bcrypt.compareSync(oldPassword, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({ message: "Invalid old password." });
    }

    const hashedNewPassword = bcrypt.hashSync(newPassword, 8);

    user.password = hashedNewPassword;
    await user.save();

    res.status(200).send({ message: "Password changed successfully." });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
