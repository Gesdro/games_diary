<script>
  import MyGamesCard from '$lib/components/MyGamesCard.svelte';
  export let data;  // <- SvelteKit gibt `data` immer als export
  let selectedTag = 'All';
  let searchQuery = '';

  $: filteredGames = data.games.filter(game => {
    const tagMatch =
      selectedTag === 'All' ||
      game.tags?.some(tag => tag.trim().toLowerCase() === selectedTag.toLowerCase());
    const nameMatch = game.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return tagMatch && nameMatch;
  });

  // Optional: Sammle alle Tags zum Filtern
  $: allTags = Array.from(
    new Set(
      data.games.flatMap(game => game.tags ?? [])
    )
  );
</script>

<h1>My Games</h1>

<div>
  <input
    type="text"
    placeholder="Search for a game..."
    class="form-control mt-2"
    bind:value={searchQuery}
  />
</div>

<!-- Optional: Tag-Filter -->
<div style="margin-top: 1rem;">
  <select bind:value={selectedTag}>
    <option value="All">All</option>
    {#each allTags as tag}
      <option value={tag}>{tag}</option>
    {/each}
  </select>
</div>

<div class="row mt-3">
  {#each filteredGames as game}
    <MyGamesCard {game} />
  {/each}
</div>