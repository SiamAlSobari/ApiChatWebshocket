import { t } from "elysia";

export const GroupModel = {
    createGroup: t.Object({
        group_name: t.String({minLength: 3, maxLength: 500}),
        group_id: t.String({minLength: 3, maxLength: 500}), 
    }),
}