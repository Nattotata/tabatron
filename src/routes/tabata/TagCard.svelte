<script lang="ts">
  // Component logic and data go here

  import type { TemplateWithTags } from "./types";
  import type { Writable } from "svelte/store";
  export let round: any;
  export let index: number;
  export let templateWithTags: Writable<any>;
  export let selectedTagTemplate: any;
  export let autocompleteTag: any;

  const changeHandler = (e: any) => {
    const selectedTag = e.target.value;
    if (round.tags.includes(selectedTagTemplate)) {
      console.error("Tag already exists");
      return;
    }
    if (!selectedTag) {
      return;
    }
    templateWithTags.update((rounds) => {
      rounds[index].tags = [...rounds[index].tags, selectedTag];
      return rounds;
    });
    selectedTagTemplate[index] = selectedTag;
  };
  // Component methods and logic
</script>

<div class="card m-5 w-30vw">
  <header class="card-header">{round.name}</header>

  <section class="p-4">
    <p>Typ: {round.type}</p>
    <p>Počet cviků: {round.exercisesAmount}</p>
    <input
      class="input"
      type="range"
      bind:value={round.exercisesAmount}
      max={12}
    />
  </section>

  <footer class="card-footer">
    <label class="label flex flex-row">
      <select
        on:change={changeHandler}
        class="select mt-2"
        bind:value={selectedTagTemplate[index]}
      >
        <option value="" selected>Přidej tag:</option>
        {#each autocompleteTag as tag}
          {#if round.tags.includes(tag.value)}
            <option value={tag.value} disabled>{tag.value}</option>
          {:else}
            <option value={tag.value}>{tag.value}</option>
          {/if}
        {/each}
      </select>
    </label>
    {#each round.tags as tag}
      <button
        on:click={() => {
          templateWithTags.update((round) => {
            round[index].tags = round[index].tags.filter((t) => t !== tag);
            return round;
          });
        }}
        class="chip m-1 variant-filled">{tag} ✕</button
      >
    {/each}
  </footer>

  <footer class="card-footer">Tagy: {round.tags.join(", ")}</footer>
</div>
