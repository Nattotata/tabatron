<script lang="ts">
  import "../app.postcss";
  import { AppShell, Toast } from "@skeletonlabs/skeleton";
  import type { PageData } from "./$types";
  export let data: PageData;
  import Header from "$components/Header.svelte";
  import { userInfo } from "$stores/user";
  import { initializeStores } from "@skeletonlabs/skeleton";

  initializeStores();
  userInfo.set({ name: data.name, email: data.email });
</script>

<Toast />
<!-- App Shell -->
<AppShell>
  <Header />
  <svelte:fragment slot="header">
    <!-- App Bar -->
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
