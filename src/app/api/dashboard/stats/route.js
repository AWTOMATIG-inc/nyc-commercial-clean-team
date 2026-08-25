import { db_connect } from "@/database";
import { BookingModel } from "@/database/models/bookingModel";
import { QuoteModel } from "@/database/models/quoteModel";
import { BlogModel } from "@/database/models/blogModel";
import { FeedbackModel } from "@/database/models/feedbackModel";
import { timeAgo } from "@/utility/timeAgo";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await db_connect();

    // 1. Total counts from Database
    const totalBookings = await BookingModel.countDocuments();
    const pendingQuotes = await QuoteModel.countDocuments();
    const publishedArticles = await BlogModel.countDocuments();

    // 2. Calculate Customer Satisfaction from Feedback ratings
    const feedbacks = await FeedbackModel.find().select("rating clientName feedback createdAt").lean();
    let satisfaction = "98.4%";
    if (feedbacks.length > 0) {
      const avgRating =
        feedbacks.reduce((acc, curr) => acc + (curr.rating || 5), 0) / feedbacks.length;
      const pct = (avgRating / 5) * 100;
      satisfaction = `${pct.toFixed(1)}%`;
    }

    // 3. Compute Monthly Booking Trends (Jan - Dec)
    const currentYear = new Date().getFullYear();
    const allBookings = await BookingModel.find().select("createdAt facilityType").lean();

    const monthlyOffice = Array(12).fill(0);
    const monthlyIndustrial = Array(12).fill(0);

    allBookings.forEach((b) => {
      const date = new Date(b.createdAt || Date.now());
      const month = date.getMonth(); // 0-11
      const type = (b.facilityType || "").toLowerCase();

      if (type.includes("industrial") || type.includes("post-construction")) {
        monthlyIndustrial[month] += 1;
      } else {
        monthlyOffice[month] += 1;
      }
    });

    // 4. Gather Recent Activity from DB collections
    const recentBookings = await BookingModel.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();
    const recentQuotes = await QuoteModel.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();
    const recentBlogs = await BlogModel.find()
      .sort({ createdAt: -1 })
      .limit(2)
      .lean();
    const recentFeedbacks = await FeedbackModel.find()
      .sort({ createdAt: -1 })
      .limit(2)
      .lean();

    const activityList = [];

    recentQuotes.forEach((q) => {
      activityList.push({
        id: `quote-${q._id}`,
        title: `New quote from ${q.fullName || q.companyName || "Client"}`,
        rawDate: q.createdAt || Date.now(),
        time: timeAgo(q.createdAt || Date.now()),
        icon: "lucide:file-text",
        color: "text-blue-600 bg-blue-50 border-blue-100",
      });
    });

    recentBookings.forEach((b) => {
      activityList.push({
        id: `booking-${b._id}`,
        title: `Booking #${b.bookingId || b._id?.toString().slice(-6)} confirmed`,
        rawDate: b.createdAt || Date.now(),
        time: timeAgo(b.createdAt || Date.now()),
        icon: "lucide:check-circle-2",
        color: "text-emerald-600 bg-emerald-50 border-emerald-100",
      });
    });

    recentFeedbacks.forEach((f) => {
      activityList.push({
        id: `feedback-${f._id}`,
        title: `Feedback received from ${f.clientName || "Client"}`,
        rawDate: f.createdAt || Date.now(),
        time: timeAgo(f.createdAt || Date.now()),
        icon: "lucide:message-square",
        color: "text-purple-600 bg-purple-50 border-purple-100",
      });
    });

    recentBlogs.forEach((bl) => {
      activityList.push({
        id: `blog-${bl._id}`,
        title: `Article '${bl.title}' published`,
        rawDate: bl.createdAt || Date.now(),
        time: timeAgo(bl.createdAt || Date.now()),
        icon: "lucide:newspaper",
        color: "text-amber-600 bg-amber-50 border-amber-100",
      });
    });

    // Sort combined activity feed by date descending
    activityList.sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));

    return NextResponse.json(
      {
        success: true,
        stats: {
          totalBookings,
          pendingQuotes,
          publishedArticles,
          customerSatisfaction: satisfaction,
        },
        trends: {
          office: monthlyOffice,
          industrial: monthlyIndustrial,
        },
        activities: activityList.slice(0, 5),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to load dashboard statistics" },
      { status: 500 }
    );
  }
}
