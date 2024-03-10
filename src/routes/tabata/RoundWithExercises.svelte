<script lang="ts">
  import {
    findExerciseByName,
    findExercisesByTags,
    findSingleExerciseByTag,
  } from "./utils";

  import type { Exercise, FilledTemplate } from "./types";
  import { autocompleteTag } from "./templates";
  import { templateWithExercises } from "./stores";
  export let round: FilledTemplate;
  export let index: number;
  export let allExercises: Exercise[];
  const amountOfTagsAndCancel = autocompleteTag.length + 1;
  let selectedTag = Array.from({ length: amountOfTagsAndCancel }, () => []);
  const amountOfExercises = allExercises.length;
  let handPickedExercise = Array(amountOfExercises)
    .fill(null)
    .map(() => []);
</script>

<div class="ml-4 mt-4">
  <h3 class="h3">{round.name}</h3>
  <p><strong>Typ:</strong> {round.type}</p>
  <p><strong>Počet cviků:</strong> {round.exercisesAmount}</p>
  <p><strong>Tagy:</strong> {round.tags.join(", ")}</p>
  {#if round.exercises}
    {#each round.exercises as exercise, exerIndex (exerIndex)}
      <dl class="list-dl m-2">
        <dt class="flex flex-row">
          <span class="badge-icon p-4 variant-soft-primary mr-2"
            >{exerIndex + 1}</span
          >
          <span class="mx-2"
            ><h4 class="h4">
              {exercise.substitution ? `⚠️ ${exercise.name}` : exercise.name}
            </h4></span
          >
        </dt>

        <dd class="ml-10">
          <span class="max-width: 65ch"
            >{exercise.description || "Bez popisku"}</span
          >
        </dd>
        <dd class="ml-10 mt-10">
          {#each exercise.tags as tag}
            <span class="m-1 chip variant-filled">{tag}</span>
          {/each}
        </dd>
        <dt class="ml-10">Vyměň za jiný cvik se stejným tagem:</dt>
        <dd class="mx-8">
          <select
            class="select max-w-sm"
            bind:value={handPickedExercise[index][exerIndex]}
            on:change={() => {
              if (handPickedExercise[index][exerIndex] === "cancel") return;
              const newExercise = findExerciseByName({
                allExercises,
                name: handPickedExercise[index][exerIndex],
              });
              if (!newExercise) {
                console.error(
                  `No exercise with name: ${handPickedExercise[index][exerIndex]} found`
                );
                return;
              }
              templateWithExercises.update((rounds) => {
                rounds[index].exercises[exerIndex] = newExercise;
                return rounds;
              });
            }}
          >
            <option value="cancel" selected>Zrušit výběr</option>
            {#each findExercisesByTags( { tags: exercise.tags, allExercises } ) as similarExercise}
              <option id="handPickedExercise" value={similarExercise.name}>
                {similarExercise.name}
              </option>
            {/each}
          </select>
        </dd>
        <dt class="ml-10">Vyměň za náhodný cvik se zvoleným štítkem:</dt>
        <dd class="flex flex-row mx-8 gap-2">
          <span>
            <select class="select" bind:value={selectedTag[index][exerIndex]}>
              <option value="cancel" selected>Zrušit výběr</option>
              {#each autocompleteTag as tag}
                <option value={tag.value}>{tag.label}</option>
              {/each}
            </select>
          </span>
          <button
            class="btn btn-primary variant-filled-secondary"
            on:click={() => {
              if (selectedTag[index][exerIndex] === "cancel") return;
              const newExercise = findSingleExerciseByTag({
                allExercises,
                tag: selectedTag[index][exerIndex],
              });
              if (!newExercise) {
                console.error(
                  `No exercise with tag: ${selectedTag[index][exerIndex]} found`
                );
                return;
              }
              templateWithExercises.update((rounds) => {
                rounds[index].exercises[exerIndex] = newExercise;
                return rounds;
              });
            }}>🎲</button
          >
        </dd>
      </dl>
    {/each}
  {/if}
</div>
