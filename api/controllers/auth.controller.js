import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hash,
      },
    });
    res.status(201).json({ message: "Registration successful", user: user });
  } catch (error) {
    res.status(500).json({ message: "Registration failed" });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { username: username },
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res.status(200).json({ message: "Login successful", user: user });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};

export const logout = (req, res) => {
  //db ops
};
