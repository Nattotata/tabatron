import type { PageLoad } from "./$types";
import { mock_data } from "./data";

const usingMockData = true;

const consolidateTags = (input: any) => {
  return {
    name: input["Název"],
    description: input["Popis"],
    type: input["Typ"],
    tags: [input["Tag 1"], input["Tag 2"], input["Tag 3"]].filter((tag) => tag),
  };
};

// link to spreadsheet with data
// in .env file now
const url = ""
export const load: PageLoad = async ({ fetch, params }) => {
  if (usingMockData) {
    return { exercises: mock_data };
  }
  const res = await fetch(url);
  const item = await res.json();
  const exercises = item.map((exercise: any) => consolidateTags(exercise));

  return { exercises };
};
