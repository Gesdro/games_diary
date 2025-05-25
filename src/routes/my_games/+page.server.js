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