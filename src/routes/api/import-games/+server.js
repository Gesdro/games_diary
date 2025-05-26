import { json } from '@sveltejs/kit';
import { connectToDatabase } from '$lib/db';
import { RAWG_API_KEY } from "$env/static/private";

export async function GET() {
	const allGames = [];
	const maxPages = 10;
	const pageSize = 20;
	let imported = 0;

	// Hole die Anzahl der Spiele, um die maximale Seitenanzahl zu berechnen
	for (let page = 1; page <= maxPages; page++) {
		const listUrl = `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&page=${page}&page_size=${pageSize}`; // API-URL für die Spieleliste
		const res = await fetch(listUrl); 

		if (!res.ok) {
			console.error(`Fehler bei Seite ${page}:`, res.statusText); // wenn import nicht erfolgreich ist, wird eine Fehlermeldung ausgegeben
			continue;
		}

		const data = await res.json();
		if (!data.results || !Array.isArray(data.results)) {
			console.warn(`Seite ${page} enthielt keine Ergebnisse.`);
			continue;
		}

		// Für jedes Spiel Detaildaten holen
		const gamesOnPage = await Promise.all(
			data.results.map(async (g) => {
				// Detaildaten abfragen
				const detailUrl = `https://api.rawg.io/api/games/${g.id}?key=${RAWG_API_KEY}`;
				const detailRes = await fetch(detailUrl);

				// Fehlerhandling: Wenn ein Detail-Fetch fehlschlägt, Spiel überspringen
				if (!detailRes.ok) {
					console.warn(`Fehler beim Detail-Request für Spiel-ID ${g.id}:`, detailRes.statusText);
					return null;
				}

				const gameDetail = await detailRes.json();

				// Mapping auf das Schema, das in der Datenbank gespeichert werden soll
				// Einezelne Post der API, wie sollen die Daten in der DB gespeichert werden
				return {
					title: gameDetail.name,
					description: gameDetail.description_raw || 'Keine Beschreibung verfügbar.',
					releaseDate: gameDetail.released,
					backgroundImage: gameDetail.background_image ?? '/images/placeholder.jpg',
					rating: gameDetail.rating,
					platforms: gameDetail.platforms?.map((p) => p.platform.name) ?? [],
					genres: gameDetail.genres?.map((genre) => genre.name) ?? [],
					website: gameDetail.website ?? '',
					metacritic: gameDetail.metacritic ?? null,
					createdAt: new Date()
				};
			})
		);

		// Nur erfolgreich geholte Spiele (ohne null) übernehmen
		const validGames = gamesOnPage.filter(Boolean);
		allGames.push(...validGames);
		imported += validGames.length; // Anzahl der importierten Spiele erhöhen
		console.log(`Seite ${page}: ${validGames.length} Spiele importiert`); // Anzahl der importierten Spiele pro Seite ausgeben
		// Erfolrecihe Rückmeldung
	}

	if (allGames.length === 0) {
		return json({ status: 'error', message: 'Keine Spiele zum Einfügen!' }, { status: 400 }); // Error-Response, wenn keine Spiele importiert wurden
	}

	const { db } = await connectToDatabase();
	const result = await db.collection('games').insertMany(allGames);

	return json({ status: 'ok', inserted: result.insertedCount });
}