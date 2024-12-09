import { Router } from "express";
import emailController from "../../controllers/email.controller";
import { auth } from "../../middlewares/auth.middleware";

const route = Router();

route.get("/", auth, emailController.getEmailsAllInfor);
route.post("/send_email", auth, emailController.sendEmail);
route.get("/create", emailController.createEmail);

export default route;
