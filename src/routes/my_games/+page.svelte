<script>
  import MyGamesCard from '$lib/components/MyGamesCard.svelte';
  let { data } = $props();
  let selectedTag = 'All';
  let searchQuery = $state('');

  // Filtern der Spiele, basierend auf der Suchanfrage, nichts ausgewählt, alle Spiele werden angezeigt
  let filteredGames = $derived(data.games.filter(game => {
    const tagMatch =
      selectedTag === 'All' ||
      game.tags?.some(tag => tag.trim().toLowerCase() === selectedTag.toLowerCase()); // Unabhänig, ob es Gross oder Klein geschrieben ist.
    const nameMatch = game.title?.toLowerCase().includes(searchQuery.toLowerCase()); // Überprüfe, ob der Name des Spiels die Suchanfrage enthält
    return tagMatch && nameMatch;
  }));

</script>
<div class="headercontainer mt-3">
<h1>My Games</h1>
<p>Here you can see all my saved games. As well as my reviews. </p>
</div>

<div> <!-- Suchleiste für die Spiele -->
  <input
    type="text"
    placeholder="Search for a game..."
    class="form-control mt-2"
    bind:value={searchQuery}
  />
</div>


<div class="row mt-3"> <!-- Komponente MyGamesCard importiert, geht die ganze Datenbank durch -->
  {#each filteredGames as game}
    <MyGamesCard {game} />
  {/each}
</div>