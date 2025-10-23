import { Hono } from "hono";
import { authMiddleware } from "../../common/middlewares/AuthMiddleware";
import { zValidator } from "@hono/zod-validator";
import { createContactValidation } from "../validations/ContactValidation";
import { ContactRepository } from "../repositories/ContactRepository";
import { ContactService } from "../services/ContactService";

const contactRepo = new ContactRepository();
const contactService = new ContactService(contactRepo);
export const contactController = new Hono();

contactController.post("/",zValidator('json',createContactValidation),authMiddleware,async (c) => {
    const payload = c.req.valid("json");
    const user = c.get("user");
    const contact = await contactService.createContact(user.id, payload.contact_id, payload.contact_name);
    return c.json({
        "message": "Contact created successfully",
        "data": contact
    }, 201);
})