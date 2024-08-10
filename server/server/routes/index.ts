import { Router } from "express";
import authRoutes from "./auth";
import userRoutes from "./user";
import { videorouter, streamRouter } from "../services/video.service";
import profileRoutes from "./profile";
import searchrouter from "../utils/search";
import { livestream } from "../services/stream.service";

const router = Router();

router.use("/search", searchrouter);
router.use("/auth", authRoutes);
router.use("/videos", videorouter);
router.use("/users", userRoutes);
router.use("/stream", streamRouter);
router.use("/livestream", livestream);
router.use(profileRoutes);

export default router;
