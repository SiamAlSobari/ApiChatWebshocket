import Elysia from "elysia";
import { GroupRepository } from "./repository";
import { GroupService } from "./service";
import { GroupModel } from "./model";
import { ApiResponseModel } from "../../utils/response/model";
import { ApiResponse } from "../../utils/response/api";
import { HttpStatus } from "../../utils/response/statusCode";

const groupRepo = new GroupRepository();
const groupService = new GroupService(groupRepo);
export const groupController = new Elysia({prefix: "/group"})
    .get("/", () => "Hello Elysia")
    .post("/", async ({ body }) => {
        const group = await groupService.createGroup(body.group_id,body.group_name);
        return new ApiResponse(group, `Data group berhasil di buat`, HttpStatus.CREATED);
    },{
        body: GroupModel.createGroup,
        response: ApiResponseModel
    })
    