// src/components/search/DeckManagementModal.js

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useKanji } from "@/context/KanjiContext"; // Add this import
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DeckManagementModal({ kanji, isOpen, onClose }) {
  const [decks, setDecks] = useState([]);
  const [newDeckName, setNewDeckName] = useState("");
  const [isCreatingDeck, setIsCreatingDeck] = useState(false);
  const [selectedDecks, setSelectedDecks] = useState(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const { favorites, addToFavorites } = useKanji(); // Add this

  // Reset selected decks when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedDecks(new Set());
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (user && isOpen) {
      fetchUserDecks();
    }
  }, [user, isOpen]);

  const fetchUserDecks = async () => {
    try {
      const response = await fetch(`/api/decks?userId=${user.uid}`);
      const data = await response.json();
      setDecks(data.decks || []);
    } catch (error) {
      console.error("Error fetching decks:", error);
    }
  };

  const handleCreateDeck = async () => {
    if (!newDeckName.trim()) return;

    setIsSaving(true);
    try {
      const response = await fetch("/api/decks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          name: newDeckName,
          createdAt: new Date().toISOString(),
        }),
      });

      const data = await response.json();
      setDecks([...decks, data.deck]);
      setNewDeckName("");
      setIsCreatingDeck(false);
    } catch (error) {
      console.error("Error creating deck:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Add to favorites if selected
      if (selectedDecks.has("favorites")) {
        const favoriteResponse = await fetch("/api/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.uid,
            kanji: {
              kanji: kanji.kanji,
              reading: kanji.reading,
              meanings: kanji.meanings,
              slug: kanji.slug,
            },
          }),
        });

        if (!favoriteResponse.ok) {
          throw new Error("Failed to add to favorites");
        }

        const favoriteData = await favoriteResponse.json();
        if (favoriteData.isFavorited && addToFavorites) {
          addToFavorites(kanji);
        }
      }

      // Add to selected decks
      const deckPromises = Array.from(selectedDecks)
        .filter((deckId) => deckId !== "favorites")
        .map((deckId) =>
          fetch(`/api/decks/${deckId}/kanji`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: user.uid,
              kanji: {
                kanji: kanji.kanji,
                reading: kanji.reading,
                meanings: kanji.meanings,
                slug: kanji.slug,
              },
            }),
          })
        );

      await Promise.all(deckPromises);

      // Close modal and reset state
      onClose();
      setSelectedDecks(new Set());
    } catch (error) {
      console.error("Error saving kanji:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  // Check if kanji is already in favorites
  const isAlreadyFavorited = favorites?.some(
    (f) => f.character === kanji?.kanji
  );

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none mt-0">
        <div className="pointer-events-auto max-h-[90vh] w-full max-w-md">
          <Card className="w-full shadow-xl">
            <CardHeader className="border-b bg-white sticky top-0 z-10">
              <CardTitle>Save Kanji: {kanji?.kanji}</CardTitle>
            </CardHeader>
            <CardContent className="overflow-y-auto max-h-[calc(90vh-10rem)] p-4 bg-white">
              <div className="space-y-4">
                {/* Favorites Option */}
                <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="favorites"
                    checked={selectedDecks.has("favorites")}
                    disabled={isAlreadyFavorited}
                    onChange={(e) => {
                      const newSelected = new Set(selectedDecks);
                      if (e.target.checked) {
                        newSelected.add("favorites");
                      } else {
                        newSelected.delete("favorites");
                      }
                      setSelectedDecks(newSelected);
                    }}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 
                             disabled:opacity-50"
                  />
                  <label
                    htmlFor="favorites"
                    className={`text-sm font-medium cursor-pointer flex-1 
                              ${isAlreadyFavorited ? "text-gray-400" : ""}`}
                  >
                    {isAlreadyFavorited
                      ? "Already in Favorites"
                      : "Add to Favorites"}
                  </label>
                </div>

                {/* Existing Decks */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700">
                    Select Decks
                  </h3>
                  <div className="space-y-1">
                    {decks.map((deck) => (
                      <div
                        key={deck.id}
                        className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg"
                      >
                        <input
                          type="checkbox"
                          id={deck.id}
                          checked={selectedDecks.has(deck.id)}
                          onChange={(e) => {
                            const newSelected = new Set(selectedDecks);
                            if (e.target.checked) {
                              newSelected.add(deck.id);
                            } else {
                              newSelected.delete(deck.id);
                            }
                            setSelectedDecks(newSelected);
                          }}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <label
                          htmlFor={deck.id}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {deck.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Create New Deck */}
                {isCreatingDeck ? (
                  <div className="space-y-2 p-2 bg-gray-50 rounded-lg">
                    <input
                      type="text"
                      value={newDeckName}
                      onChange={(e) => setNewDeckName(e.target.value)}
                      placeholder="Enter deck name"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleCreateDeck}
                        disabled={isSaving || !newDeckName.trim()}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg 
                                 hover:bg-blue-600 disabled:opacity-50"
                      >
                        Create
                      </button>
                      <button
                        onClick={() => setIsCreatingDeck(false)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg 
                                 hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsCreatingDeck(true)}
                    className="text-blue-500 hover:text-blue-600 text-sm w-full text-left px-2 py-1 hover:bg-gray-50 rounded"
                  >
                    + Create New Deck
                  </button>
                )}
              </div>
            </CardContent>

            {/* Footer - Always visible at bottom */}
            <div className="border-t p-4 bg-white sticky bottom-0 z-10">
              <div className="flex justify-end space-x-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg 
                           hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving || selectedDecks.size === 0}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg 
                           hover:bg-blue-600 disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
