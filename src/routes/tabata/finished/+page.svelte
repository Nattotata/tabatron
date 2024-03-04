<script lang="ts">
  import { get } from "svelte/store";
  import { templateWithExercises } from "../stores";
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  const data =
    (browser && JSON.parse(localStorage.getItem("tabata") || "[]")) || [];
  console.info(data);
  console.info(get(templateWithExercises));
</script>

{#each JSON.parse(localStorage.getItem("tabata") || "[]") as { name, exercises }}
  <h2 class="h2">{name}</h2>
  <ul>
    {#each exercises as exercise}
      <li>{exercise.name}</li>
      <li>{exercise.description}</li>
      <li>{exercise.type}</li>
      <li>Tags: {exercise.tags.join(", ")}</li>
    {/each}
  </ul>
{/each}
