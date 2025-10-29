import Elysia from "elysia";
import { AuthModel } from "./model";
import { ApiResponseModel } from "../../utils/response/model";
import { ApiResponse } from "../../utils/response/api";
import { authMiddleware } from "../../utils/middlewares/auth.middleware";
import { AuthRepository } from "./repository";
import { AuthService } from "./service";
import jwt from "@elysiajs/jwt";
import { SECRET_KEY } from "../../utils/constant/secret";
import { HttpStatus } from "../../utils/response/statusCode";

const authRepo = new AuthRepository();
const authService = new AuthService(authRepo);
export const authController = new Elysia({ prefix: "/auth" })
    .use(jwt({
        secret: SECRET_KEY,
        name: "jwt"
    }))
    .post("/register", ({ body }) => {
        return { message: "User registered successfully" };
    })
    .post("/login", async ({ body, cookie: { token }, jwt }) => {
        const user = await authService.loginUser(body.email, body.password);
        const jwtToken = await jwt.sign({ 
            id: user.id, 
            exp: new Date().getTime() + 60 * 60 * 24 * 365 // 1 year in seconds
        });
        token.set({
            value: jwtToken,
            maxAge: 60 * 60 * 24 * 365,
            path: "/",
            httpOnly: true
        });
        return new ApiResponse({ token: jwtToken }, `User logged in successfully`, HttpStatus.SUCCESS);
    },{
        body: AuthModel.loginUser,
        response: ApiResponseModel
    })
    .group("",(app) => 
        app.use(authMiddleware)
        .get("/session", ({ user }) => {
            return new ApiResponse({ user }, `User logged in successfully`, HttpStatus.SUCCESS);
        },{
            response: ApiResponseModel
        })
    )