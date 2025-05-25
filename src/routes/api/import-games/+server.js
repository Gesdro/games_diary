// src/routes/api/import-games/+server.js
import { json } from '@sveltejs/kit';
import { connectToDatabase } from '$lib/db';

// import games von der API, diese werden dann direkt in der Datenbank gespeichert. Somit hat man ein paar Ideen, um etwas in seiner Bibliothek zu haben

const API_KEY = process.env.RAWG_API_KEY; // Stelle sicher, dass der API key in der env Datei drinn ist

export async function POST({ request }) { 
	try {
		const { id } = await request.json();
		await addToMyGames(id); 
		return new Response('Hinzugefügt', { status: 200 });
	} catch (err) {
		return new Response(err.message, { status: 400 });
	}
}

export async function GET() {
	const res = await fetch(`https://api.rawg.io/api/games?key=${API_KEY}&page_size=5`); // Hole die ersten 5 Spiele von der API


	const allGames = []; // Array, in dem die Speiele gespeichert weren

	// z.B. die ersten 5 Seiten mit je 20 Spielen holen
	for (let page = 1; page <= 10; page++) {
		const res = await fetch(`https://api.rawg.io/api/games?key=${API_KEY}&page=${page}&page_size=20`);
		if (!res.ok) {
			console.error(`Fehler bei Seite ${page}:`, res.statusText);
			continue;
		}



		const data = await res.json(); 
		if (!data.results || !Array.isArray(data.results)) {
			console.warn(`Seite ${page} enthielt keine Ergebnisse.`);
			continue; // Troubleshooting
		}

		const games = data.results.map((g) => ({ 
			title: g.name,
			releaseDate: g.released,
			rating: g.rating,
			tags: g.genres?.map((genre) => genre.name) ?? [],
			platform: g.platforms?.map((p) => p.platform.name).join(', ') ?? 'Unknown',
			backgroundImage: g.background_image ?? '/images/placeholder.jpg', 
			createdAt: new Date()
		})); // Speichert die SPiele in einem Array, damit sie in die Datenbank passen

		allGames.push(...games); // Fügt die Spiele der Liste hinzu
	}

	const { db } = await connectToDatabase();
	const result = await db.collection('games').insertMany(allGames);

	return json({ status: 'ok', inserted: result.insertedCount });
}