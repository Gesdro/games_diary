<script>
  export let game;
  let newReview = '';
</script>

<div class="game-card">
  <div class="details">
    <div class="title">{game.title}</div>
    <p><strong>Progress:</strong> {game.progress || 'No Data'}</p>
    <p><strong>Reviews:</strong></p>
    <ul>
      {#if game.reviews?.length}
        {#each game.reviews as review}
          <li>
            {review}
            <form method="POST" action="?/deleteReview" style="display:inline;">
              <input type="hidden" name="gameId" value={game._id} />
              <input type="hidden" name="review" value={review} />
              <button type="submit">Delete Review</button>
            </form>
          </li>
        {/each}
      {:else}
        <li>No reviews yet.</li>
      {/if}
    </ul>
    <form method="POST" action="?/addReview">
      <input type="hidden" name="gameId" value={game._id} />
      <input
        name="review"
        placeholder="Review schreiben"
        bind:value={newReview}
      />
      <button type="submit">Review absenden</button>
    </form>
    <form method="POST" action="?/deleteGame">
      <input type="hidden" name="gameId" value={game._id} />
      <button type="submit" style="background:red;color:white;">Game löschen</button>
    </form>
  </div>
</div>