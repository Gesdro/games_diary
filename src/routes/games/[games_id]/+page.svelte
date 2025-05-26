<script>
let { data, form } = $props();
  let game = data.game;

   

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

  
<!-- Add to my Games, aufrug von der Server.js-->
<form method="POST" action="?/addToMyGames">
  <input type="hidden" name="gameId" value={game._id} />
  <button type="submit">Add to my Games</button>
</form>
{#if form?.success}
  <p>Game saved!</p>
{:else if form?.error}
  <p class="text-danger">{form.error}</p>
{/if}

<h1>{game.name}</h1>
<p>{game.description}</p>

<!-- Einzelne Games in der Detail sicht löschen-->
  <form method="POST" action="?/delete">
      <input type="hidden" name="id" value={game._id}>
      <button class="btndanger">Delete Game</button>
    </form>
    
  </div>
</div>
</div>