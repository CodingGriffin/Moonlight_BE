import { Router } from "express";
import resultController from "../../controllers/results.controller";
import { auth } from "../../middlewares/auth.middleware";

const route = Router();

route.get("/", resultController.getResultsAllInfor);
route.put("/favorite", resultController.favoriteResult);
route.post("/save", resultController.saveResults);
route.post("/export", resultController.export);

export default route;
