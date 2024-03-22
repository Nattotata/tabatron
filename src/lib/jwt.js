import jwt from "jsonwebtoken";
import "dotenv/config";

// import type { Jwt } from "@types/jsonwebtoken"


const getPw = () => {
    const PW = process.env.JWT_PW
    if (!PW){
        throw new Error("Can't access JWT signing pw.")
    }
    return PW
}

export const signToken = (props) => {
    return jwt.sign( {...props}, getPw(), {expiresIn: "7d"})
}

export const verifyToken = (token) => {
    return jwt.verify(token, getPw())
}
