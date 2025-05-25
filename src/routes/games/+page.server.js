import db from "$lib/db.js";

// Diese Funktion lädt alle Spiele aus der Datenbank
export async function load() {
  return {
    games: await db.getGames()
  };
}