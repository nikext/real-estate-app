import prisma from "../lib/prisma.js";

export const getPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Failed to get posts" });
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
    res.status(200).json(post);
  } catch (error) {
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
