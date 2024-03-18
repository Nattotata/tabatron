import "dotenv/config";
import fs from "fs";

const url = process.env.SHEET_URL;

const fetch_data = async () => {
  const res = await fetch(url);
  const item = await res.json();
  console.info(item);
  return item;
};

const save_data = async () => {
  const data = await fetch_data();
  const jsonString = JSON.stringify(data, null, 2);
  fs.writeFileSync("./src/routes/tabata/data.json", jsonString, (err) => {
    if (err) {
      console.error("Error writing a file: ", err);
    } else {
      console.info("Data saved successfully!");
    }
  });
};

save_data();
