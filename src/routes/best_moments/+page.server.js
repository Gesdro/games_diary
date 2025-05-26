import { error } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';

const MOMENTS_PATH = 'static/uploads/moments'; // Speicherort für hochgeladene Momente

// Speichert die Bilder im JSON-Format in der Datei moments.json
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
// Diese Funktion lädt die Momente aus der JSON-Datei und gibt sie zurück
export const actions = {
  upload: async ({ request }) => {
    const data = await request.formData();
    const title = data.get('title')?.trim();
    const description = data.get('description')?.trim();
    const file = data.get('image');

    if (!title || !description || !file || !file.name.endsWith('.jpg')) {
      return { error: 'Please add all the data and choose a picture' };
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