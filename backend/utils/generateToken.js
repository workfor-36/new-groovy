import jwt from "jsonwebtoken";

export const generateToken = (id, role) => {
  const secret = process.env.JWT_SECRET || "your_jwt_secret";

  return jwt.sign({ id, role }, secret, {
    expiresIn: "7d",
  });
};
