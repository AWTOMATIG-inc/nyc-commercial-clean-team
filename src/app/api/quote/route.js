import { db_connect } from "@/database";
import { QuoteModel } from "@/database/models/quoteModel";
import { pickStrings } from "@/lib/sanitize";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

const QUOTE_FIELDS = [
  "fullName",
  "email",
  "phone",
  "facilityType",
  "zipCode",
  "category",
];

export async function POST(request) {
  const formData = await request.formData();
  const quoteFormData = pickStrings(Object.fromEntries(formData), QUOTE_FIELDS);
  try {
    await db_connect();
    const quoteData = await QuoteModel.create(quoteFormData);
    if (!quoteData) {
      return NextResponse.json(
        { error: "quote creation failed" },
        { status: 500 },
      );
    }


    const paths = ["/", "/dashboard/quotes"];
    paths.forEach((p) => revalidatePath(p));
    return NextResponse.json(quoteData, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 },
    );
  }
}

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const query = Object.fromEntries(searchParams);
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
    const quotes = await QuoteModel.find(searchQuery)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await QuoteModel.countDocuments();
    const quoteData = {
      success: true,
      data: quotes,
      pagination: {
        page: page,
        limit: limit,
        total: total,
        totalPages: Math.ceil(total / limit),
      },
      message: "All quotes fetched successfully",
    };
    return NextResponse.json(quoteData, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 },
    );
  }
}
