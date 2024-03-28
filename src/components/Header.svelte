<script lang="ts">
  import { userInfo } from "$stores/user";
  import { AppBar } from "@skeletonlabs/skeleton";
  const links = [
    {
      alt: "Tabatron",
      link: "./tabata",
    },
    {
      alt: "Create account",
      link: "./register",
    },
    {
      alt: $userInfo.name,
      link: "./profile",
    },
  ];
</script>

<AppBar regionRowHeadline="noPrint" regionRowMain="noPrint">
  <svelte:fragment slot="lead">
    <span class="noPrint hidden md:block">
      <strong class="text-xl uppercase">Tabatron</strong>
    </span>
  </svelte:fragment>
  <svelte:fragment slot="trail">
    {#each links as link}
      <a
        class="btn btn-sm variant-ghost-surface noPrint"
        href={link.link}
      >
        {link.alt}
      </a>
    {/each}
  </svelte:fragment>
</AppBar>
