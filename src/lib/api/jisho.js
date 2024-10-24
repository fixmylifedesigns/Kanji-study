// src/lib/api/jisho.js

/**
 * Search for kanji and words using the Jisho API
 * Uses the format: https://jisho.org/api/v1/search/words/?keyword=
 *
 * @param {string} query - The search query (kanji, word, or reading)
 * @returns {Promise<Object>} The search results from Jisho
 * @throws {Error} If the API request fails
 */
export async function searchKanji(query) {
  if (!query) return null;

  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to fetch from API");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error searching Jisho:", error);
    throw error;
  }
}

/**
 * Get detailed information about a specific kanji
 * Note: This is for future implementation when we add detailed kanji views
 *
 * @param {string} kanji - Single kanji character to look up
 * @returns {Promise<Object>} Detailed kanji information
 */
export async function getKanjiDetails(kanji) {
  if (!kanji) return null;

  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(kanji)}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch kanji details");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching kanji details:", error);
    throw error;
  }
}
