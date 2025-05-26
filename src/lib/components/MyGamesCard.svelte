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
        placeholder="Write a review..."
        bind:value={newReview}
      />
      <button type="submit">Send Review</button>
    </form>
    <form method="POST" action="?/deleteMyGame">
      <input type="hidden" name="gameId" value={game._id} />
      <button type="submit" style="background:red;color:white;">Delete Game</button>
    </form>
  </div>
</div>