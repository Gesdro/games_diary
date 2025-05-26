<script>
  let { game } = $props();
  let newReview = $state('');
</script>

<div class="game-card">
  <div class="details">
    <div class="title">{game.title}</div>
    <p><strong>Progress:</strong> {game.progress || 'No Data'}</p>


        <!-- Hier das Bild einfügen! -->
    {#if game.backgroundImage}
      <div class="image" style="margin-bottom: 1rem;">
        <img src={game.backgroundImage} alt={game.title} style="max-width: 100%; border-radius: 8px;" />
      </div>
    {/if}

    <p><strong>Reviews:</strong></p> <!-- Reviews des Spiels, falls vorhanden -->
    <ul>
      {#if game.reviews?.length} 
        {#each game.reviews as review}
          <li>
            {review}
            <form method="POST" action="?/deleteReview" style="display:inline;"> <!-- Inline-Formular für das Löschen der Review -->
              <input type="hidden" name="gameId" value={game._id} /> <!-- Game ID für das Löschen der Review -->
              <input type="hidden" name="review" value={review} /> <!-- Review-Text, um die spezifische Review zu identifizieren -->
              <button type="submit">Delete Review</button> <!-- Button zum Löschen der Review -->
            </form>
          </li>
        {/each}
      {:else}
        <li>No reviews yet.</li> <!-- Falls keine Reviews vorhanden sind, wird dies angezeigt -->
      {/if}
    </ul>
    <form method="POST" action="?/addReview"> <!-- Formular zum Hinzufügen einer neuen Review -->
      <input type="hidden" name="gameId" value={game._id} /> <!-- Game ID für das Hinzufügen der Review -->
      <input
        name="review"
        placeholder="Write a review..."
        bind:value={newReview} 
      /> <!-- Eingabefeld für die neue Review -->
      <button type="submit">Send Review</button>
    </form>
    <form method="POST" action="?/deleteMyGame"> <!-- Formular zum Löschen des Spiels aus der eigenen Liste -->
      <input type="hidden" name="gameId" value={game._id} />
      <button type="submit" style="background:red;color:white;">Delete Game</button> <!-- Button zum Löschen des Spiels -->
    </form>
  </div>
</div>