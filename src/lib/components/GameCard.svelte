<script>
  let { game } = $props();
</script>
<!-- Daten werden von den Properties übernommen -->


<div class="game-card">
  <div>
  <img class="img-fluid" src={game.backgroundImage ?? '/images/Ebene.png'} alt="" /> <!-- Beispiel, wird aber wieder geändert-->
  </div>
  <div class="details">
    <div class="title">
      <a href={"/games/" + game._id}>{game.title}</a> <!-- Link zum Spiel, wird von der ID übernommen -->
    </div>
    <div>
      Release: {game.releaseDate} <!-- Release-Datum des Spiels -->
    </div>
    <div>
      Platform: {game.platform} <!-- Plattform des Spiels, z.B. PC, PS5, Xbox -->
    </div>
    <div> 
      Rating: {game.rating} <!-- Bewertung des Spiels, z.B. 4.5/5 -->
    </div>
    <div>
      Tags: {game.tags?.join(', ')}   <!-- Tags des Spiels, z.B. Action, RPG, Shooter -->

    </div>
  </div>
</div>


