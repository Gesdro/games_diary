import { RAWG_API_KEY } from "$env/static/private"; // Importiere den RAWG API-Schlüssel aus den Umgebungsvariablen (env)
import { connectToDatabase } from "$lib/db.js"; // Importiere die Funktion zum Verbinden mit der Datenbank
 
export async function POST({ request }) { 
  const { name } = await request.json();
  const apiKey = RAWG_API_KEY; // Stelle sicher, dass der API-Schlüssel gesetzt ist

  const searchUrl = `https://api.rawg.io/api/games?search=${encodeURIComponent(name)}&key=${apiKey}`; // URL für die Suche nach dem Spiel => Api key ird automatisch angehängt

  try {
    const res = await fetch(searchUrl);   // Führe die Suche nach dem Spiel durch
    const data = await res.json();  // Konvertiere die Antwort in JSON

    if (!res.ok) { // Überprüfe, ob die Antwort erfolgreich war
      console.log('[RAWG API-Fehler]', data); // Logge den Fehler, wenn die Antwort nicht erfolgreich war
      return new Response(`RAWG API-Fehler: ${data.detail || JSON.stringify(data)}`, { status: res.status }); // Gebe eine Fehlermeldung zurück, wenn die API nicht erfolgreich war (Troubleshooting, daes ewig nicht funktionert hatte)
    }

    if (!data.results || data.results.length === 0) { // Überprüfe, ob Ergebnisse zurückgegeben wurden
      return new Response('Kein Spiel gefunden.', { status: 404 }); // Gebe eine 404-Fehlermeldung zurück, wenn kein Spiel gefunden wurde
    }

    const gameAPI = data.results[0]; // Speciehrt das erste Spiel in ein Array

    // Detaildaten laden
    const detailUrl = `https://api.rawg.io/api/games/${gameAPI.id}?key=${apiKey}`;
    const detailRes = await fetch(detailUrl);
    const gameDetail = await detailRes.json();

    const game = {
      title: gameDetail.name,
      description: gameDetail.description_raw || 'Keine Beschreibung verfügbar.',
      releaseDate: gameDetail.released,
      backgroundImage: gameDetail.background_image || '/images/placeholder.jpg',
      rating: gameDetail.rating,
      platforms: gameDetail.platforms?.map(p => p.platform.name) ?? [],
      genres: gameDetail.genres?.map(g => g.name) ?? [],
      website: gameDetail.website,
      metacritic: gameDetail.metacritic,
      createdAt: new Date()
    }; // API Dateien werden nun in ein Objekt gespeichert, die nun in die Datenbank gespeichert werden kann.

    const { db } = await connectToDatabase();
    const result = await db.collection('games').insertOne(game); // Speichere das Spiel in der Datenbank games

    return new Response(JSON.stringify({ id: result.insertedId.toString() }), { // Gebe die ID des neu erstellten Spiels zurück
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response('Fehler: ' + err.message, { status: 500 });   // Gebe eine Fehlermeldung zurück, wenn ein Fehler auftritt
  }
}