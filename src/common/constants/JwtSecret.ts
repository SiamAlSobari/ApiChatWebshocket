import { config } from "dotenv"
import { SignatureKey } from "hono/utils/jwt/jws"

config()
export const JWT_SECRET = process.env.JWT_SECRET as SignatureKey  // "secret key"