import { sql } from "@vercel/postgres";
import "dotenv/config";
import bcrypt from "bcrypt";

const populateDb = async () => {
  try {
    const result =
      await sql`CREATE TABLE Pets ( Name varchar(255), Owner varchar(255) );`;
    console.info("tadaa!", result);
    return result;
  } catch (error) {
    return console.error("not tada", error);
  }
};
const addData = async () => {
  try {
    await sql`INSERT INTO Pets (Name, Owner) VALUES (${"Lenka"}, ${"Čimpouš"});`;
  } catch (e) {
    console.error(e);
  }
};

const createUsersTable = async () => {
  try {
    const result = await sql`CREATE TABLE users
          ( id SERIAL PRIMARY KEY,
          name varchar(255),
          email varchar(255),
          password text,
          salt text
        );`;
    console.info("tadaa!", result);
  } catch (e) {
    console.error(e);
  }
};

const createUser = async (pw: string, email: string) => {
  const salt = await bcrypt.genSalt();
  const hashedPw = await bcrypt.hash(pw, salt);
  try {
    await sql`INSERT INTO users (email, password) VALUES (${email}, ${hashedPw});`;
    console.info("🎉🎉🎉", `email: ${email}, password: ***********`);
  } catch (e) {
    console.error("not tada", e);
  }
};

const removeUser = async (email: string) => {
  try {
    const result = await sql`DELETE FROM users WHERE email = ${email};`;
  } catch (e) {
    console.error("not tada", e);
  }
};

const removeTable = async (tableName: string) => {
  try {
    const result = await sql`DROP TABLE users;`;
    console.info("🎉🎉🎉", result);
  } catch (e) {
    console.error("not tada", e);
  }
};

export async function load({ locals }) {
  // populateDb()
  // addData()
  // createUsersTable();
  //    storePassword('foobar', 'david@foo.com')
  //    storePassword('foobar', 'tobi@foo.com')
  //    storePassword('foobar', 'vava@foo.com')
  //    removeUser('tobi@foo.com')
  // removeTable("users");
  try {
    const foo = await sql`SELECT * from Pets;`;
    return foo;
  } catch {
    console.error("hmm?");
  }
}
