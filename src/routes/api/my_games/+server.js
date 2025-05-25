import { addToMyGames } from '$lib/db'; // oder da, wo du die Funktion gespeichert hast

export async function POST({ request }) {
  const { gameId } = await request.json();

  // addToMyGames erwartet eine gameId, die ein String ist
  try {
    await addToMyGames(gameId);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(err.message, { status: 400 });
  }
}