<script lang="ts">
  import Toolbar from './global/Toolbar.svelte';
import Greet from './lib/Greet.svelte'
</script>
<Toolbar></Toolbar>
<main class="container">
  <h1>Welcome to Tauri!</h1>

  <p>
    Click on the Tauri, Vite, and Svelte logos to learn more.
  </p>

  <div class="row">
    <Greet />
  </div>


</main>

<style>
  .logo.vite:hover {
    filter: drop-shadow(0 0 2em #747bff);
  }

  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00);
  }
</style>