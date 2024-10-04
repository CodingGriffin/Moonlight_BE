import { Router } from "express";
import usersRoute from "./api/users.routes";
import uploadRoute from "./api/upload.routes";
import searchRoute from "./api/search.routes";

const route = Router();
route.use("/user", usersRoute);
route.use("/upload", uploadRoute);
route.use("/search", searchRoute);

export default route;
