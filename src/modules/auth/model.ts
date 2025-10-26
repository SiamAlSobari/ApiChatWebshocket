import { t } from "elysia";

export const AuthModel = {
    registerUser: t.Object({
        email: t.String(),
        password: t.String(),
    }),

    loginUser: t.Object({
        email: t.String(),
        password: t.String(),
    }),
};
