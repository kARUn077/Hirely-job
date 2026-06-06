import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
    {
        question: { type: String, required: true },
        intention: { type: String, required: true },
        answer: { type: String, required: true },
    },
    { _id: false }
);

const skillGapSchema = new mongoose.Schema(
    {
        skill: { type: String, required: true },
        severity: { type: String, enum: ["low", "medium", "high"], required: true },
    },
    { _id: false }
);

const preparationPlanSchema = new mongoose.Schema(
    {
        day: { type: Number, required: true },
        focus: { type: String, required: true },
        tasks: [{ type: String, required: true }],
    },
    { _id: false }
);

const interviewPlanSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        jobDescription: { type: String, required: true },
        selfDescription: { type: String, default: "" },
        resumeText: { type: String, default: "" },
        resumeFileUrl: { type: String, default: "" },
        resumeOriginalName: { type: String, default: "" },
        generationMode: { type: String, enum: ["ai", "fallback"], default: "ai" },
        title: { type: String, required: true },
        matchScore: { type: Number, min: 0, max: 100, required: true },
        technicalQuestions: [questionSchema],
        behavioralQuestions: [questionSchema],
        skillGaps: [skillGapSchema],
        preparationPlan: [preparationPlanSchema],
    },
    { timestamps: true }
);

export const InterviewPlan = mongoose.model("InterviewPlan", interviewPlanSchema);
