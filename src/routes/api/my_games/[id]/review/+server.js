import { ObjectId } from 'mongodb';
import { connectToDatabase } from '$lib/db.js';
import { json } from '@sveltejs/kit';

// Diese Funktion lädt ein einzelnes Spiel aus der Datenbank
export async function POST({ params, request }) {
  const { id } = params; // Die ID des Spiels wird aus den URL-Parametern geholt
  const { review } = await request.json(); // Die Review wird aus dem Request-Body geholt

  if (!review || !review.trim()) { // Überprüfen, ob die Review leer ist, trim entfernt Leerzeichen
    return new Response('Review darf nicht leer sein.', { status: 400 }); // Überprüfen, ob die Review leer ist
  }

  try {
    const { db } = await connectToDatabase(); // Verbindung zur Datenbank herstellen, um das Review in der COllection 'my_games' zu speichern

    const result = await db.collection('my_games').updateOne(
      { _id: new ObjectId(id) },
      { $push: { reviews: review } } 
    );

    if (result.modifiedCount === 0) {
      return new Response('Kein Spiel gefunden.', { status: 404 }); // Wenn kein Spiel mit der angegebenen ID gefunden wurde, wird eine Fehlermeldung zurückgegeben
    }

    return json({ success: true }); // Wenn das Review erfolgreich gespeichert wurde, wird eine Erfolgsmeldung zurückgegeben
  } catch (err) {
    console.error('Review speichern fehlgeschlagen:', err); // Troubleshooting
    return new Response('Fehler beim Speichern des Reviews.', { status: 500 });
  }
}