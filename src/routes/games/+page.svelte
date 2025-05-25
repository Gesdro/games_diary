<script>
  import GameCard from "$lib/components/GameCard.svelte";

let { data } = $props();
let searchQuery = $state('');
  let selectedTag = $state ('All');

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

<div class="headercontainer mt-3">
  <h1>🎮 Games Database</h1>
  <p>Please choose your game, to add it to your database, to create more informations about your progress</p> <!-- Header Container-->
</div>

<div class="filter-container mt-3 mb-3">
  <label for="tagFilter"><strong>Filter by Tag:</strong></label> <!-- Filterfunktion und Suchfenster-->
  <select id="tagFilter" bind:value={selectedTag}>
    <option>All</option>
    <option>Action</option>
    <option>RPG</option>
    <option>Shooter</option>
    <option>Puzzle</option>
    <option>Adventure</option>
    <option>Strategy</option>
    <option>Simulation</option>
    <option>Sports</option>
    <option>Multiplayer</option>
    <option>Indie</option>
    <option>Horror</option>
    <option>Open World</option>
    <option>Platformer</option>
    <option>Racing</option>   
    <option>Puzzle</option>
  </select>
</div>
<div>
<input
  type="text"
  placeholder="Search..."
  class="form-control mt-2"
  bind:value={searchQuery} 
/> <!-- Suchfeld für die Spiele, wird durch den State direkt angepasst und ist reaktiv -->
</div>  

<div>
  <a href="/games/create" class="btn btn-primary">Add a new Game</a> <!-- Button zum Hinzufügen eines neuen Spiels, wird direkt mit der API verbudnen -->
</div>
<div class="row mt-3">
  {#each filteredGames() as game}
    <div class="col-sm-6 col-md-4 col-lg-3 mb-2 gx-2"> <!-- Responsive Grid für die Spiele, damit sie auf dem Bildschirm gut aussehen -->
      <GameCard {game} /> <!-- Durchlaufe alle Spiele, basiernd auf der Komponente GameCard.svelte -->
    </div>
  {/each}
</div>
