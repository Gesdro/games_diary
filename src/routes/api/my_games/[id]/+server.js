import { ObjectId } from 'mongodb';
import { connectToDatabase } from '$lib/db.js';
import { json } from '@sveltejs/kit';

// Diese Funktion lädt ein einzelnes Spiel aus der Datenbank, die dann gelöscht wird
export async function DELETE({ params }) {
  const { id } = params;

  try {
    const { db } = await connectToDatabase();

    // Überprüfen, ob die ID gültig ist, und öffnet die lösch Operation aus der Collection 'my_games'
    const result = await db.collection('my_games').deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return new Response('Spiel nicht gefunden', { status: 404 });   // Wenn kein Spiel mit der angegebenen ID gefunden wurde, wird eine Fehlermeldung zurückgegeben
    }

    return json({ success: true });
  } catch (err) {
    console.error('Fehler beim Löschen:', err);
    return new Response('Serverfehler beim Löschen', { status: 500 }); // Wenn ein Fehler auftritt, wird eine Fehlermeldung zurückgegeben
  }
}