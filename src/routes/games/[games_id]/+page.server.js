import db from "$lib/db.js";
import { redirect } from "@sveltejs/kit";

// Diese Funktion lädt ein einzelnes Spiel aus der Datenbank
export async function load({ params }) {
  return {
    game: await db.getGame(params.games_id),
  };
}

// Diese Funktion löscht ein Spiel aus der Datenbank
// und leitet den Nutzer zurück zur Spieleliste
export const actions = {
  delete: async ({ request }) => {
    const data = await request.formData();

    await db.deleteGame(data.get("id"));
    throw redirect(303, "/games");
  },


  addToMyGames: async ({ request }) => {
    const data = await request.formData();
    const gameId = data.get('gameId');
    try {
      await db.addToMyGames(gameId);
      return { success: true };
    } catch (err) {
      return { error: err.message || 'Unbekannter Fehler beim Hinzufügen.' };
    }
  }
};