import { Router } from "express";
import { getCourtSearch, addCourtSearch } from "../controllers/courtSearch";
import { isAuth } from "../middlewares/is-auth";
import { validateAddCourtSearch } from "../middlewares/validation";
const router: Router = Router();

router.get("/court-searches/:candidateId", isAuth, getCourtSearch);
router.post("/court-search", isAuth, validateAddCourtSearch, addCourtSearch);

export default router;
