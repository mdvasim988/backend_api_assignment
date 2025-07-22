import express from "express";
import formControllers from "../controllers/form.controllers.js";
import { wheelSpecsValidation, bogieChecksheetValidation } from "../middlewares/validation.middlewares.js";

const router = express.Router();

router.route("/wheel-specifications")
    .get(formControllers.handleGetWheelSpecifications)
    .post(wheelSpecsValidation, formControllers.handleCreateWheelSpecification)

router.route("/bogie-checksheet")
    .post(bogieChecksheetValidation, formControllers.handleCreateBogieChecksheet)

export default router;