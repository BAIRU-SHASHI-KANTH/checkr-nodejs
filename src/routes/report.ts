import { Router } from "express";
import { getReport, addReport } from "../controllers/report.";
import { isAuth } from "../middlewares/is-auth";
import { validateAddReport } from "../middlewares/validation";
const router: Router = Router();

router.get("/reports/:candidateId", isAuth, getReport);
router.post("/report", isAuth, validateAddReport, addReport);

export default router;
