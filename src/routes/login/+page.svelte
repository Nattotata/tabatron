<script lang="ts">
  import type { PageData, ActionData } from "./$types";

  export let data: PageData;

  export let form: ActionData;
</script>

{#if form?.status === 201}
  <!-- this message is ephemeral; it exists because the page was rendered in
		   response to a form submission. it will vanish if the user reloads -->
  <p>Successfully logged in! Welcome back, {form?.token}</p>
{/if}
