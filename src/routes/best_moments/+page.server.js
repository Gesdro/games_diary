import { error } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';

const MOMENTS_PATH = 'static/uploads/moments'; // Stelle sicher, dass es diesen Ordner gibt!

// Dummy-Loader: Listet alle hochgeladenen Momente (mit Bild)
export async function load() {
  let moments = [];
  try {
    const file = await fs.readFile('moments.json', 'utf8');
    moments = JSON.parse(file);
  } catch {
    // Datei existiert evtl. noch nicht
  }
  return { moments };
}

export const actions = {
  upload: async ({ request }) => {
    const data = await request.formData();
    const title = data.get('title')?.trim();
    const description = data.get('description')?.trim();
    const file = data.get('image');

    if (!title || !description || !file || !file.name.endsWith('.jpg')) {
      return { error: 'Bitte fülle alles aus und lade ein JPG hoch.' };
    }

    // Bild speichern
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}_${file.name}`;
    const uploadPath = path.join(MOMENTS_PATH, fileName);

    // Erstelle Ordner, falls nicht vorhanden
    await fs.mkdir(MOMENTS_PATH, { recursive: true });
    await fs.writeFile(uploadPath, buffer);

    // Moment speichern (als JSON-Array in moments.json)
    let moments = [];
    try {
      moments = JSON.parse(await fs.readFile('moments.json', 'utf8'));
    } catch {}
    const moment = {
      title,
      description,
      image: `/uploads/moments/${fileName}`
    };
    moments.unshift(moment); // neuestes zuerst
    await fs.writeFile('moments.json', JSON.stringify(moments, null, 2));

    return { success: true };
  }
};