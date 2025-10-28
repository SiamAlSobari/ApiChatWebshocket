import Elysia from "elysia";
import { authMiddleware } from "../../utils/middlewares/auth.middleware";
import { ContactRepository } from "./repository";
import { ContactSevice } from "./service";
import { ContactModel } from "./model";
import { ApiResponseModel } from "../../utils/response/model";
import { ApiResponse } from "../../utils/response/api";

const contactRepo = new ContactRepository();
const contactService = new ContactSevice(contactRepo);
export const contactController = new Elysia({ prefix: "/contact" })
    .use(authMiddleware)
    .post("/", async ({ user, body }) => {
        const contact = await contactService.createContact(body.contact_name, body.contact_id, user.id);
        return new ApiResponse(contact, `Data contact berhasil di tambahkan`, 200);
    },{
        body: ContactModel.createContact,
        response: ApiResponseModel
    })
    .get("/", async ({ user }) => {
        const contact = await contactService.getContact(user.id);
        return new ApiResponse( contact, `Data contact berhasil diambil`, 200);
    },{
        response: ApiResponseModel
    })

