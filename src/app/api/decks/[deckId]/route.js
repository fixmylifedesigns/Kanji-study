// src/app/api/decks/[deckId]/route.js
import { database } from "@/lib/firebase";
import { ref, set, get, remove } from "firebase/database";
import { NextResponse } from "next/server";

// Update deck details
export async function PUT(request, { params }) {
  try {
    const { userId, name } = await request.json();
    const { deckId } = params;

    if (!userId || !name || !deckId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const deckRef = ref(database, `users/${userId}/decks/${deckId}`);

    // Check if deck exists
    const snapshot = await get(deckRef);
    if (!snapshot.exists()) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }

    // Update only the name while preserving other fields
    const currentData = snapshot.val();
    await set(deckRef, {
      ...currentData,
      name,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      message: "Deck updated successfully",
      deck: {
        id: deckId,
        name,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error updating deck:", error);
    return NextResponse.json(
      { error: "Failed to update deck", details: error.message },
      { status: 500 }
    );
  }
}

// Delete deck
export async function DELETE(request, { params }) {
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

    const deckRef = ref(database, `users/${userId}/decks/${deckId}`);

    // Check if deck exists
    const snapshot = await get(deckRef);
    if (!snapshot.exists()) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }

    // Delete the deck
    await remove(deckRef);

    return NextResponse.json({
      message: "Deck deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting deck:", error);
    return NextResponse.json(
      { error: "Failed to delete deck", details: error.message },
      { status: 500 }
    );
  }
}
