<script>
  let { game } = $props(); 
    let newReview = $state('');

    async function submitReview() {  // Review absenden
          if (!newReview.trim()) return;  // Überprüfen, ob das Review nicht leer ist, trimm() entfernt Leerzeichen am Anfang und Ende
    await fetch(`/api/my_games/${game._id}/review`, {    // API-Endpoint zum Absenden des Reviews
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, // umwandeln der Daten ins JSON, um in der Datenbank gespeichert zu werden
      body: JSON.stringify({ review: newReview })
    });

    newReview = ''; // Eingabefeld zurücksetzen
    location.reload();
  }

    async function deleteGame() { 
    const confirmDelete = confirm("Confirm deletion?"); // Hinweis, ob das SPiel wirklich gelöscht werden soll
    if (!confirmDelete) return;

    const res = await fetch(`/api/my_games/${game._id}`, { // Aufrug der API zum Löschen des Spiels
      method: 'DELETE' // DELETE-Methode zum Löschen des Spiels HTTP API
    });

    if (res.ok) {
      location.reload(); // oder emit-Event
    } else {
      alert('Error wihtin the deletion.');
    }
  }

</script>



<div class="game-card" style="display: flex; gap: 1rem; align-items: flex-start;">
  <!-- Linke Spalte -->
  <div class="details" style="flex: 1;">
    <div class="title">
      <a href={"/games/" + game._id}>{game.title}</a>
    </div>

    <p><strong>Progress:</strong> {game.progress || 'No Data'}</p>

<p><strong>Reviews:</strong></p>
<ul> <!-- Liste der Reviews, die in der Datenbank gespeichert sind -->
  {#if game.reviews && game.reviews.length > 0} 
    {#each game.reviews as review}
      <li>{review}</li>
    {/each}
  {:else}
    <li><p>No reviews yet.</p></li>
  {/if}
</ul>

      <!-- Bild wird direkt von der API übernommen -->
  <div class="image" style="flex: 1;">
    <img
      src={game.backgroundImage}
      alt={game.title}
      class="img-fluid"
      style="max-width: 100%; height: auto; border-radius: 8px;"
    />
  </div>
<!-- Review-Eingabe -->
<textarea
  bind:value={newReview}
  rows="3"
  placeholder="Enter review..."
  style="width: 100%; margin-top: 1rem;"
></textarea> <!-- Eingabefeld für das Review, wird benutzt um in der API die Daten zu speichern -->



<!-- Button-Zeile -->
<div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
  <button onclick={submitReview}>
    Send review
  </button>
  <button
    onclick={deleteGame}
    style="background: red; color: white;">
    Delete Game <!-- Button zum Löschen des Spiels, wird benutzt um in der API die Daten zu löschen -->
  </button>
</div>
</div>
</div>



  