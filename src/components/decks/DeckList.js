// src/components/decks/DeckList.js
"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function DeckList() {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newDeckName, setNewDeckName] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchDecks();
    }
  }, [user]);

  const fetchDecks = async () => {
    try {
      const response = await fetch(`/api/decks?userId=${user.uid}`);
      const data = await response.json();

      if (response.ok) {
        setDecks(data.decks);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Error fetching decks:", error);
      setError("Failed to load decks");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDeck = async (e) => {
    e.preventDefault();
    if (!newDeckName.trim()) return;

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

      if (response.ok) {
        setDecks([...decks, data.deck]);
        setNewDeckName("");
        setIsCreating(false);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Error creating deck:", error);
      setError("Failed to create deck");
    }
  };

  const handleDeleteDeck = async (deckId) => {
    if (!confirm("Are you sure you want to delete this deck?")) return;

    try {
      const response = await fetch(`/api/decks/${deckId}?userId=${user.uid}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDecks(decks.filter((deck) => deck.id !== deckId));
      } else {
        const data = await response.json();
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Error deleting deck:", error);
      setError("Failed to delete deck");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <h2 className="text-2xl font-bold">Your Study Decks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Study Decks</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg 
                   hover:bg-blue-600 transition-colors"
        >
          <Plus size={20} />
          New Deck
        </button>
      </div>

      {error && (
        <div className="p-4 text-red-700 bg-red-100 rounded-lg">{error}</div>
      )}

      {isCreating && (
        <form onSubmit={handleCreateDeck} className="space-y-4">
          <input
            type="text"
            value={newDeckName}
            onChange={(e) => setNewDeckName(e.target.value)}
            placeholder="Enter deck name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!newDeckName.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg 
                       hover:bg-blue-600 disabled:opacity-50"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setNewDeckName("");
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg 
                       hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {decks.map((deck) => (
          <Card key={deck.id} className="relative group">
            <CardContent className="p-4">
              <div
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 
                            transition-opacity flex gap-2"
              >
                <button
                  onClick={() => handleDeleteDeck(deck.id)}
                  className="p-1 text-red-500 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <h3 className="font-bold text-lg mb-2">{deck.name}</h3>
              <p className="text-sm text-gray-600">
                {deck.kanjiCount || 0} cards
              </p>
              {deck.lastStudied && (
                <p className="text-sm text-gray-600">
                  Last studied: {format(new Date(deck.lastStudied), "PP")}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Created: {format(new Date(deck.createdAt), "PP")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
