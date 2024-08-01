import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import videorouter from "../services/videoupload";
import streamRouter from "../services/videoStream";
import profileRoutes from "./profile.routes";
import searchrouter from "../services/search";
import liveStream from "../services/liveStream";

const router = Router();

router.use("/search", searchrouter);
router.use("/auth", authRoutes);
router.use("/videos", videorouter);
router.use("/users", userRoutes);
router.use("/stream", streamRouter);
router.use("/livestream", liveStream);
router.use(profileRoutes);

export default router;
