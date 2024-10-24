// src/app/api/decks/[deckId]/kanji/route.js
import { database } from "@/lib/firebase";
import { ref, set, get, remove } from "firebase/database";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  try {
    const { userId, kanji } = await request.json();
    const { deckId } = params;

    if (!userId || !kanji || !deckId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const deckRef = ref(database, `users/${userId}/decks/${deckId}`);
    const kanjiRef = ref(
      database,
      `users/${userId}/decks/${deckId}/kanji/${kanji.slug}`
    );

    // Check if deck exists
    const deckSnapshot = await get(deckRef);
    if (!deckSnapshot.exists()) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }

    // Check if kanji already exists in deck
    const kanjiSnapshot = await get(kanjiRef);
    if (kanjiSnapshot.exists()) {
      return NextResponse.json({
        message: "Kanji already exists in deck",
        exists: true,
      });
    }

    const kanjiData = {
      character: kanji.kanji,
      reading: kanji.reading || "",
      meanings: Array.isArray(kanji.meanings)
        ? kanji.meanings
        : [kanji.meaning],
      dateAdded: Date.now(),
      slug: kanji.slug,
    };

    await set(kanjiRef, kanjiData);

    // Update kanji count in deck
    const currentKanjiCount = (deckSnapshot.val().kanjiCount || 0) + 1;
    await set(
      ref(database, `users/${userId}/decks/${deckId}/kanjiCount`),
      currentKanjiCount
    );

    return NextResponse.json({
      message: "Kanji added to deck successfully",
      kanji: kanjiData,
    });
  } catch (error) {
    console.error("Error adding kanji to deck:", error);
    return NextResponse.json(
      { error: "Failed to add kanji to deck", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const kanjiSlug = searchParams.get("slug");
    const { deckId } = params;

    if (!userId || !kanjiSlug || !deckId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const deckRef = ref(database, `users/${userId}/decks/${deckId}`);
    const kanjiRef = ref(
      database,
      `users/${userId}/decks/${deckId}/kanji/${kanjiSlug}`
    );

    // Check if deck exists
    const deckSnapshot = await get(deckRef);
    if (!deckSnapshot.exists()) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }

    // Remove kanji from deck
    await remove(kanjiRef);

    // Update kanji count
    const currentKanjiCount = Math.max(
      (deckSnapshot.val().kanjiCount || 0) - 1,
      0
    );
    await set(
      ref(database, `users/${userId}/decks/${deckId}/kanjiCount`),
      currentKanjiCount
    );

    return NextResponse.json({
      message: "Kanji removed from deck successfully",
    });
  } catch (error) {
    console.error("Error removing kanji from deck:", error);
    return NextResponse.json(
      { error: "Failed to remove kanji from deck", details: error.message },
      { status: 500 }
    );
  }
}

// Get all kanji in a deck
export async function GET(request, { params }) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const { deckId } = params;

    if (!userId || !deckId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const kanjiRef = ref(database, `users/${userId}/decks/${deckId}/kanji`);
    const snapshot = await get(kanjiRef);

    if (!snapshot.exists()) {
      return NextResponse.json({ kanji: [] });
    }

    const kanjiList = [];
    snapshot.forEach((childSnapshot) => {
      kanjiList.push({
        id: childSnapshot.key,
        ...childSnapshot.val(),
      });
    });

    // Sort by dateAdded in descending order
    kanjiList.sort((a, b) => b.dateAdded - a.dateAdded);

    return NextResponse.json({ kanji: kanjiList });
  } catch (error) {
    console.error("Error fetching deck kanji:", error);
    return NextResponse.json(
      { error: "Failed to fetch deck kanji", details: error.message },
      { status: 500 }
    );
  }
}
