import { config } from "dotenv";

config();
export const SECRET_KEY = process.env.SECRET_KEY!;