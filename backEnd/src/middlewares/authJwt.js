import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).send({ message: "No token provided" });
  }

  jwt.verify(token, process.env.SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    req.userId = decoded.id;
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      req.userRole = user.role;
      next();
    } catch (error) {
      return res.status(500).send({ message: "Unable to authenticate user" });
    }
  });
};

export const isManager = (req, res, next) => {
  if (req.userRole !== "manager") {
    return res.status(403).send({ message: "Require Manager Role!" });
  }
  next();
};
