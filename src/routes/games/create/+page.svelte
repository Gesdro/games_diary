<script>
 const {form} = $props() // SvelteKit gibt das Server-Action-Resultat als "form" aus
  let name = $state('');
</script>

<h1>Add game with name</h1>

<form method="POST" action="?/create">
  <input
    name="name"
    bind:value={name}
    placeholder="Enter Game Name..."
    class="form-control mb-2"
    required
  />
  <button class="btn btn-primary" type="submit">
    Search & save Game
  </button>
</form>

{#if form?.success}
  <p class="mt-3">Game saved (ID: {form.id})</p>
{:else if form?.error}
  <p class="mt-3 text-danger">{form.error}</p>
{/if}