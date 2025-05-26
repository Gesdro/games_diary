<!--  css- stylesheetimportieren -->
<!--  Layout für childern definieren und als properties weitergeben -->

<script>
  import "./styles.css";
  let { children } = $props();
</script>


<!-- Layout Navtigationsbar -->
<nav
  class="navbar navbar-expand-lg bg-body-tertiary bg-dark"
  data-bs-theme="dark">
  <div class="container-fluid">
    <a class="navbar-brand" href="/">Gamediary</a>
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

  <!-- Navigationsliste definieren, Grundseiten hinzugefügt-->
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="/games"
            >Games</a>
        </li>
                <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="/my_games"
            >my Games</a>
        </li>
                   <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="/best_moments"
            >Best Moments</a>
        </li>
      </ul>
    </div>
  </div>
</nav>

<!-- Container Übergabe an die Child-Klassen-->

<div class="container mt-3">
  {@render children()}
</div>
