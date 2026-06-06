import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Sparkles, UploadCloud, Info, FileText, UserRound } from "lucide-react";
import { toast } from "sonner";
import Navbar from "../shared/Navbar";
import { INTERVIEW_API_END_POINT } from "@/utils/constant";

const InterviewPlanHome = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [plansLoading, setPlansLoading] = useState(false);
    const [plans, setPlans] = useState([]);

    const [jobDescription, setJobDescription] = useState("");
    const [selfDescription, setSelfDescription] = useState("");
    const [resumeFile, setResumeFile] = useState(null);

    const fetchPlans = async () => {
        try {
            setPlansLoading(true);
            const res = await axios.get(`${INTERVIEW_API_END_POINT}/plans`, {
                withCredentials: true,
            });
            if (res.data.success) {
                setPlans(res.data.interviewPlans || []);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setPlansLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0] || null;
        if (!file) {
            setResumeFile(null);
            return;
        }

        if (file.type !== "application/pdf") {
            toast.error("Only PDF files are allowed.");
            e.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("PDF size must be 5MB or less.");
            e.target.value = "";
            return;
        }

        setResumeFile(file);
    };

    const handleGenerate = async () => {
        if (!jobDescription.trim()) {
            toast.error("Target job description is required.");
            return;
        }

        if (!resumeFile && !selfDescription.trim()) {
            toast.error("Add either a resume PDF or self description.");
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("jobDescription", jobDescription);
            formData.append("selfDescription", selfDescription);
            if (resumeFile) {
                formData.append("file", resumeFile);
            }

            const res = await axios.post(`${INTERVIEW_API_END_POINT}/plan`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            });

            if (res.data.success) {
                toast.success("Interview plan generated.");
                navigate(`/interview-plan/${res.data.interviewPlan._id}`);
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Failed to generate interview plan.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0b1220] text-white">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
                <header className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                        Create Your Custom <span className="text-[#ff3c81]">Interview Plan</span>
                    </h1>
                    <p className="text-[#98a2b3] mt-4 max-w-2xl mx-auto">
                        Let AI analyze your target role and profile to generate match score, technical and behavioral questions,
                        roadmap, and skill gaps.
                    </p>
                </header>

                <section className="bg-[#101b2d] border border-[#23324a] rounded-2xl overflow-hidden shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-[#23324a]">
                            <div className="flex items-center gap-3 mb-4">
                                <FileText className="w-5 h-5 text-[#ff3c81]" />
                                <h2 className="text-xl font-bold">Target Job Description</h2>
                                <span className="text-xs font-semibold uppercase bg-[#3f1c2e] border border-[#6f284e] px-2 py-1 rounded">Required</span>
                            </div>
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                maxLength={5000}
                                className="w-full h-[320px] bg-[#1a2740] border border-[#2a3d5f] rounded-xl p-4 text-sm leading-6 outline-none focus:ring-2 focus:ring-[#ff3c81]"
                                placeholder="Paste the full job description here..."
                            />
                            <p className="text-xs text-[#8a96a8] mt-2 text-right">{jobDescription.length} / 5000 chars</p>
                        </div>

                        <div className="p-6 md:p-8 flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <UserRound className="w-5 h-5 text-[#ff3c81]" />
                                <h2 className="text-xl font-bold">Your Profile</h2>
                            </div>

                            <div>
                                <p className="text-sm font-semibold mb-2">
                                    Upload Resume <span className="text-xs uppercase bg-[#3f1c2e] border border-[#6f284e] px-2 py-1 rounded ml-1">Best Results</span>
                                </p>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full bg-[#1a2740] border-2 border-dashed border-[#2f4469] rounded-xl p-6 hover:border-[#ff3c81] transition"
                                >
                                    <div className="flex flex-col items-center gap-2 text-[#b7c2d4]">
                                        <UploadCloud className="w-8 h-8 text-[#ff3c81]" />
                                        <span className="font-semibold">Click to upload PDF resume</span>
                                        <span className="text-xs">Max 5MB</span>
                                        {resumeFile && <span className="text-xs text-[#ff8ab3]">{resumeFile.name}</span>}
                                    </div>
                                </button>
                                <input ref={fileInputRef} hidden type="file" accept="application/pdf" onChange={handleFileChange} />
                            </div>

                            <div className="relative py-1">
                                <div className="h-px bg-[#2a3d5f]" />
                                <span className="absolute left-1/2 -translate-x-1/2 -top-2 text-xs bg-[#101b2d] px-2 text-[#94a3b8]">OR</span>
                            </div>

                            <div>
                                <p className="text-sm font-semibold mb-2">Quick Self Description</p>
                                <textarea
                                    value={selfDescription}
                                    onChange={(e) => setSelfDescription(e.target.value)}
                                    className="w-full h-32 bg-[#1a2740] border border-[#2a3d5f] rounded-xl p-3 text-sm leading-6 outline-none focus:ring-2 focus:ring-[#ff3c81]"
                                    placeholder="Briefly describe your experience, strengths, and target role context..."
                                />
                            </div>

                            <div className="flex gap-2 p-3 rounded-lg border border-[#2d4f7c] bg-[#132746] text-[#9dc3ff] text-xs">
                                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                                <p>Either a <strong>resume PDF</strong> or a <strong>self description</strong> is required to generate your personalized plan.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between px-6 md:px-8 py-4 border-t border-[#23324a]">
                        <p className="text-xs text-[#94a3b8]">AI-Powered strategy generation • Approx 20-40s</p>
                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#ff3c81] to-[#d91f62] hover:opacity-90 transition text-white font-semibold px-5 py-2.5 rounded-lg disabled:opacity-60"
                        >
                            <Sparkles className="w-4 h-4" />
                            {loading ? "Generating..." : "Generate My Interview Strategy"}
                        </button>
                    </div>
                </section>

                <section className="mt-8">
                    <h3 className="text-lg font-bold mb-3">Recent Interview Plans</h3>
                    {plansLoading ? (
                        <p className="text-sm text-[#9aa7bc]">Loading plans...</p>
                    ) : plans.length === 0 ? (
                        <p className="text-sm text-[#9aa7bc]">No plans yet. Generate your first one.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {plans.map((plan) => (
                                <button
                                    key={plan._id}
                                    onClick={() => navigate(`/interview-plan/${plan._id}`)}
                                    className="text-left bg-[#101b2d] border border-[#243750] rounded-xl p-4 hover:border-[#ff3c81] transition"
                                >
                                    <p className="font-semibold truncate">{plan.title || "Untitled Role"}</p>
                                    <p className="text-sm text-[#ff8ab3] mt-2">Match score: {plan.matchScore}%</p>
                                    <p className="text-xs text-[#8a96a8] mt-2">
                                        {new Date(plan.createdAt).toLocaleDateString()}
                                    </p>
                                </button>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default InterviewPlanHome;
