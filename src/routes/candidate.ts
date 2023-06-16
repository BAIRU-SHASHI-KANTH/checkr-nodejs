import express from "express";
const router = express.Router();
import {
  getAllCandidates,
  addCandidate,
  getCandidateById,
  addAdverseAction,
} from "../controllers/candidate";
import { isAuth } from "../middlewares/is-auth";
import {
  validateAddCandidate,
  validateSendAdverseAction,
} from "../middlewares/validation";

router.get("/candidates", isAuth, getAllCandidates);
router.post("/candidate", isAuth, validateAddCandidate, addCandidate);
router.get("/candidate/:candidateId", isAuth, getCandidateById);
router.post(
  "/candidate/adverse-action",
  isAuth,
  validateSendAdverseAction,
  addAdverseAction
);

export default router;
