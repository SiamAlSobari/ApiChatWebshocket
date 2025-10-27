import Elysia from "elysia";
import { authMiddleware } from "../../utils/middlewares/auth.middleware";
import { ApiResponse } from "../../utils/response/api";
import { ChatRepository } from "./repository";
import { ChatService } from "./service";
import { ChatModel } from "./model";
import { ApiResponseModel } from "../../utils/response/model";

const chatRepo = new ChatRepository();
const chatService = new ChatService(chatRepo);
export const chatController = new Elysia({ prefix: "/chat" })
    .use(authMiddleware)
    .get("/", ({ user }) => {
        return new ApiResponse({ user }, `User logged in successfully`, 200);
    })
    .post("/room", async ({ user, body }) => {
        const chatRoom = await chatService.createPrivateChatRoom(user.id, body.userIdReceiver);
        return new ApiResponse({ chatRoom }, `Chat room created successfully`, 200);
    },{
        body: ChatModel.createChatRoom,
        response: ApiResponseModel
    })