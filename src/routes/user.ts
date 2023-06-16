import express from "express";
const router = express.Router();
import { getAllUsers, loginUser, signupUser } from "../controllers/user";
import { isAuth } from "../middlewares/is-auth";
import { validateLogin, validateSignup } from "../middlewares/validation";

router.get("/users", isAuth, getAllUsers);
router.post("/login", validateLogin, loginUser);
router.post("/signup", validateSignup, signupUser);

export default router;
