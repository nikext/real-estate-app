import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const getPosts = async (req, res) => {
  const query = req.query;
  try {
    const where = {
      city: query.city || undefined,
      type: query.type || undefined,
      property: query.property || undefined,
    };

    if (query.bedroom) {
      where.bedroom = parseInt(query.bedroom) || undefined;
    }

    if (query.minPrice || query.maxPrice) {
      where.price = {};
      if (query.minPrice)
        where.price.gte = parseInt(query.minPrice) || undefined;
      if (query.maxPrice)
        where.price.lte = parseInt(query.maxPrice) || undefined;
    }

    const posts = await prisma.post.findMany({ where });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error in getPosts:", error);
    res
      .status(500)
      .json({ message: "Failed to get posts", error: error.message });
  }
};

export const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    let isSaved = false;
    const token = req.cookies?.token;

    if (token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const saved = await prisma.savedPost.findUnique({
          where: {
            userId_postId: {
              postId: id,
              userId: payload.id,
            },
          },
        });
        isSaved = !!saved;
      } catch (err) {
        console.error("Error verifying token:", err);
      }
    }

    res.status(200).json({ ...post, isSaved });
  } catch (err) {
    console.error("Error in getPost:", err);
    res.status(500).json({ message: "Failed to get post" });
  }
};

export const addPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;
  try {
    const post = await prisma.post.create({
      data: {
        ...body.postData,
        userId: tokenUserId,
        postDetail: {
          create: body.postDetail,
        },
      },
    });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Failed to add post" });
  }
};

export const updatePost = async (req, res) => {
  const id = req.params.id;
  const {
    title,
    price,
    img,
    address,
    city,
    bedroom,
    bathroom,
    latitude,
    longitude,
    type,
    property,
  } = req.body;
  const tokenUserId = req.userId;
  try {
    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        price,
        img,
        address,
        city,
        bedroom,
        bathroom,
        latitude,
        longitude,
        type,
        property,
      },
    });
    res.status(200).json({ message: "Post updated", post });
  } catch (error) {
    res.status(500).json({ message: "Failed to update post" });
  }
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  try {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post.userId === tokenUserId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await prisma.post.delete({ where: { id } });
    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete post" });
  }
};
