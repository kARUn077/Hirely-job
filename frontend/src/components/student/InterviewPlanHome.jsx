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
        <div className="min-h-screen bg-gradient-to-b from-[#fbf4ea] via-[#f8efe2] to-[#f3e6d6] text-[#3f2a1b]">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
                <header className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#2f1f15]">
                        Create Your Custom <span className="text-[#8B5C2A]">Interview Plan</span>
                    </h1>
                    <p className="text-[#7b6653] mt-4 max-w-2xl mx-auto">
                        Let AI analyze your target role and profile to generate match score, technical and behavioral questions,
                        roadmap, and skill gaps.
                    </p>
                </header>

                <section className="bg-white/85 backdrop-blur border border-[#e5d3c2] rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(139,92,42,0.12)]">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-[#ead8c7]">
                            <div className="flex items-center gap-3 mb-4">
                                <FileText className="w-5 h-5 text-[#8B5C2A]" />
                                <h2 className="text-xl font-bold">Target Job Description</h2>
                                <span className="text-xs font-semibold uppercase bg-[#f7eadb] text-[#8B5C2A] border border-[#e4c9ad] px-2 py-1 rounded-full">Required</span>
                            </div>
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                maxLength={5000}
                                className="w-full h-[320px] bg-[#fffaf4] border border-[#e5d3c2] rounded-2xl p-4 text-sm leading-6 outline-none focus:ring-2 focus:ring-[#8B5C2A] text-[#3f2a1b] placeholder:text-[#a28a75]"
                                placeholder="Paste the full job description here..."
                            />
                            <p className="text-xs text-[#927d6c] mt-2 text-right">{jobDescription.length} / 5000 chars</p>
                        </div>

                        <div className="p-6 md:p-8 flex flex-col gap-4 bg-[#fdf8f2]">
                            <div className="flex items-center gap-3">
                                <UserRound className="w-5 h-5 text-[#8B5C2A]" />
                                <h2 className="text-xl font-bold">Your Profile</h2>
                            </div>

                            <div>
                                <p className="text-sm font-semibold mb-2">
                                    Upload Resume <span className="text-xs uppercase bg-[#f7eadb] text-[#8B5C2A] border border-[#e4c9ad] px-2 py-1 rounded-full ml-1">Best Results</span>
                                </p>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full bg-[#fffaf4] border-2 border-dashed border-[#d9c2ad] rounded-2xl p-6 hover:border-[#8B5C2A] transition"
                                >
                                    <div className="flex flex-col items-center gap-2 text-[#77604b]">
                                        <UploadCloud className="w-8 h-8 text-[#8B5C2A]" />
                                        <span className="font-semibold">Click to upload PDF resume</span>
                                        <span className="text-xs">Max 5MB</span>
                                        {resumeFile && <span className="text-xs text-[#8B5C2A]">{resumeFile.name}</span>}
                                    </div>
                                </button>
                                <input ref={fileInputRef} hidden type="file" accept="application/pdf" onChange={handleFileChange} />
                            </div>

                            <div className="relative py-1">
                                <div className="h-px bg-[#ead8c7]" />
                                <span className="absolute left-1/2 -translate-x-1/2 -top-2 text-xs bg-[#fdf8f2] px-2 text-[#927d6c]">OR</span>
                            </div>

                            <div>
                                <p className="text-sm font-semibold mb-2">Quick Self Description</p>
                                <textarea
                                    value={selfDescription}
                                    onChange={(e) => setSelfDescription(e.target.value)}
                                    className="w-full h-32 bg-[#fffaf4] border border-[#e5d3c2] rounded-2xl p-3 text-sm leading-6 outline-none focus:ring-2 focus:ring-[#8B5C2A] text-[#3f2a1b] placeholder:text-[#a28a75]"
                                    placeholder="Briefly describe your experience, strengths, and target role context..."
                                />
                            </div>

                            <div className="flex gap-2 p-3 rounded-xl border border-[#e4c9ad] bg-[#f7eadb] text-[#7a5b3d] text-xs">
                                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                                <p>Either a <strong>resume PDF</strong> or a <strong>self description</strong> is required to generate your personalized plan.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between px-6 md:px-8 py-4 border-t border-[#ead8c7] bg-[#fff8f0]">
                        <p className="text-xs text-[#927d6c]">AI-Powered strategy generation • Approx 20-40s</p>
                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className="inline-flex items-center gap-2 bg-[#8B5C2A] hover:bg-[#704214] transition text-white font-semibold px-5 py-2.5 rounded-full shadow-md disabled:opacity-60"
                        >
                            <Sparkles className="w-4 h-4" />
                            {loading ? "Generating..." : "Generate My Interview Strategy"}
                        </button>
                    </div>
                </section>

                <section className="mt-8">
                    <h3 className="text-lg font-bold mb-3">Recent Interview Plans</h3>
                    {plansLoading ? (
                        <p className="text-sm text-[#927d6c]">Loading plans...</p>
                    ) : plans.length === 0 ? (
                        <p className="text-sm text-[#927d6c]">No plans yet. Generate your first one.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {plans.map((plan) => (
                                <button
                                    key={plan._id}
                                    onClick={() => navigate(`/interview-plan/${plan._id}`)}
                                    className="text-left bg-white/85 border border-[#e5d3c2] rounded-2xl p-4 hover:border-[#8B5C2A] hover:shadow-lg transition"
                                >
                                    <p className="font-semibold truncate">{plan.title || "Untitled Role"}</p>
                                    <p className="text-sm text-[#8B5C2A] mt-2">Match score: {plan.matchScore}%</p>
                                    <p className="text-xs text-[#927d6c] mt-2">
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
