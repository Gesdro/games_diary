import { MongoClient, ObjectId } from "mongodb"; // See https://www.mongodb.com/docs/drivers/node/current/quick-start/
import { DB_URI } from "$env/static/private"; // Datenbankanbindung aus der .env-Datei
import { RAWG_API_KEY } from "$env/static/private";

const client = new MongoClient(DB_URI);
await client.connect();
const db = client.db("GamesDiary"); // Sucher der Datenbank

//////////////////////////////////////////
// Games
//////////////////////////////////////////


// Verbindung zur Datenbank
export async function connectToDatabase() {
  if (!client.topology?.isConnected?.()) await client.connect();
  return { db, client };
}



// Alle Games der Hauptseite werden abgerufen
async function getGames() {
  let games = [];
  try {
    const collection = db.collection("games");

    // You can specify a query/filter here
    // See https://www.mongodb.com/docs/drivers/node/current/fundamentals/crud/query-document/
    const query = {};

    // Get all objects that match the query
    games = await collection.find(query).toArray();
    games.forEach((game) => {
      game._id = game._id.toString(); // convert ObjectId to String
    });

  } catch (error) {
    console.log(error);
    // TODO: errorhandling
  }
  return games;
}

// Gamessuche nach der ID => Detailansicht eines einzelnen Games
async function getGame(id) {
  let games = null;
  try {
    const collection = db.collection("games");
    const query = { _id: new ObjectId(id) }; // filter by id
    games = await collection.findOne(query);

    if (!games) {
      console.log("No game with id " + id);
      // TODO: errorhandling
    } else {
      games._id = games._id.toString(); // convert ObjectId to String
    }
  } catch (error) {
    // TODO: errorhandling
    console.error("DB Fehler in getGame:", error);

  }
  return games;
}

// Games erstellen
// Diese Funktion erstellt ein Spiel in der Datenbank, jedoch werden die Daten nur über die API abgerufen.

async function createGameByName(name) {
  const apiKey = RAWG_API_KEY; // API-Schlüssel für die RAWG API
  try {
    // Spiel über die API suchen
    const res = await fetch(`https://api.rawg.io/api/games?search=${encodeURIComponent(name)}&key=${apiKey}`);
    const data = await res.json(); // Antowrt wird als JSON eingehen und als Java Object gespeichert
    // ergebniss wird in data gespecihert
    if (!data.results || data.results.length === 0) {
      console.warn('Kein Spiel gefunden mit dem Namen:', name); // keine Spiele gefunden
      return null;
    }
    const game = data.results[0];

    const detailRes = await fetch(`https://api.rawg.io/api/games/${game.id}?key=${apiKey}`);
    console.log('Detail Res:', detailRes);
    const detail = await detailRes.json();

    const apiGame = data.results[0]; // Erster Treffer wird in ein Array gespeichert

    // Mapping auf dein Schema
    // Hier wird das Spiel in das Format gebracht, das in der Datenbank gespeichert werden soll
    const newGame = {
      title: detail.name,
      description: detail.description_raw || detail.description || 'Keine Beschreibung verfügbar.',
      releaseDate: detail.released,
      backgroundImage: detail.background_image ?? '/images/placeholder.jpg',
      rating: detail.rating,
      platforms: detail.platforms?.map((p) => p.platform.name) ?? [],
      genres: detail.genres?.map((genre) => genre.name) ?? [],
      website: detail.website ?? '',
      metacritic: detail.metacritic ?? null,
      createdAt: new Date()
    };


    const { db } = await connectToDatabase(); // Verbindung zur Datenbank herstellen
    const result = await db.collection('games').insertOne(newGame); // Spiel in der MongoDB-Datenbank speichern
    return result.insertedId.toString(); // kompatibel mit MongoDB, gibt die ID des neu erstellten Spiels zurück
  } catch (error) {
    console.error('Fehler beim Erstellen des Spiels:', error.message);
    return null;
  }
}





// Game löschen, im Informationsfeld
// Löschung wird über die ID des Spiels durchgeführt
async function deleteGame(id) {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection("games"); // Collection "games" auswählen

    const query = { _id: new ObjectId(id) };
    const result = await collection.deleteOne(query); // Spiel mit der angegebenen ID löschen

    if (result.deletedCount === 0) { // Wenn kein Spiel gelöscht wurde, wird eine Nachricht ausgegeben
      console.log("Kein Spiel mit der ID " + id + " gefunden.");
    } else {
      console.log("Spiel mit der ID " + id + " wurde erfolgreich gelöscht.");
      return id;
    }
  } catch (error) {
    console.error("Fehler beim Löschen des Spiels:", error.message); // Fehlermeldung in der konsole
  }
  return null;
}

// Games werden zur meinen eigenen Spielliste hinzugefügt, Informaionen werden direkt von der Datenbank übernommen
// Daten werden in der Collection games gesucht und in der Collection my_games gespeichert

export async function addToMyGames(gameId) {
  const { db } = await connectToDatabase();

  const games = db.collection('games');
  const myGames = db.collection('my_games');

  const gameObjectId = new ObjectId(gameId);

  const game = await games.findOne({ _id: gameObjectId });
  if (!game) throw new Error('Spiel nicht gefunden');

  const exists = await myGames.findOne({ gameId: gameObjectId });
  if (exists) throw new Error('Spiel bereits vorhanden');

  // Spiel in der my_games Collection hinzufügen

  await myGames.insertOne({
    gameId: gameObjectId,
    progress: '',
    reviews: [], // leeres Array für Reviews, ich kann später noch Reviews hinzufügen
    addedAt: new Date()
  });

  return true;
}

//Gleiche Funktion wie bei Games, jedoch werden die Spiele aus der Collection my_games geladen

async function loadMyGames() {
  const { db } = await connectToDatabase();

  // Hier wird nun eine MongoDB Aggregation verwendet
  const myGames = await db.collection('my_games').aggregate([ // myGames wird die Collection sein, in der die Spiele gespeichert sind
    {
      $lookup: { // Joins-Operation zwischen den beiden Collections
        from: 'games',
        localField: 'gameId',
        foreignField: '_id',
        as: 'game'
      }
    },
    {
      $unwind: { // Array "game" auflösen, damit wir die Daten direkt verwenden können
        path: '$game',
        preserveNullAndEmptyArrays: false // wir WOLLEN, dass es fehlschlägt, wenn kein Match da ist
      }
    }
  ]).toArray(); // Neues Array erstellen


  // Funktioniert die Aggregation? Ausgabe in der Konsole
  console.log(" Result:", myGames);

  return myGames.map(entry => ({ // Daten werden neu gemappt, damit ich sie in der App verwenden kann (myGameCard.svelte)
    _id: entry._id.toString(),
    gameId: entry.gameId.toString(),
    title: entry.game.title,
    description: entry.game.description,
    backgroundImage: entry.game.backgroundImage ?? '/images/placeholder.jpg', // wird von der API gegeben
    platform: entry.game.platform ?? 'Unbekannt',
    rating: entry.game.rating ?? 'Keine Bewertung',
    releaseDate: entry.game.releaseDate ?? 'Unbekannt',
    reviews: entry.reviews
  }));
}




//NEUE FUNKTIONEN 
////////////////////////////
async function addReviewToGame(gameId, review) {
  const { db } = await connectToDatabase();
  return db.collection('my_games').updateOne(
    { _id: new ObjectId(gameId) },
    { $push: { reviews: review } }
  );
}
async function deleteReviewFromGame(gameId, review) {
  const { db } = await connectToDatabase();
  return db.collection('my_games').updateOne(
    { _id: new ObjectId(gameId) },
    { $pull: { reviews: review } }
  );
}
async function deleteMyGame(gameId) {
  const { db } = await connectToDatabase();
  return db.collection('my_games').deleteOne({ _id: new ObjectId(gameId) });
}
async function getAllGames() {
  const { db } = await connectToDatabase();
  return db.collection('my_games').find().toArray();
}



async function addGame(gameData) {
  const { db } = await connectToDatabase();
  const result = await db.collection('my_games').insertOne(gameData);
  return result.insertedId.toString();
}





// export all functions so that they can be used in other files
export default {
  getGames,
  getGame,
  deleteGame,
  addToMyGames,
  createGameByName,
  loadMyGames,
  addReviewToGame,
  deleteReviewFromGame,
  deleteMyGame,
  getAllGames,
  addGame
};
