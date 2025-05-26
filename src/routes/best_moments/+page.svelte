<script>
  let { data, form } = $props();
  let title = $state('');
  let description = $state('');
  let image;
</script>

<div class="headercontainer mt-3">
<h1>My Personal Best Moments</h1>
<p>Care to share your Moments?</p>
</div>
<!-- Upload wird von der Page.Server.js übernommmen-->
<form method="POST" action="?/upload" enctype="multipart/form-data" class="moment-form">
  <h2>Upload your moment</h2>
  <label>
    <span>Title*</span> <!-- Titel -->
    <input name="title" bind:value={title} placeholder="title of your moment..." required autocomplete="off" /> <!-- Titel für einen Moment definieren -->
  </label>
  <label>
    <span>Description*</span> <!-- Beschreibung -->
    <!-- svelte-ignore element_invalid_self_closing_tag -->
    <textarea name="description" bind:value={description} placeholder="Describe your best moments..." rows="3" required></textarea> <!-- Beschreibung für den Moment -->
  </label>
  <label class="file-upload">
    <span>Picture (.jpg)*</span> <!-- Bild Upload -->
    <input type="file" name="image" accept=".jpg,image/jpeg" required />
  </label>
  <button type="submit">Upload your moment</button>  <!-- Upload Button-->
</form>



<hr />
<div class="headercontainer mt-3">
<h1>a brief History of my gaming carrier</h1>
<p>Here you can see all your best moments.</p>
</div>



<ul> <!-- List der besten Momente-->
  {#each data.moments as moment (moment.image)}
    <li style="margin-bottom:2em">
      <h3>{moment.title}</h3>
      <p>{moment.description}</p>
      <img src={moment.image} alt={moment.title} style="max-width:300px" />
    </li>
  {/each}
</ul>


