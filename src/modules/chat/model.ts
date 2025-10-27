import { t } from "elysia";

export const ChatModel = {
    createChatRoom: t.Object({
        userIdReceiver: t.String()
    }),
}