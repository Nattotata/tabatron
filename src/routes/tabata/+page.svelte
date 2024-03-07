<script lang="ts">
  import {
    InputChip,
    Autocomplete,
    Stepper,
    Step,
  } from "@skeletonlabs/skeleton";
  import type { Tag, Exercise } from "./types";
  import { roundTemplate, autocompleteTag } from "./templates";
  import {
    findExercisesByTags,
    findSingleExerciseByTag,
    fillTemplateWithTags,
    findExerciseByName,
    fillTemplateWithExercises,
    printSection,
    getTodaysDate,
  } from "./utils";

  import { get } from "svelte/store";
  import { onMount } from "svelte";
  import TagCard from "./TagCard.svelte";
  import { templateWithTags, templateWithExercises } from "./stores";

  // Data
  export let data;
  const allExercises: Exercise[] = data.exercises;

  const today = getTodaysDate();
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

  const handleChangeStep = (e: CustomEvent) => {
    console.info("this is step number", e.detail.state.current);
    switch (e.detail.state.current) {
      case 0:
        break;
      case 1:
        console.info("refresh templateWithTags");
        templateWithTags.set(
          fillTemplateWithTags({
            debug,
            inputChipList,
            roundTemplate,
            tagOptions: autocompleteTag,
          })
        );
        break;
      case 2:
        templateWithExercises.set(
          fillTemplateWithExercises({
            debug,
            templateWithTags: $templateWithTags,
            allExercises,
          })
        );
        break;
      case 3:
        break;
      case 4:
        console.log("print");
        window.print();
        break;
    }
  };

  const initialize = () => {
    templateWithTags.set(
      fillTemplateWithTags({
        debug,
        inputChipList,
        roundTemplate,
        tagOptions: autocompleteTag,
      })
    );
    templateWithExercises.set(
      fillTemplateWithExercises({
        debug,
        templateWithTags: get(templateWithTags),
        allExercises,
      })
    );
  };
  onMount(() => {
    initialize();
    console.info("template with tags", get(templateWithTags));
  });
</script>

<h1 class="h1">Tabatron</h1>
<Stepper
  on:step={handleChangeStep}
  on:complete={() => {
    printSection({ identifier: "outputForPrint" });
  }}
  regionContent="noPrint"
  regionHeader="noPrint"
  badge="noPrint variant-filled-surface"
  active="noPrint variant-filled"
  buttonBack="noPrint variant-ghost"
  buttonNext="noPrint variant-filled"
  buttonComplete="noPrint variant-filled-primary"
>
  <Step>
    <svelte:fragment slot="header">Input</svelte:fragment>

    <section id="input">
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
    </section>
  </Step>

  <Step>
    <svelte:fragment slot="header">Šablona se štítky</svelte:fragment>
    <section id="templateWithTags">
      <h2 class="h2">Template with Tags</h2>

      <div class="flex" style="flex-wrap: wrap;">
        {#each $templateWithTags as round, index (index)}
          <TagCard
            {round}
            {index}
            {templateWithTags}
            {selectedTagTemplate}
            {autocompleteTag}
          />
        {/each}
      </div>
    </section>
  </Step>

  <Step>
    <svelte:fragment slot="header">Šablona s cviky</svelte:fragment>

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
  </Step>
  <Step>
    <svelte:fragment slot="header">🎉🎉🎉</svelte:fragment>

    <section id="outputForPrint">
      <h3 class="bumpUp" contenteditable={true}>{today}</h3>
      {#each $templateWithExercises as round}
        <p style="margin-top: 0.em; margin-bottom: 0.5em">
          <strong>{round.name}: {round.tags.join(", ")}</strong>
        </p>
        <div class="ml-4">
          {#each round.exercises || [] as exercise, i}
            <p style="margin-top: 0px; margin-bottom: 0px">
              {i + 1}. {exercise.name}
            </p>
          {:else}
            <p>No exercises</p>
          {/each}
        </div>
      {/each}
    </section>
  </Step>
</Stepper>

<style>
  @media print {
    .bumpUp {
      margin-top: -30px;
    }
    * {
      display: none;
    }
    button {
      display: none;
    }
    span {
      display: none;
    }
    .noPrint {
      display: none;
    }
    #outputForPrint,
    #outputForPrint * {
      display: block;
    }
    li,
    h2,
    h3 {
      color: black;
    }
  }
</style>
