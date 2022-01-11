import express from "express";
import userViewRoutes from "./userView.route";

const router = express.Router();

/**
 * GET /heatlh-check - Check health service
 */

router.get("/health-check", (req, res) => {
    return res.send("OK");
});


router.use("/userView", userViewRoutes);

export default router;