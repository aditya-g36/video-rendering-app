import { Router } from "express";
import { register } from "../services/authRegister";
import { login } from "../services/authRegister";

const router = Router();

router.post("/register", register);
router.post("/login", login);

export default router;
