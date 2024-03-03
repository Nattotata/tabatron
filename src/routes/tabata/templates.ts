import type { AutocompleteOption } from "@skeletonlabs/skeleton";
import type { RoundTemplate } from "./types";

export const roundTemplate: RoundTemplate[] = [
  {
    name: "Warmup",
    type: "warmup",
    tabataIntervals: true,
    time: 240,
    exercisesAmount: 4,
    repeats: 2,
  },
  {
    name: "kloubni rotace",
    type: "stretch",
    tabataIntervals: false,
    exercisesAmount: 2,
    time: 180,
  },
  {
    name: "HSS a Záda",
    tabataIntervals: true,
    time: 240,
    exercisesAmount: 4,
    repeats: 2,
    type: "strength",
  },
  {
    name: "HSS nebo břicho",
    tabataIntervals: true,
    time: 240,
    exercisesAmount: 4,
    repeats: 2,
    type: "strength",
  },
  {
    name: "Round 5",
    type: "strength",
    tabataIntervals: true,
    time: 240,
    exercisesAmount: 2,
    repeats: 4,
  },
  {
    name: "Round 6",
    type: "strength",
    tabataIntervals: true,
    time: 240,
    exercisesAmount: 2,
    repeats: 4,
  },
  {
    name: "Round 7",
    type: "strength",
    tabataIntervals: true,
    time: 240,
    exercisesAmount: 2,
    repeats: 4,
  },
  {
    name: "Round 8",
    type: "strength",
    tabataIntervals: true,
    time: 240,
    exercisesAmount: 2,
    repeats: 4,
  },
  {
    name: "Round 9",
    type: "strength",
    tabataIntervals: true,
    time: 240,
    exercisesAmount: 2,
    repeats: 4,
  },
  {
    name: "Round 10",
    type: "stretch",
    tabataIntervals: false,
    time: 300,
    exercisesAmount: 2,
  },
];

export const autocompleteTag: AutocompleteOption<string>[] = [
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
