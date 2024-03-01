import type { Tag, Exercise, RoundTemplate, FilledTemplate } from "./types";


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
      console.debug("Looking for exercise with tag", currentTag)
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