import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import UserService from "../services/User.services.js";
import mongoose from "mongoose";
import User from "../models/user.model.js";
mongoose.Promise = global.Promise;

export default class UserController {
  #service;

  constructor(service = new UserService()) {
    this.#service = service;
  }
  userGetDbController = async (req, res) => {
    try {
      const users = await this.#service.getAllUsersService();

      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  userGetByIDController = async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await this.#service.getUserByIDService(userId);
      res.json(user);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  };

  userLoginController = async (req, res) => {
    try {
      const errors = validationResult(req);
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
            role: user.role,
            accessToken: token,
          });
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || "An error occurred while logging in",
          });
        });
    } catch (err) {
      return res.status(err.statusCode ?? 500).send({ message: err.data });
    }
  };

  userRegisterController = async (req, res) => {
    try {
      console.log("Received request body:", req.body);
      const errors = validationResult(req);
      console.log("Validation errors:", errors.array());
      if (!errors.isEmpty()) {
        console.log("Validation failed, sending 422 response");
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
      const statusCode = err.statusCode || 500;
      const errorMessage = err.data || err.message || "Internal Server Error";

      res.status(statusCode).json({ message: errorMessage });
    }
  };

  userChangePasswordController = async (req, res) => {
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
}
