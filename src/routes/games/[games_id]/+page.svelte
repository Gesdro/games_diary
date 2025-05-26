<script>
  let { data } = $props();
  let game = data.game;
  let message = $state('');

    async function addToMyGames() { // Funktion zum Hinzufügen des Spiels zu den eigenen Spielen
    const res = await fetch('/api/my_games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId: game._id })
    });

    if (res.ok) {
      message = 'Game saved!'; // Erfolgreiches Hinzufügen des Spiels
    } else {
      const text = await res.text();
      message = 'Error: ' + text;
    }
  }
  console.log('Game:', game);

</script>

<!-- Back Button -->

<div>
<a href="/games" class="btn btn-primary">← Back to overview</a> <!-- Button zum Zurückkehren zur Übersicht der Spiele -->
</div>


<div class ="headercontainer">
<h1>{game.title}</h1>
<div class="row mt-3">
  <div class="col-3">
    <img class="img-fluid" src={game.backgroundImage ?? '/images/placeholder.jpg'} alt="" /> <!-- Bidl wird direkt von der API gefetched-->
  </div>

  <div class="col-3"> <!--Wichtige Daten zu den Spielen wird gezeigt-->
    <p><b>Release:</b> {game.releaseDate}</p>
    <p><b>Plaform:</b> {game.platforms}</p>
    <p><b>Rating:</b> {game.rating}</p>
    <p><b>Genre:</b></p>
    <ul>
      {#each game.genres as genre}
        <li>{genre}</li>
      {/each}
    </ul>

  


<button onclick={addToMyGames}>Add to my Games</button>  <!-- Button zum Hinzufügen des Spiels zu den eigenen Spielen -->
<p>{message}</p>

<h1>{game.name}</h1>
<p>{game.description}</p>

  <form method="POST" action="?/delete">
      <input type="hidden" name="id" value={game._id}>
      <button class="btndanger">Delete Game</button>
    </form>
    
  </div>
</div>
</div>