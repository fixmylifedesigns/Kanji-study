// src/app/api/search/route.js
import { NextResponse } from "next/server";

export const dynamic = 'force-static';
export const revalidate = false;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    // Correct URL format with keyword parameter
    const url = `https://jisho.org/api/v1/search/words/?keyword=${encodeURIComponent(
      query
    )}`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "KanjiLearningApp/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`Jisho API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in Jisho API route:", error);
    return NextResponse.json(
      { error: "Failed to fetch data from Jisho", details: error.message },
      { status: 500 }
    );
  }
}
