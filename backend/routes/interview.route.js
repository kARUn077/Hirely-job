import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";
import {
    createInterviewPlan,
    getAllInterviewPlans,
    getInterviewPlanById,
} from "../controllers/interview.controller.js";

const router = express.Router();

router.route("/plan").post(isAuthenticated, singleUpload, createInterviewPlan);
router.route("/plans").get(isAuthenticated, getAllInterviewPlans);
router.route("/plan/:id").get(isAuthenticated, getInterviewPlanById);

export default router;
