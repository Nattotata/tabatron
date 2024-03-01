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
  import { findExercisesByTag, findExercisesByType } from "./utils";

  // Data
  export let data;
  const allExercises: Exercise[] = data.exercises;

  // State variables (mutable :( )

  let inputChip = "";
  let inputChipList: Tag[] = [];
  const debug: boolean = false;

  let tabataRegime: Exercise[] = [];
  let templateWithTags: TemplateWithTags[] = [];
  let filledTemplate: FilledTemplate[] = [];

  function onInputChipSelect(event: CustomEvent): void {
    if (inputChipList.includes(event.detail.value) === false) {
      inputChipList = [...inputChipList, event.detail.value];
      inputChip = "";
    }
  }

  /** Fills a template with Tags.
   * Accepts an array of 0-3 Tags from the user
   * Return a template with Tags filled in.
   * Rules:
   * - Warmup is always Cardio
   * - Kloubni rotace is always Stretch
   * - HSS a Záda is always HSS and Záda
   * - HSS nebo břicho is always HSS and Břicho
   * - Strength exercises are filled with random tags from the input list and the rest of the tags
   * - Stretch is always Stretch
   *
   * Strength exercises should include every tag at least once.
   * */
  const fillTemplateWithTags = ({
    inputChipList,
    roundTemplate,
    debug = false,
  }: {
    inputChipList: Tag[];
    roundTemplate: any;
    debug: boolean;
  }) => {
    debug &&
      console.debug("fillTemplateWithTags input", inputChipList, roundTemplate);
    const focus: Tag[] = inputChipList;
    const allTags = autocompleteTag.map((tag) => tag.value) as Tag[];
    let nonFocus = allTags.filter((tag: Tag) => !focus.includes(tag));

    const getRandomTagAndPop = (tags: Tag[]) => {
      const randomTag = tags[Math.floor(Math.random() * tags.length)];
      nonFocus = tags.filter((tag) => tag !== randomTag);
      return randomTag;
    };

    const getRandomTag = (tags: Tag[]) => {
      return tags[Math.floor(Math.random() * tags.length)];
    };

    const templateWithTags = roundTemplate.map((round: RoundTemplate) => {
      if (round.type === "warmup") {
        return { tags: ["Cardio"], ...round };
      }
      if (round.name === "kloubni rotace") {
        return { tags: ["Stretch"], ...round };
      }
      if (round.name === "HSS a Záda") {
        return { tags: ["Záda", "HSS"], ...round };
      }
      if (round.name === "HSS nebo břicho") {
        return { tags: ["HSS", "Břicho"], ...round };
      }
      if (round.type === "strength") {
        return {
          tags: [getRandomTag(focus), getRandomTagAndPop(nonFocus)],
          ...round,
        };
      }
      if (round.type === "stretch") {
        return { tags: ["Stretch"], ...round };
      }
    });
    debug && console.debug("templateWithTags output", templateWithTags);
    return templateWithTags;
  };

  const fillTemplateWithExercises = ({
    debug,
    templateWithTags,
  }: {
    debug: boolean;
    templateWithTags: any;
  }) => {
    debug && console.debug("fillTemplateWithExercise input", templateWithTags);
    const filledTemplate = templateWithTags.map((round: TemplateWithTags) => {
      if (round.name === "kloubni rotace") {
        return round;
      }
      if (round.type === "warmup") {
        return {
          exercises: findExercisesByType({
            type: "Cardio",
            numberOfExercises: round.exercisesAmount,
            allExercises,
          }),
          ...round,
        };
      }
      if (round.type === "stretch") {
        return {
          exercises: findExercisesByType({
            type: "Stretch",
            numberOfExercises: round.exercisesAmount,
            allExercises,
          }),
          ...round,
        };
      }
      return {
        exercises: findExercisesByTag({
          allExercises,
          tags: round.tags,
          numberOfExercises: round.exercisesAmount,
          debug,
        }),
        ...round,
      };
    });
    debug && console.info("fillTemplateWithExercise output", filledTemplate);
    return filledTemplate;
  };
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
    (templateWithTags = fillTemplateWithTags({
      debug,
      inputChipList,
      roundTemplate,
    }))}>Regime template</button
>

<button
  class="btn variant-filled-primary"
  on:click={() =>
    (filledTemplate = fillTemplateWithExercises({ debug, templateWithTags }))}
  >Populate template</button
>
<div class="flex" style="flex-wrap: wrap;">
  {#each tabataRegime as exercise, index}
    <div class="card m-5 w-20vw" style="width: 20vw">
      <header class="card-header">Round {index + 1}</header>
      <section class="p-4">{exercise.name}</section>
      <footer class="card-footer">{exercise.type}</footer>
    </div>
  {/each}
</div>

<h2 class="h2">Template with Tags</h2>

<div class="flex" style="flex-wrap: wrap;">
  {#each templateWithTags as round, index}
    <div class="card m-5 w-20vw" style="width: 20vw">
      <header class="card-header">{round.name}</header>
      <section class="p-4">
        <p>Typ: {round.type}</p>
        <p>Počet cviků: {round.exercisesAmount}</p>
      </section>
      <footer class="card-footer">Tagy: {round.tags.join(", ")}</footer>
    </div>
  {/each}
</div>

<h2 class="h2">Template with Exercises</h2>

{#each filledTemplate as exercise, index}
  <h3 class="h3">{exercise.name}</h3>
  <p><strong>Typ:</strong> {exercise.type}</p>
  <p><strong>Počet cviků:</strong> {exercise.exercisesAmount}</p>
  <p><strong>Tagy:</strong> {exercise.tags.join(", ")}</p>
  {#if exercise.exercises}
    <ol class="list m-4">
      {#each exercise.exercises as foo, index}
        <li>
          <span class="badge-icon p-4 variant-soft-primary">{index + 1}</span>
          <span>{foo.substitution ? `⚠️ ${foo.name}` : foo.name}</span>
        </li>
      {/each}
    </ol>
  {/if}
  <hr />
{/each}
