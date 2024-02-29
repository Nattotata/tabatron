<script lang="ts">
  import { InputChip, Autocomplete } from "@skeletonlabs/skeleton";
  import type { AutocompleteOption } from "@skeletonlabs/skeleton";
  import type { Tag, Exercise, Round } from "./types";

  export let data;
  const exercises: Exercise[] = data.exercises;

  let inputChip = "";
  let inputChipList: Tag[] = [];

  function onInputChipSelect(event: CustomEvent): void {
    if (inputChipList.includes(event.detail.value) === false) {
      inputChipList = [...inputChipList, event.detail.value];
      inputChip = "";
    }
  }

  const rounds: Round[] = [
    "warmup",
    "kloubni rotace",
    "nadstavba",
    "nadstavba",
    "nadstavba",
    "stretch",
    "stretch",
    "stretch",
    "cooldown",
  ];

  type Type = "Cardio" | "Strength" | "Stretch" | "Cooldown";
  type RoundTemplate = {
    name?: string;
    tags?: Tag[] | Tag | "";
    type?: Type;
    exercises?: number;
    tabataIntervals?: boolean;
    time?: number;
    repeats?: number;
  };

  const roundTemplate = [
    {
      name: "Warmup",
      type: "warmup",
      tabataIntervals: true,
      time: 240,
      exercises: 4,
      repeats: 2,
    },
    {
      name: "kloubni rotace",
      type: "stretch",
      tabataIntervals: false,
      time: 180,
    },
    {
      name: "HSS a Záda",
      tabataIntervals: true,
      time: 240,
      exercises: 4,
      repeats: 2,
      type: "stretch",
    },
    {
      name: "HSS nebo břicho",
      tabataIntervals: true,
      time: 240,
      exercises: 4,
      repeats: 2,
      type: "stretch",
    },
    {
      name: "Round 5",
      type: "strength",
      tabataIntervals: true,
      time: 240,
      exercises: 2,
      repeats: 4,
    },
    {
      name: "Round 6",
      type: "strength",
      tabataIntervals: true,
      time: 240,
      exercises: 2,
      repeats: 4,
    },
    {
      name: "Round 7",
      type: "strength",
      tabataIntervals: true,
      time: 240,
      exercises: 2,
      repeats: 4,
    },
    {
      name: "Round 8",
      type: "strength",
      tabataIntervals: true,
      time: 240,
      exercises: 2,
      repeats: 4,
    },
    {
      name: "Round 9",
      type: "strength",
      tabataIntervals: true,
      time: 240,
      exercises: 2,
      repeats: 4,
    },
    {
      name: "Round 10",
      type: "stretch",
      tabataIntervals: false,
      time: 300,
      exercises: 2,
    },
  ];
  let tabataRegime: Exercise[] = [];
  let emptyRegimeWithTags = [];
  let populatedRegime = [];

  const autocompleteTag: AutocompleteOption<string>[] = [
    {
      label: "Komplexní",
      value: "Komplexní",
    },
    {
      label: "Stehna",
      value: "Stehna",
    },
    {
      label: "Lýtka",
      value: "Lýtka",
    },
    {
      label: "Hýždě",
      value: "Hýždě",
    },
    {
      label: "Prsa",
      value: "Prsa",
    },
    {
      label: "Břicho",
      value: "Břicho",
    },
    {
      label: "Záda",
      value: "Záda",
    },

    {
      label: "HSS",
      value: "HSS",
    },

    {
      label: "Biceps",
      value: "Biceps",
    },
    {
      label: "Triceps",
      value: "Triceps",
    },
    {
      label: "Zápěstí",
      value: "Zápěstí",
    },
    {
      label: "Ramena",
      value: "Ramena",
    },
  ];

  /** */
  const generateEmptyRegime = (inputChipList: Tag[]) => {
    let focus: Tag[] = inputChipList;
    const allTags: Tag[] = autocompleteTag.map((tag) => tag.value);
    let nonFocus = allTags.filter((tag: Tag) => !focus.includes(tag));
    console.debug("allTags", allTags);
    console.debug("focus", focus);
    console.debug("non focus", nonFocus);

    const getRandomTagAndPop = (tags: Tag[]) => {
      const randomTag = tags[Math.floor(Math.random() * tags.length)];
      nonFocus = tags.filter((tag) => tag !== randomTag);
      return randomTag;
    };

    const getRandomTag = (tags: Tag[]) => {
      return tags[Math.floor(Math.random() * tags.length)];
    };

    emptyRegimeWithTags = roundTemplate.map((round, index) => {
      if (round.type === "warmup") {
        return { tag: ["Cardio"], ...round };
      }
      if (round.name === "kloubni rotace") {
        return { tag: ["Stretch"], ...round };
      }
      if (round.name === "HSS a Záda") {
        return { tag: ["Záda", "HSS"], ...round };
      }
      if (round.name === "HSS nebo břicho") {
        return { tag: ["HSS", "Břicho"], ...round };
      }
      if (round.type === "strength") {
        return {
          tag: [getRandomTag(focus), getRandomTagAndPop(nonFocus)],
          ...round,
        };
      }
      if (round.type === "stretch") {
        return { tag: ["Stretch"], ...round };
      }
    });
  };

  const findExercisesByTag = (tag: Tag[], numberOfExercises: number) => {
    const arr = Array.from({ length: numberOfExercises }, (item, index) => {
      const currentTag = tag[index];
      const filteredExercises = exercises.filter((exercise: Exercise) =>
        exercise.tags.includes(currentTag)
      );
      if (filteredExercises.length === 0) {
        return "No exercises found";
      }
      return filteredExercises[
        Math.floor(Math.random() * filteredExercises.length)
      ];
    });
    console.info(arr);
    return arr;
  };

  const findExercisesByType = (type: string, numberOfExercises: number) => {
    const arr = Array.from({ length: numberOfExercises }, (item, index) => {
      const filteredExercises = exercises.filter(
        (exercise: Exercise) => exercise.type === type
      );
      if (filteredExercises.length === 0) {
        return "No exercises found";
      }
      return filteredExercises[
        Math.floor(Math.random() * filteredExercises.length)
      ];
    });
    console.info(arr);
    return arr;
  };

  const populateRegime = () => {
    populatedRegime = emptyRegimeWithTags.map((round) => {
      if (round.name === "kloubni rotace") {
        return round;
      }
      if (round.type === "warmup") {
        return {
          actualExercises: findExercisesByType("Cardio", round.exercises),
          ...round,
        };
      }
      return {
        actualExercises: findExercisesByTag(round.tag, round.exercises),
        ...round,
      };
    });
    console.info("populated regime", populatedRegime);
  };
  const generateTabataRegime = (inputChipList: Tag[]) => {
    tabataRegime = [];
    let inputTags = inputChipList;

    const warmups = exercises.filter(
      (exercise: Exercise) => exercise.type === "Cardio"
    );
    const stretches = exercises.filter(
      (exercise: Exercise) => exercise.type === "Stretch"
    );
    const strengths = exercises.filter(
      (exercise: Exercise) => exercise.type === "Strength"
    );
    const cooldowns = exercises.filter(
      (exercise: Exercise) => exercise.type === "Cooldown"
    );

    const getRandomExercise = (exercises: Exercise[]) => {
      return exercises[Math.floor(Math.random() * exercises.length)];
    };
    rounds.map((round) => {
      switch (round) {
        case "warmup":
          tabataRegime.push(getRandomExercise(warmups));
          break;
        case "stretch":
          tabataRegime.push(getRandomExercise(stretches));
          break;
        case "nadstavba":
          if (!inputTags) {
            tabataRegime.push(getRandomExercise(strengths));
          }
          if (inputTags.length === 1) {
            tabataRegime.push(
              getRandomExercise(
                strengths.filter((exercise: Exercise) =>
                  exercise.tags.includes(inputTags[0])
                )
              )
            );
          }
          if (inputTags.length > 1) {
            // If there's more than one tag, pick a random exercise with the first tag,
            // then remove the tag from the list.
            // This increases the odds that all tags are represented
            const currentExercise = getRandomExercise(
              strengths.filter((exercise: Exercise) =>
                exercise.tags.includes(inputTags[0])
              )
            );
            tabataRegime.push(currentExercise);
            inputTags = inputTags.slice(1);
          }
          break;
        case "cooldown":
          tabataRegime.push(getRandomExercise(cooldowns));
          break;
        default:
          break;
      }
    });
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
  on:click={() => generateTabataRegime(inputChipList)}>Generuj</button
>

<button
  class="btn variant-filled-primary"
  on:click={() => generateEmptyRegime(inputChipList)}>Regime template</button
>

<button class="btn variant-filled-primary" on:click={() => populateRegime()}
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

<h2 class="h2">Regime template</h2>

<div class="flex" style="flex-wrap: wrap;">
  {#each emptyRegimeWithTags as round, index}
    <div class="card m-5 w-20vw" style="width: 20vw">
      <header class="card-header">{round.name}</header>
      <section class="p-4">
        Typ: {round.type} Počet cviků: {round.exercises}
      </section>
      <footer class="card-footer">Tagy: {round.tag.join(", ")}</footer>
    </div>
  {/each}
</div>

<h2 class="h2">Exercises</h2>

{#each populatedRegime as exercise, index}
  <h3 class="h3">{exercise.name}</h3>
  <p><strong>Typ:</strong> {exercise.type}</p>
  <p><strong>Počet cviků:</strong> {exercise.exercises}</p>
  <p><strong>Tagy:</strong> {exercise.tag.join(", ")}</p>
  {#if exercise.actualExercises}
    <ol class="list m-4">
      {#each exercise.actualExercises as foo, index}
        <li>
          <span class="badge-icon p-4 variant-soft-primary">{index + 1}</span>
          <span>{foo.name}</span>
        </li>
      {/each}
    </ol>
  {/if}
  <hr />
{/each}
