<script lang="ts">
  import {
    findExerciseByName,
    findExercisesByTags,
    findSingleExerciseByTag,
  } from "./utils";

  import type { Exercise } from "./types";
  import { autocompleteTag } from "./templates";
  export let round;
  export let index: number;
  export let allExercises: Exercise[];
  export let templateWithExercises;
  export let selectedTagExercises;

  let handPickedExercise = Array(100)
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

        <dd class="mx-8">
          <span class="max-width: 65ch">{exercise.description}</span>
        </dd>
        <dd class="mx-8">
          {#each exercise.tags as tag}
            <span class="m-1 chip variant-filled">{tag}</span>
          {/each}
        </dd>
        <dd class="mx-8">
          <select
            class="select max-w-sm"
            bind:value={handPickedExercise[index][exerIndex]}
            on:change={() => {
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
            <option value="Vyměň cvik" selected>
              Vyměň za jiný cvik se stejným tagem
            </option>
            {#each findExercisesByTags( { tags: exercise.tags, allExercises } ) as similarExercise}
              <option value={similarExercise.name}>
                {similarExercise.name}
              </option>
            {/each}
          </select>
        </dd>
        <dd class="flex flex-row mx-8 gap-2">
          <span>
            <select
              class="select"
              bind:value={selectedTagExercises[index][exerIndex]}
            >
              {#each autocompleteTag as tag}
                <option value={tag.value}>{tag.label}</option>
              {/each}
            </select>
          </span>
          <span>
            <button
              class="btn variant-filled-primary"
              on:click={() => {
                const newExercise = findSingleExerciseByTag({
                  allExercises,
                  tag: selectedTagExercises[index][exerIndex],
                });
                if (!newExercise) {
                  console.error(
                    `No exercise with tag: ${selectedTagExercises[index][exerIndex]} found`
                  );
                  return;
                }
                templateWithExercises.update((rounds) => {
                  rounds[index].exercises[exerIndex] = newExercise;
                  return rounds;
                });
              }}>Vyměň za náhodný cvik s vybraným tagem</button
            >
          </span>
        </dd>
      </dl>
    {/each}
  {/if}
</div>
