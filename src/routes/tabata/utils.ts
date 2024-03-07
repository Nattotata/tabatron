import type { Tag, Exercise, RoundTemplate, FilledTemplate, TemplateWithTags } from "./types";

export const findExercisesByTag = ({
    tags,
    numberOfExercises,
    debug = false,
    allExercises
  }: {
    tags: Tag[];
    numberOfExercises: number;
    debug?: boolean;
    allExercises: Exercise[];
  }) => {
    debug && console.debug("findExerciseByTag input", tags, numberOfExercises);
    const backupExercises = allExercises.filter((exercise: Exercise) =>
      exercise.tags.includes("Komplexní")
    );
    const arr = Array.from({ length: numberOfExercises }, (item, index) => {
      const currentTag = tags[index % tags.length];
      debug && console.debug("Looking for exercise with tag", currentTag)
      currentTag === undefined && console.warn("Tag is undefined", tags, index % tags.length);
      const filteredExercises = allExercises.filter((exercise: Exercise) =>
        exercise.tags.includes(currentTag)
      );
      if (filteredExercises.length === 0) {
        const backupExercise = backupExercises[
          Math.floor(Math.random() * backupExercises.length)
        ]
        backupExercise.substitution = true;
        console.warn("No exercise found for tag", currentTag)
        console.warn("Using backup exercise", backupExercise)
        console.warn("Tags:", tags)
        return backupExercise;
      }
      return filteredExercises[
        Math.floor(Math.random() * filteredExercises.length)
      ];
    });
    debug && console.debug("findExerciseByTag output", arr);
    return arr;
  };

export const findExercisesByTags = ({
  tags,
  allExercises
}: {
  tags: Tag[];
  allExercises: Exercise[];
}) => {
  return tags
    .reduce((acc: any, tag: any) => {
      return [...acc,
        ...allExercises
          .filter((exercise: Exercise) => exercise.tags.includes(tag))]
    }, [])
}

export const findSingleExerciseByTag = ({tag, allExercises}: {tag: Tag, allExercises: Exercise[]}) => {
  const filteredExercises = allExercises.filter((exercise: Exercise) =>
    exercise.tags.includes(tag)
  );
  return filteredExercises[Math.floor(Math.random() * filteredExercises.length)];
}

export const findExercisesByType = ({
    type,
    numberOfExercises,
    allExercises,
    debug = false
  }: {
    type: string;
    numberOfExercises: number;
    allExercises: Exercise[];
    debug?: boolean;
  }) => {
    const filteredExercises = allExercises.filter(
      (exercise: Exercise) => exercise.type === type
    );
    const arr = Array.from({ length: numberOfExercises }, () => {
      return filteredExercises[
        Math.floor(Math.random() * filteredExercises.length)
      ];
    });
    debug && console.info(arr);
    return arr;
  };


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
export const fillTemplateWithTags = ({
    inputChipList,
    roundTemplate,
    debug = false,
    tagOptions }: {
    inputChipList: Tag[];
    roundTemplate: any;
    debug: boolean;
    tagOptions: any;

  }) => {
    debug &&
      console.debug("fillTemplateWithTags input", inputChipList, roundTemplate);
    const focus: Tag[] = inputChipList;
    const allTags = tagOptions.map((tag) => tag.value) as Tag[];
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

export const findExerciseByName = ({name, allExercises}: {name: string, allExercises: Exercise[]}) => {
    return allExercises.find((exercise: Exercise) => exercise.name === name);
  }

export const fillTemplateWithExercises = ({
    debug,
    templateWithTags,
    allExercises
  }: {
    debug: boolean;
    templateWithTags: any;
    allExercises: Exercise[];
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

export const printSection = ({ identifier }: { identifier: string }) => {
    if (!identifier) return;
    const content = document.getElementById(identifier).innerHTML;
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.body.innerHTML = content;
    iframe.contentWindow.print();
    document.body.removeChild(iframe);
  }

// TODO: FIX IMPURE
export const getTodaysDate = () => new Date()
  .toLocaleDateString("cs", {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  })
  .replaceAll("/", ".")