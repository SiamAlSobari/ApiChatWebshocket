import Elysia from "elysia";
import { AuthModel } from "./model";
import { ApiResponseModel } from "../../utils/response/model";
import { ApiResponse } from "../../utils/response/api";
import { authMiddleware } from "../../utils/middlewares/auth.middleware";
import { AuthRepository } from "./repository";
import { AuthService } from "./service";

const authRepo = new AuthRepository();
const authService = new AuthService(authRepo);
export const Auth = new Elysia({ prefix: "/auth" })
    .post("/register", ({ body }) => {
        return { message: "User registered successfully" };
    })
    .post("/login", ({ body }) => {
        console.log(body);
        return new ApiResponse(null, `User logged in successfully ${body.email}`, 200);
    },{
        body: AuthModel.loginUser,
        response: ApiResponseModel
    })
    // Protected route example
    .group("",(app) => 
        app.use(authMiddleware)
        .get("/profile", ({ user }) => {
            return { user };
        })
    )