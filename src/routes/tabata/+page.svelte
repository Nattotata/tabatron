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
  import RoundWithExercises from "./RoundWithExercises.svelte";
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

  const handleChangeStep = (e: {
    detail: { state: { current: number; total: number }; step: number };
  }): void => {
    console.info("this is step state current", e.detail.state.current);
    console.info("das is step number", e.detail.step);
    switch (e.detail.state.current) {
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
        console.info("refresh templateWithExercises");
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
        <RoundWithExercises
          {round}
          {index}
          {templateWithExercises}
          {allExercises}
          {selectedTagExercises}
        />
      {/each}
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
