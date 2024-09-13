import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const shouldBeLoggedIn = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) return res.status(403).json({ message: "Forbidden" });

    res.status(200).json({ message: "Authorized" });
  });
};

export const shouldBeAdmin = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    if (!user.isAdmin) {
      return res.status(403).json({ message: "Not Authorized" });
    }
    res.status(200).json({ message: "Authorized" });
  });
};
