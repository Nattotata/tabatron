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
};

export type Round =
  | "warmup"
  | "stretch"
  | "kloubni rotace"
  | "nadstavba"
  | "cooldown";
