import { Router } from "express";
import searchController from "../../controllers/search.controller";
import { auth } from "../../middlewares/auth.middleware";

const route = Router();

route.get("/search", searchController.search);

export default route;
