"use server";

import { db_connect } from "@/database";
import { BlogModel } from "@/database/models/blogModel";
import { BookingModel } from "@/database/models/bookingModel";
import { UserModel } from "@/database/models/userModel";

export const getBookingByQuery = async (query) => {
  const page = Number(query?.page) || 1;
  const limit = Number(query?.limit) || 10;
  const skip = (page - 1) * limit;
  let searchQuery = {};
  if (query) {
    if (query.status !== "all") {
      searchQuery.status = query.status;
    }
  }
  try {
    await db_connect();
    const bookings = await BookingModel.find(searchQuery)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    const total = await BookingModel.countDocuments();
    const bookingData = {
      success: true,
      data: JSON.parse(JSON.stringify(bookings)),
      pagination: {
        page: page,
        limit: limit,
        total: total,
        totalPages: Math.ceil(total / limit),
      },
      message: "All booking fetched successfully",
    };
    return bookingData;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getBookingById = async (id) => {
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
