"use server";

import { db_connect } from "@/database";
import { BlogModel } from "@/database/models/blogModel";
import { UserModel } from "@/database/models/userModel";

// export const getBlogs = async () => {
//   try {
//     const res = await fetch(process.env.BASE_URL + "/api/blog", {
//       cache: "no-store",
//     });
//     if (!res.ok) {
//       throw new Error("blog fetch failed");
//     }
//     return res.json();
//   } catch (err) {
//     console.error(err);
//     throw err;
//   }
// };
export const getBlogs = async () => {
  try {
    await db_connect();
    const blogs = await BlogModel.find().sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(blogs));
  } catch (err) {
    console.error(err);
    throw err;
  }
};
// export const getBlogById = async (id) => {
//   try {
//     const res = await fetch(process.env.BASE_URL + "/api/blog/" + id, {
//       cache: "no-store",
//     });
//     if (!res.ok) {
//       throw new Error("blog fetch failed");
//     }
//     return res.json();
//   } catch (err) {
//     console.error(err);
//     throw err;
//   }
// };
export const getBlogById = async (id) => {
  try {
    console.log(UserModel);
    await db_connect();
    const blogs = await BlogModel.findById(id).populate("author").lean();
    return JSON.parse(JSON.stringify(blogs));
  } catch (err) {
    console.error(err);
    throw err;
  }
};
export const getBlogBySlug = async (slug) => {
  try {
    console.log(UserModel);
    await db_connect();
    const blogs = await BlogModel.findOne({slug}).populate("author").lean();
    return JSON.parse(JSON.stringify(blogs));
  } catch (err) {
    console.error(err);
    throw err;
  }
};
// export const getBlogByAuthorId = async (id) => {
//   try {
//     const res = await fetch(process.env.BASE_URL + "/api/blog/author/" + id, {
//       cache: "no-store",
//     });
//     if (!res.ok) {
//       throw new Error("blog fetch failed");
//     }
//     return res.json();
//   } catch (err) {
//     console.error(err);
//     throw err;
//   }
// };
export const getBlogByAuthorId = async (id) => {
  try {
    await db_connect();
    const user = await UserModel.findById(id);
    if (!user) {
      throw new Error("User not found!");
      return;
    }
    const blogs = await BlogModel.find({
      author: id,
    }).lean();
    const blogAndUserObj = {
      user: JSON.parse(JSON.stringify(user)),
      blogs: JSON.parse(JSON.stringify(blogs)),
    };
    return blogAndUserObj;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
