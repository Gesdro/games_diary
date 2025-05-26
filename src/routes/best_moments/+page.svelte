<script>
  export let data;
  export let form;
  let title = '';
  let description = '';
  let image;
</script>

<div class="headercontainer mt-3">
<h1>My Personal Best Moments</h1>
<p>Care to share your Moments?</p>
</div>

<form method="POST" action="?/upload" enctype="multipart/form-data" class="moment-form">
  <h2>Upload your moment</h2>
  <label>
    <span>Title*</span>
    <input name="title" bind:value={title} placeholder="title of your moment..." required autocomplete="off" />
  </label>
  <label>
    <span>Description*</span>
    <!-- svelte-ignore element_invalid_self_closing_tag -->
    <textarea name="description" bind:value={description} placeholder="Describe your best moments..." rows="3" required />
  </label>
  <label class="file-upload">
    <span>Picture (.jpg)*</span>
    <input type="file" name="image" accept=".jpg,image/jpeg" required />
  </label>
  <button type="submit">Upload your moment</button>
</form>



<hr />
<div class="headercontainer mt-3">
<h1>a brief History of my gaming carrier</h1>
<p>Here you can see all your best moments.</p>
</div>



<ul>
  {#each data.moments as moment (moment.image)}
    <li style="margin-bottom:2em">
      <h3>{moment.title}</h3>
      <p>{moment.description}</p>
      <img src={moment.image} alt={moment.title} style="max-width:300px" />
    </li>
  {/each}
</ul>

<style>
.moment-form {
  max-width: 400px;
  margin: 2rem auto 2rem auto;
  padding: 2rem;
  background: #232323;
  border-radius: 18px;
  box-shadow: 0 2px 16px #0006;
  display: flex;
  flex-direction: column;
  gap: 1.3em;
}

.moment-form h2 {
  color: #fff;
  font-size: 1.3em;
  margin-bottom: .5em;
  text-align: center;
  letter-spacing: .5px;
}

.moment-form label {
  display: flex;
  flex-direction: column;
  color: #ddd;
  font-weight: 500;
  gap: .3em;
  font-size: 1em;
}

.moment-form textarea,
.moment-form input[type="file"] {
  background: #171717;
  color: #f5f5f5;
  border: 1px solid #444;
  border-radius: 7px;
  padding: 0.65em 1em;
  font-size: 1em;
  outline: none;
  transition: border .2s;
}

.moment-form textarea:focus {
  border: 1.5px solid #69b3fa;
  background: #222;
}

.moment-form textarea {
  resize: vertical;
  min-height: 70px;
  max-height: 200px;
}

.moment-form .file-upload input[type="file"] {
  padding: 0;
  background: none;
  color: #fff;
}

.moment-form button {
  margin-top: 0.3em;
  padding: 0.9em 0;
  border: none;
  border-radius: 7px;
  color: #fff;
  font-weight: bold;
  font-size: 1.1em;
  cursor: pointer;
  transition: background .18s, transform .14s;
  box-shadow: 0 1px 5px #0002;
}

@media (max-width: 550px) {
  .moment-form {
    max-width: 98vw;
    padding: 1.2rem;
  }
}
</style>
