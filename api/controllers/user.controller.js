import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
};

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  let { password, avatar, ...rest } = req.body;

  if (tokenUserId !== id) {
    console.log("Not authorized", tokenUserId, id);
    return res.status(403).json({ message: "Not authorized" });
  }

  try {
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      rest.password = hashedPassword;
    }

    if (avatar) {
      rest.avatar = avatar;
    }

    const user = await prisma.user.update({
      where: { id },
      data: rest,
    });

    const { password: _, ...cleanUser } = user;

    res.status(200).json(cleanUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating user" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const tokenUserId = req.userId;

    if (tokenUserId !== id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const user = await prisma.user.delete({
      where: { id },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
};
