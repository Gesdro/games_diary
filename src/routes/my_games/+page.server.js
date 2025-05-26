import db from "$lib/db.js";


// alle games werden geladen, die der User in seiner Bibliothek hat
export async function load() {
  try {
    const games = await db.loadMyGames();
    return { games };
  } catch (err) {
    console.error("Fehler in loadMyGames():", err);
    throw error(500, "Fehler beim Laden deiner Spiele.");
  }
}

// Import AddReview von der DB.js
export const actions = {
  addReview: async ({ request }) => {
    const data = await request.formData();
    const gameId = data.get('gameId'); // Hier wird die gameId aus dem Formular geholt
    const review = data.get('review'); // Review wird aus dem Formular geholt
    if (!review?.trim()) return { error: 'Review darf nicht leer sein.' };
    await db.addReviewToGame(gameId, review);
    return { success: true };
  },
  deleteReview: async ({ request }) => {
    const data = await request.formData(); // Delete-Review-Formular von der DB.js
    const gameId = data.get('gameId');
    const review = data.get('review');
    await db.deleteReviewFromGame(gameId, review);
    return { success: true };
  },
  deleteMyGame: async ({ request }) => {
    const data = await request.formData(); // Delte my-Game Formular, importtiert von der DB.js
    const gameId = data.get('gameId');
    await db.deleteMyGame(gameId);
    return { success: true };
  }
};