import { Router } from "express";
import resultController from "../../controllers/results.controller";
import { auth } from "../../middlewares/auth.middleware";

const route = Router();

route.get("/", auth, resultController.getResultsAllInfor);
route.get("/favorite", auth, resultController.getFavoriteResults);
route.put("/favorite/:id", auth, resultController.favoriteResult);
route.put("/unfavorite/:id", auth, resultController.unfavoriteResult);
route.post("/save", auth, resultController.saveResults);
route.post("/export", resultController.export);

export default route;
