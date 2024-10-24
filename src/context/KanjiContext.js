// src/context/KanjiContext.js
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const KanjiContext = createContext({});

export function KanjiProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Fetch favorites when user changes
  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
    setIsLoading(false);
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const response = await fetch(`/api/favorites?userId=${user.uid}`);
      const data = await response.json();
      if (response.ok) {
        setFavorites(data.favorites);
      } else {
        console.error("Error fetching favorites:", data.error);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const addToFavorites = async (kanji) => {
    if (!user) return;

    try {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          kanji,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.isFavorited) {
          setFavorites((prev) => [
            ...prev,
            { ...kanji, dateAdded: Date.now() },
          ]);
        } else {
          // If it was unfavorited (toggled off)
          setFavorites((prev) => prev.filter((f) => f.slug !== kanji.slug));
        }
        return data.isFavorited;
      } else {
        console.error("Error managing favorite:", data.error);
        return false;
      }
    } catch (error) {
      console.error("Error managing favorite:", error);
      return false;
    }
  };

  const removeFromFavorites = async (kanji) => {
    if (!user) return;

    try {
      const response = await fetch(
        `/api/favorites?userId=${user.uid}&slug=${kanji.slug}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setFavorites((prev) => prev.filter((f) => f.slug !== kanji.slug));
        return true;
      } else {
        const data = await response.json();
        console.error("Error removing favorite:", data.error);
        return false;
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
      return false;
    }
  };

  const value = {
    favorites,
    isLoading,
    addToFavorites,
    removeFromFavorites,
  };

  return (
    <KanjiContext.Provider value={value}>{children}</KanjiContext.Provider>
  );
}

export const useKanji = () => {
  const context = useContext(KanjiContext);
  if (context === undefined) {
    throw new Error("useKanji must be used within a KanjiProvider");
  }
  return context;
};
