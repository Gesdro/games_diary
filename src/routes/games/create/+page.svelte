<script>
  let name = $state('');
  let message = $state('');
  let loading = $state(false);

  async function submit() {
    if (!name) return;

    loading = true;
    message = ''; // Zurücksetzen der Nachricht vor dem Senden

    const res = await fetch('/api/create-game', { // API-Endpoint zum Erstellen eines neuen Spiels
      method: 'POST',
      body: JSON.stringify({ name }),
      headers: { 'Content-Type': 'application/json' } // Setze den Content-Type Header auf JSON, damit es in Mongdb gspechert werden kann
    });

    loading = false; // Laden beenden

    if (res.ok) {
      const data = await res.json();
      message = ` Game saved (ID: ${data.id})`; // Erfolgreiche Speicherung des Spiels
      name = '';
    } else {
      const error = await res.text();
      message = `Error: ${error}`;
    }
  }
</script>

<h1>Add game with name</h1>

<input
  bind:value={name} 
  placeholder="Enter Game Name..." 
  class="form-control mb-2"
/> <!-- Eingabefeld für den Namen des neuen Spiels, wird benutzt um inder API die daten zu dfinden -->

<button class="btn btn-primary" onclick={submit} disabled={loading}> <!-- Button zum Absenden des neuen Spiels -->
  {loading ? 'Loading...' : 'Search & save Game'}
</button>

{#if message}
  <p class="mt-3">{message}</p>
{/if}