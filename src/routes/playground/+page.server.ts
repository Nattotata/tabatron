import { sql } from "@vercel/postgres";
import "dotenv/config"

const populateDb = async () => {
    try {
        const result = await sql`CREATE TABLE Pets ( Name varchar(255), Owner varchar(255) );`;
        console.info("tadaa!", result)
        return result
    } catch (error) {
        return console.error("not tada", error)
    }
        
}
const addData = async () => {
    try {
        await sql`INSERT INTO Pets (Name, Owner) VALUES (${"Lenka"}, ${"Čimpouš"});`
    } catch(e){
    console.error(e)
}
}

export async function load({ locals }) {
    // populateDb()
    // addData()
    try {
        const foo = await sql`SELECT * from Pets;`
        console.info(foo)
        return foo
    } catch {
        console.error('hmm?')
    }
}
