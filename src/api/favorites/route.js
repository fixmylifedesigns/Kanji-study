// src/app/api/favorites/route.js
import { database } from "@/lib/firebase";
import { ref, set, get, remove } from "firebase/database";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId, kanji } = await request.json();

    if (!userId || !kanji) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a sanitized key from the kanji character
    const kanjiKey = encodeURIComponent(kanji.kanji);
    const favoriteRef = ref(database, `users/${userId}/favorites/${kanjiKey}`);

    try {
      // Check if already favorited
      const snapshot = await get(favoriteRef);

      if (snapshot.exists()) {
        // If it exists, remove it (toggle behavior)
        await remove(favoriteRef);
        return NextResponse.json({
          message: "Favorite removed successfully",
          isFavorited: false,
        });
      }

      // Add new favorite
      const favoriteData = {
        character: kanji.kanji,
        reading: kanji.reading || "",
        meanings: Array.isArray(kanji.meanings)
          ? kanji.meanings
          : [kanji.meaning],
        dateAdded: Date.now(),
        slug: kanjiKey,
      };

      await set(favoriteRef, favoriteData);

      return NextResponse.json({
        message: "Favorite added successfully",
        isFavorited: true,
        favorite: favoriteData,
      });
    } catch (dbError) {
      console.error("Database operation failed:", dbError);
      throw new Error("Failed to perform database operation");
    }
  } catch (error) {
    console.error("Error managing favorite:", error);
    return NextResponse.json(
      { error: "Failed to manage favorite", details: error.message },
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

    const favoritesRef = ref(database, `users/${userId}/favorites`);

    try {
      const snapshot = await get(favoritesRef);

      if (!snapshot.exists()) {
        return NextResponse.json({ favorites: [] });
      }

      // Convert the snapshot to an array
      const favorites = [];
      snapshot.forEach((childSnapshot) => {
        favorites.push({
          ...childSnapshot.val(),
          id: childSnapshot.key,
        });
      });

      // Sort by dateAdded in descending order
      favorites.sort((a, b) => b.dateAdded - a.dateAdded);

      return NextResponse.json({ favorites });
    } catch (dbError) {
      console.error("Database fetch failed:", dbError);
      throw new Error("Failed to fetch from database");
    }
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      { error: "Failed to fetch favorites", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const kanjiChar = searchParams.get("kanji");

    if (!userId || !kanjiChar) {
      return NextResponse.json(
        { error: "User ID and kanji are required" },
        { status: 400 }
      );
    }

    // Create a sanitized key from the kanji character
    const kanjiKey = encodeURIComponent(kanjiChar);
    const favoriteRef = ref(database, `users/${userId}/favorites/${kanjiKey}`);

    // Check if favorite exists
    const snapshot = await get(favoriteRef);
    if (!snapshot.exists()) {
      return NextResponse.json(
        { error: "Favorite not found" },
        { status: 404 }
      );
    }

    // Remove the favorite
    await remove(favoriteRef);

    return NextResponse.json({
      message: "Favorite removed successfully",
    });
  } catch (error) {
    console.error("Error removing favorite:", error);
    return NextResponse.json(
      { error: "Failed to remove favorite", details: error.message },
      { status: 500 }
    );
  }
}
