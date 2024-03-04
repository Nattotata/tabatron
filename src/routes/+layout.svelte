<script lang="ts">
  import "../app.postcss";
  import { AppShell, AppBar } from "@skeletonlabs/skeleton";
</script>

<!-- App Shell -->
<AppShell>
  <svelte:fragment slot="header">
    <!-- App Bar -->
    <AppBar regionRowHeadline="noPrint" regionRowMain="noPrint">
      <svelte:fragment slot="lead">
        <strong class="text-xl uppercase noPrint">Skeleton</strong>
      </svelte:fragment>
      <svelte:fragment slot="trail">
        <a class="btn btn-sm variant-ghost-surface noPrint" href="./tabata">
          Tabata Generator
        </a>
      </svelte:fragment>
    </AppBar>
  </svelte:fragment>
  <!-- Page Route Content -->
  <div class="main">
    <slot />
  </div>
</AppShell>

<style>
  .main {
    margin: 30px;
  }
  @media print {
    .noPrint {
      display: none;
    }
  }
</style>
