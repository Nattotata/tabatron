export type Tag =
  | "Stehna"
  | "Lýtka"
  | "Hýždě"
  | "Prsa"
  | "Břicho"
  | "Záda"
  | "HSS"
  | "Biceps"
  | "Triceps"
  | "Zápěstí"
  | "Ramena"
  | "Komplexní"
  | null;

export type Exercise = {
  name: string;
  description: string;
  type: "Cardio" | "Stretch" | "Strength" | "Cooldown";
  tags: Tag[];
  substitution?: boolean;
};

export type Round =
  | "warmup"
  | "stretch"
  | "kloubni rotace"
  | "nadstavba"
  | "cooldown";

export type RoundTemplate = {
  name: string;
  type: "warmup" | "stretch" | "strength";
  tabataIntervals: boolean;
  time: number;
  exercisesAmount: number;
  repeats?: number;
};

export type TemplateWithTags = RoundTemplate & { tags: Tag[] };

export type FilledTemplate = TemplateWithTags & { exercises: Exercise[] };
