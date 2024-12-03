import { Router } from "express";
import sheetController from "../../controllers/sheets.controller";
import { auth } from "../../middlewares/auth.middleware";

const route = Router();

route.get("/", auth, sheetController.getResultsAllInfor);
route.post("/add", auth, sheetController.addSheet);
route.get("/:id", auth, sheetController.getDetail);
route.put("/delete/:id", auth, sheetController.delete);
route.post("/combine", auth, sheetController.combine);

export default route;
