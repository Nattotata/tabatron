import { writable } from 'svelte/store';
import type { FilledTemplate, TemplateWithTags } from './types';

export const templateWithTags = writable<TemplateWithTags[]>([]);
export const templateWithExercises = writable<FilledTemplate[]>([]);