// src/app/api/decks/route.js
import { database } from "@/lib/firebase";
import { ref, set, get, push } from "firebase/database";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId, name, createdAt } = await request.json();

    if (!userId || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const decksRef = ref(database, `users/${userId}/decks`);
    const newDeckRef = push(decksRef);

    const deckData = {
      name,
      createdAt: createdAt || new Date().toISOString(),
      kanjiCount: 0,
    };

    await set(newDeckRef, deckData);

    return NextResponse.json({
      message: "Deck created successfully",
      deck: {
        id: newDeckRef.key,
        ...deckData,
      },
    });
  } catch (error) {
    console.error("Error creating deck:", error);
    return NextResponse.json(
      { error: "Failed to create deck", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const decksRef = ref(database, `users/${userId}/decks`);
    const snapshot = await get(decksRef);

    if (!snapshot.exists()) {
      return NextResponse.json({ decks: [] });
    }

    const decks = [];
    snapshot.forEach((childSnapshot) => {
      decks.push({
        id: childSnapshot.key,
        ...childSnapshot.val(),
      });
    });

    // Sort by createdAt in descending order
    decks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return NextResponse.json({ decks });
  } catch (error) {
    console.error("Error fetching decks:", error);
    return NextResponse.json(
      { error: "Failed to fetch decks", details: error.message },
      { status: 500 }
    );
  }
}
