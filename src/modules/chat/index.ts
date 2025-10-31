import Elysia from "elysia";
import { authMiddleware } from "../../utils/middlewares/auth.middleware";
import { ApiResponse } from "../../utils/response/api";
import { ChatRepository } from "./repository";
import { ChatService } from "./service";
import { ChatModel } from "./model";
import { ApiResponseModel } from "../../utils/response/model";
import { HttpStatus } from "../../utils/response/statusCode";

const chatRepo = new ChatRepository();
const chatService = new ChatService(chatRepo);
export const chatController = new Elysia({ prefix: "/chat" })
    .use(authMiddleware)
    .get("/", ({ user }) => {
        return new ApiResponse({ user }, `User logged in successfully`, HttpStatus.SUCCESS);
    })
    .post("/private/room", async ({ user, body }) => {
        const chatRoom = await chatService.createPrivateChatRoom(user.id, body.userIdReceiver);
        return new ApiResponse({ chatRoom }, `Chat room created successfully`, HttpStatus.CREATED);
    },{
        body: ChatModel.createChatRoom,
        response: ApiResponseModel
    })
    .get("/room", async ({ user }) => {
        const chatRoom = await chatService.getChatRoom(user.id);
        return new ApiResponse({ chatRoom }, `Chat room created successfully`, HttpStatus.SUCCESS);
    })