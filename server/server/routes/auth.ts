import { Router } from "express";
import { register } from "../services/user.service";
import { login } from "../services/user.service";

const router = Router();

router.post("/register", register);
router.post("/login", login);

export default router;
