import type { PageLoad } from "./$types";
import data from "./data.json";

const usingMockData = true;


function getRandomInt(min: number, max: number) {
  min = Math.ceil(min); // Round up the minimum value
  max = Math.floor(max); // Round down the maximum value
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getRandomTool = () => {
  const tools = ["tyčka", "činka", "overball", "krátký expander", "dlouhý expander", "yoga block", "schodíky", "kettle ball"]
  return tools[getRandomInt(0, tools.length)]
}


const consolidateTags = (input: any) => {
  return {
    name: input["Název"],
    description: input["Popis"],
    type: input["Typ"],
    tags: [input["Tag 1"], input["Tag 2"], input["Tag 3"]].filter((tag) => tag),
    tool: getRandomTool()
  };
};

const url = "";
export const load: PageLoad = async ({ fetch, params }) => {
  if (usingMockData) {
    const exercises = data.map((exercise: any) => consolidateTags(exercise));
    return { exercises };
  }
  const res = await fetch(url);
  const item = await res.json();
  const exercises = item.map((exercise: any) => consolidateTags(exercise));

  return { exercises };
};
