import jwt from "jsonwebtoken";

const token = jwt.sign({ foo: "bar" }, "kek");
console.info(token)
