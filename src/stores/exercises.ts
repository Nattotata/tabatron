import { writable } from "svelte/store";
import type {
  FilledTemplate,
  TemplateWithTags,
} from "../routes/tabata/types";

export const templateWithTags = writable<
  TemplateWithTags[]
>([]);
export const templateWithExercises = writable<
  FilledTemplate[]
>([]);
