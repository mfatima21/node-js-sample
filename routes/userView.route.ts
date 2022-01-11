import { userView } from "../controllers/userView.controller";
import express from "express";

const router = express.Router();

router.route("/:productId").get(userView.getAll);
router.route("/:productId/uniqueViews").get(userView.getAllUniqueViews);

export default router;