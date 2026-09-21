"use server";
import { db_connect } from "@/database";
import { PageModel } from "@/database/models/pageModel";

export const getPageById = async (id) => {
  try {
    await db_connect();
    const page = await PageModel.findById(id);
    return JSON.parse(JSON.stringify(page));
  } catch (err) {
    console.error(err);
    throw err;
  }
};
export const getPageBySlug = async (slug) => {
  if (!slug) return;
  try {
    await db_connect();
    const page = await PageModel.findOne({ pageName: slug });
    return JSON.parse(JSON.stringify(page));
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getPages = async () => {
  try {
    await db_connect();
    const pages = await PageModel.find({}, { pageName: 1, updatedAt: 1 }).lean();
    return JSON.parse(JSON.stringify(pages));
  } catch (err) {
    console.error(err);
    throw err;
  }
};
