<script>
import MyGamesCard from '$lib/components/MyGamesCard.svelte'; // MyGamesCard wird übernommen von den Komponenten
  let { data } = $props();
  let selectedTag = $state ('All');
  let searchQuery = $state('');


  const filteredGames = $derived(() => { // Filtere die Spiele basierend auf dem ausgewählten Tag und der Suchanfrage
    return data.games.filter(game => {
      const tagMatch =
        selectedTag === 'All' ||
        game.tags?.some(tag => tag.trim().toLowerCase() === selectedTag.toLowerCase()); // Überprüfe, ob der Tag des Spiels mit dem ausgewählten Tag übereinstimmt

      const nameMatch =
        game.title?.toLowerCase().includes(searchQuery.toLowerCase());

      return tagMatch && nameMatch; // Überprüfe, ob der Name des Spiels die Suchanfrage enthält
    });
  });
</script>



<h1>My Games </h1>

<div>
<input
  type="text"
  placeholder="Search for a game..."
  class="form-control mt-2"
  bind:value={searchQuery} 
/> <!-- Suchfeld für die Spiele, wird durch den State direkt angepasst und ist reaktiv -->
</div>  

<div class="row mt-3">
  {#each filteredGames() as game}
      <MyGamesCard {game} /> <!-- Durchlaufe alle Spiele, basiernd auf der Komponente GameCard.svelte -->
  {/each}
</div>




