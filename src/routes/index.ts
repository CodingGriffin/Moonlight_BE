import { Router } from "express";
import usersRoute from "./api/users.routes";
import uploadRoute from "./api/upload.routes";
import searchRoute from "./api/search.routes";
import resultRoute from "./api/result.routes";

const route = Router();
route.use("/user", usersRoute);
route.use("/upload", uploadRoute);
route.use("/search", searchRoute);
route.use("/result", resultRoute);

export default route;
