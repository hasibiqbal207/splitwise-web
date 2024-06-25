import jwt from "jsonwebtoken";

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
};

// [check]
const validateToken = (req, res, next) => {
  next();
};

// [check]
const validateUser = (user, email) => {
  return true;
};

export default {
  generateAccessToken,
  validateToken,
  validateUser,
};
