import { NextResponse } from "next/server";
import { getGoogleAdsOverview } from "@/lib/googleAds";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30", 10);
    const safeDays = [7, 30, 90].includes(days) ? days : 30;

    const data = await getGoogleAdsOverview(safeDays);

    return NextResponse.json({ success: true, ...data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching Google Ads overview:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load Google Ads data" },
      { status: 500 }
    );
  }
}
