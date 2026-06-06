import pdfParse from "pdf-parse";
import { InterviewPlan } from "../models/interviewPlan.model.js";
import { generateInterviewPlan } from "../utils/aiInterview.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const createInterviewPlan = async (req, res) => {
    try {
        const { jobDescription, selfDescription = "" } = req.body;

        if (!jobDescription || !jobDescription.trim()) {
            return res.status(400).json({
                message: "Target job description is required.",
                success: false,
            });
        }

        let resumeText = "";
        let resumeFileUrl = "";
        let resumeOriginalName = "";

        if (req.file) {
            const isPdf = req.file.mimetype === "application/pdf";
            if (!isPdf) {
                return res.status(400).json({
                    message: "Only PDF resume files are allowed.",
                    success: false,
                });
            }

            resumeOriginalName = req.file.originalname || "resume.pdf";

            try {
                const pdfData = await pdfParse(req.file.buffer);
                resumeText = String(pdfData?.text || "").trim();
            } catch (error) {
                return res.status(400).json({
                    message: "Unable to read PDF resume content.",
                    success: false,
                });
            }

            if (process.env.CLOUD_NAME && process.env.API_KEY && process.env.API_SECRET) {
                try {
                    const fileUri = getDataUri(req.file);
                    const uploaded = await cloudinary.uploader.upload(fileUri.content, {
                        folder: "hirely/resumes",
                        resource_type: "raw",
                    });
                    resumeFileUrl = uploaded?.secure_url || "";
                } catch (error) {
                    console.log("Resume upload to cloudinary failed:", error.message || error);
                }
            }
        }

        if (!selfDescription.trim() && !resumeText.trim()) {
            return res.status(400).json({
                message: "Either resume or self description is required.",
                success: false,
            });
        }

        const aiPlan = await generateInterviewPlan({
            jobDescription: jobDescription.trim(),
            selfDescription: selfDescription.trim(),
            resumeText,
        });

        const aiMeta = aiPlan?._meta || null;
        if (aiPlan && aiPlan._meta) {
            delete aiPlan._meta;
        }

        const interviewPlan = await InterviewPlan.create({
            user: req.id,
            jobDescription: jobDescription.trim(),
            selfDescription: selfDescription.trim(),
            resumeText,
            resumeFileUrl,
            resumeOriginalName,
            generationMode: aiMeta ? "fallback" : "ai",
            ...aiPlan,
        });

        return res.status(201).json({
            message: aiMeta ? "Interview plan generated in fallback mode." : "Interview plan generated successfully.",
            success: true,
            interviewPlan,
            aiMeta,
        });
    } catch (error) {
        console.log(error);

        if (Number(error?.status || error?.code) === 429) {
            return res.status(429).json({
                message: "AI quota exceeded. Please retry after a minute or enable fallback mode.",
                success: false,
            });
        }

        return res.status(500).json({
            message: "Failed to generate interview plan.",
            success: false,
        });
    }
};

export const getInterviewPlanById = async (req, res) => {
    try {
        const { id } = req.params;
        const interviewPlan = await InterviewPlan.findOne({ _id: id, user: req.id });

        if (!interviewPlan) {
            return res.status(404).json({
                message: "Interview plan not found.",
                success: false,
            });
        }

        return res.status(200).json({
            success: true,
            interviewPlan,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to fetch interview plan.",
            success: false,
        });
    }
};

export const getAllInterviewPlans = async (req, res) => {
    try {
        const interviewPlans = await InterviewPlan.find({ user: req.id })
            .sort({ createdAt: -1 })
            .select("title matchScore createdAt");

        return res.status(200).json({
            success: true,
            interviewPlans,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to fetch interview plans.",
            success: false,
        });
    }
};
