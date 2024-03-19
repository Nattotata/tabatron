<script lang="ts">
  export let data;
  console.info(data);
</script>

{#each data.rows as hehe}
  <p>Jmeno: {hehe.name}</p>
  <p>Otrok: {hehe.owner}</p>
  <hr />
{/each}
