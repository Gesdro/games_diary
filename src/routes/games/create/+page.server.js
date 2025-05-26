import db from '$lib/db.js';

export const actions = {
  create: async ({ request }) => {
    const data = await request.formData();
    const name = data.get('name');

    if (!name?.trim()) {
      return { error: 'Bitte gib einen Namen ein.' };
    }

    const id = await db.createGameByName(name);

    if (!id) {
      return { error: 'Kein Spiel gefunden oder Fehler beim Erstellen.' };
    }

    return { success: true, id };
  }
};