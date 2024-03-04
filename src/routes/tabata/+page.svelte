<script lang="ts">
  import { InputChip, Autocomplete } from "@skeletonlabs/skeleton";
  import type {
    Tag,
    Exercise,
    RoundTemplate,
    TemplateWithTags,
    FilledTemplate,
  } from "./types";
  import { roundTemplate, autocompleteTag } from "./templates";
  import {
    findExercisesByTag,
    findExercisesByTags,
    findExercisesByType,
    findSingleExerciseByTag,
    fillTemplateWithTags,
    findExerciseByName,
    fillTemplateWithExercises,
  } from "./utils";

  import { get } from "svelte/store";
  import { writable } from "svelte/store";

  import { templateWithTags, templateWithExercises } from "./stores";

  // Data
  export let data;
  const allExercises: Exercise[] = data.exercises;
  console.error(
    findExercisesByTags({
      allExercises,
      tags: ["Biceps", "Triceps"],
    })
  );

  const today = new Date().toLocaleDateString().replaceAll("/", ".");
  // Store

  // State variables (mutable :( )

  // TODO FIX THIS
  let selectedTagTemplate: string[] = [];
  let selectedTagExercises = Array(100)
    .fill(null)
    .map(() => []);
  let handPickedExercise = Array(100)
    .fill(null)
    .map(() => []);
  let inputChip = "";
  let inputChipList: Tag[] = [];
  const debug: boolean = false;

  function onInputChipSelect(event: CustomEvent): void {
    if (inputChipList.includes(event.detail.value) === false) {
      inputChipList = [...inputChipList, event.detail.value];
      inputChip = "";
    }
  }
</script>

<h1 class="h1">Tabatron</h1>

<div style="margin: 10px; max-width: 50vw">
  <InputChip
    regionInput="w-100"
    bind:input={inputChip}
    bind:value={inputChipList}
    name="chips"
    label="Na co se zaměříme?"
    placeholder="Na co se zaměříme?"
    max={3}
  />

  <div class="card w-full max-h-48 p-4 overflow-y-auto" tabindex="-1">
    <Autocomplete
      bind:input={inputChip}
      options={autocompleteTag}
      denylist={inputChipList}
      on:selection={onInputChipSelect}
    />
  </div>
</div>

<button
  class="btn variant-filled-primary"
  on:click={() =>
    templateWithTags.set(
      fillTemplateWithTags({
        debug,
        inputChipList,
        roundTemplate,
        tagOptions: autocompleteTag,
      })
    )}
  ><a href="#templateWithTags">Generuj šablonu se štítky</a>
</button>

<button
  class="btn variant-filled-primary"
  on:click={() =>
    templateWithExercises.set(
      fillTemplateWithExercises({
        debug,
        templateWithTags: get(templateWithTags),
        allExercises,
      })
    )}><a href="#templateWithExercises">Vyplň šablonu cvikami</a></button
>

<section id="templateWithTags">
  <h2 class="h2">Template with Tags</h2>

  <div class="flex" style="flex-wrap: wrap;">
    {#each $templateWithTags as round, index (index)}
      <div class="card m-5 w-30vw">
        <header class="card-header">{round.name}</header>
        <section class="p-4">
          <p>Typ: {round.type}</p>
          <p>Počet cviků: {round.exercisesAmount}</p>
        </section>
        <footer class="card-footer">
          <label class="label flex flex-row">
            <select
              on:change={(e) => {
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
              }}
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
                  round[index].tags = round[index].tags.filter(
                    (t) => t !== tag
                  );
                  return round;
                });
              }}
              class="chip m-1 variant-filled">{tag} ✕</button
            >
          {/each}
        </footer>
        <footer class="card-footer">Tagy: {round.tags.join(", ")}</footer>
      </div>
    {/each}
  </div>
</section>

<section id="templateWithExercises">
  <h2 class="h2">Template with Exercises</h2>

  {#each $templateWithExercises as round, index (index)}
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
                  {exercise.substitution
                    ? `⚠️ ${exercise.name}`
                    : exercise.name}
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
                <option value="Vyměň cvik" selected
                  >Vyměň za jiný cvik se stejným tagem</option
                >
                {#each findExercisesByTags( { tags: exercise.tags, allExercises } ) as similarExercise}
                  <option value={similarExercise.name}
                    >{similarExercise.name}</option
                  >
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
      <hr />
    </div>
  {/each}
  <button
    class="btn"
    on:click={() => {
      const data = JSON.stringify(get(templateWithExercises));
      localStorage.setItem("tabata", data);
    }}>Save</button
  >
</section>

<section id="filledTemplate">
  <h2 class="h2 mb-2 bumpUp" contenteditable={true}>{today}</h2>
  {#each $templateWithExercises as round}
    <h3 class="h3 mb-1">{round.name}: {round.tags.join(", ")}</h3>
    <ol class="ml-4">
      {#each round.exercises || [] as exercise, i}
        <li>{i + 1}. {exercise.name}</li>
      {:else}
        <li>No exercises</li>
      {/each}
    </ol>
  {/each}
</section>

<style>
  @media print {
    .bumpUp {
      margin-top: -30px;
    }
    * {
      display: none;
    }
    #filledTemplate,
    #filledTemplate * {
      display: block;
    }
    li,
    h2,
    h3 {
      color: black;
    }
  }
</style>
