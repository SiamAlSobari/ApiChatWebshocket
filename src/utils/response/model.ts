import { t } from "elysia";

export const ApiResponseModel = t.Object({
    statusCode: t.Number(),
    message: t.String(),
    data: t.Optional(t.Any())
});