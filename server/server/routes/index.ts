import { Router } from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import videorouter from "../controllers/videoupload";
import streamRouter from "../controllers/videoStream";
import profileRoutes from "./profileRoutes";
import searchrouter from "../controllers/searchController";
import liveStream from "../controllers/liveStream";

const router = Router();

router.use("/search", searchrouter);
router.use("/auth", authRoutes);
router.use("/videos", videorouter);
router.use("/users", userRoutes);
router.use("/stream", streamRouter);
router.use("/livestream", liveStream);
router.use(profileRoutes);

export default router;
