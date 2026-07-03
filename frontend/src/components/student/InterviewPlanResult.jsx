import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "../shared/Navbar";
import { INTERVIEW_API_END_POINT } from "@/utils/constant";

const QuestionCard = ({ index, item }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="bg-white border border-[#e5d3c2] rounded-2xl overflow-hidden shadow-sm">
            <button
                className="w-full text-left flex items-start gap-3 p-4"
                onClick={() => setOpen((prev) => !prev)}
            >
                <span className="text-xs font-bold text-[#8B5C2A] bg-[#f7eadb] px-2 py-1 rounded-full border border-[#e4c9ad]">Q{index + 1}</span>
                <p className="text-sm md:text-base text-[#3f2a1b] flex-1">{item.question}</p>
            </button>
            {open && (
                <div className="border-t border-[#ead8c7] p-4 space-y-3 bg-[#fffaf4]">
                    <div>
                        <p className="text-xs uppercase tracking-wide text-[#8B5C2A] font-bold">Intention</p>
                        <p className="text-sm text-[#6f5a49] mt-1">{item.intention}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-wide text-[#4f7d57] font-bold">Model Answer</p>
                        <p className="text-sm text-[#6f5a49] mt-1">{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

const RoadmapDay = ({ day }) => {
    return (
        <div className="relative pl-10 pb-8">
            <span className="absolute left-[18px] top-1 w-[2px] h-full bg-gradient-to-b from-[#8B5C2A] to-transparent" />
            <span className="absolute left-[12px] top-2 w-4 h-4 rounded-full border-2 border-[#8B5C2A] bg-[#fff8f0]" />
            <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-bold text-[#8B5C2A] bg-[#f7eadb] border border-[#e4c9ad] px-2 py-1 rounded-full">Day {day.day}</span>
                <h3 className="font-semibold text-[#3f2a1b]">{day.focus}</h3>
            </div>
            <ul className="space-y-2">
                {(day.tasks || []).map((task, idx) => (
                    <li key={idx} className="text-sm text-[#6f5a49] flex items-start gap-2">
                        <span className="mt-[7px] w-[5px] h-[5px] rounded-full bg-[#8B5C2A]" />
                        <span>{task}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const InterviewPlanResult = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("technical");
    const [plan, setPlan] = useState(null);

    useEffect(() => {
        const loadPlan = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${INTERVIEW_API_END_POINT}/plan/${id}`, {
                    withCredentials: true,
                });
                if (res.data.success) {
                    setPlan(res.data.interviewPlan);
                }
            } catch (error) {
                console.log(error);
                toast.error(error?.response?.data?.message || "Failed to load interview plan.");
                navigate("/interview-plan");
            } finally {
                setLoading(false);
            }
        };

        loadPlan();
    }, [id, navigate]);

    const scoreColor = useMemo(() => {
        if (!plan) return "#33d17a";
        if (plan.matchScore >= 80) return "#33d17a";
        if (plan.matchScore >= 60) return "#f5a623";
        return "#ff5d73";
    }, [plan]);

    if (loading || !plan) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#fbf4ea] via-[#f8efe2] to-[#f3e6d6] text-[#3f2a1b]">
                <Navbar />
                <div className="max-w-6xl mx-auto px-4 py-16 text-center text-[#927d6c]">Loading your interview plan...</div>
            </div>
        );
    }

    const tabs = [
        { id: "technical", label: "Technical Questions" },
        { id: "behavioral", label: "Behavioral Questions" },
        { id: "roadmap", label: "Road Map" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#fbf4ea] via-[#f8efe2] to-[#f3e6d6] text-[#3f2a1b]">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
                <div className="bg-white/85 backdrop-blur border border-[#e5d3c2] rounded-3xl overflow-hidden flex flex-col lg:flex-row shadow-[0_20px_60px_rgba(139,92,42,0.12)]">
                    <aside className="w-full lg:w-[220px] border-b lg:border-b-0 lg:border-r border-[#ead8c7] p-4 bg-[#fdf8f2]">
                        <p className="text-xs uppercase tracking-widest text-[#927d6c] mb-3">Sections</p>
                        <div className="space-y-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                                        activeTab === tab.id
                                            ? "bg-[#8B5C2A] text-white border border-[#704214]"
                                            : "text-[#3f2a1b] hover:bg-[#f7eadb]"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </aside>

                    <main className="flex-1 p-4 md:p-6 border-b lg:border-b-0 lg:border-r border-[#ead8c7]">
                        <div className="flex items-center justify-between gap-3 mb-4">
                            <h2 className="text-2xl font-bold">{plan.title || "Interview Plan"}</h2>
                            {plan.generationMode === "fallback" && (
                                <span className="text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full border border-[#e4c9ad] bg-[#f7eadb] text-[#8B5C2A]">
                                    Generated in fallback mode
                                </span>
                            )}
                        </div>

                        {activeTab === "technical" && (
                            <section>
                                <div className="flex items-center gap-3 mb-5">
                                    <h3 className="text-xl font-bold">Technical Questions</h3>
                                    <span className="text-xs text-[#927d6c] bg-[#f7eadb] border border-[#e4c9ad] px-2 py-1 rounded-full">
                                        {plan.technicalQuestions.length} questions
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    {plan.technicalQuestions.map((q, idx) => (
                                        <QuestionCard key={idx} index={idx} item={q} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {activeTab === "behavioral" && (
                            <section>
                                <div className="flex items-center gap-3 mb-5">
                                    <h3 className="text-xl font-bold">Behavioral Questions</h3>
                                    <span className="text-xs text-[#927d6c] bg-[#f7eadb] border border-[#e4c9ad] px-2 py-1 rounded-full">
                                        {plan.behavioralQuestions.length} questions
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    {plan.behavioralQuestions.map((q, idx) => (
                                        <QuestionCard key={idx} index={idx} item={q} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {activeTab === "roadmap" && (
                            <section>
                                <div className="flex items-center gap-3 mb-5">
                                    <h3 className="text-xl font-bold">Preparation Road Map</h3>
                                    <span className="text-xs text-[#927d6c] bg-[#f7eadb] border border-[#e4c9ad] px-2 py-1 rounded-full">
                                        {plan.preparationPlan.length}-day plan
                                    </span>
                                </div>
                                <div className="pt-2">
                                    {plan.preparationPlan.map((day) => (
                                        <RoadmapDay key={`${day.day}-${day.focus}`} day={day} />
                                    ))}
                                </div>
                            </section>
                        )}
                    </main>

                    <aside className="w-full lg:w-[250px] p-5 space-y-5 bg-[#fdf8f2]">
                        <div>
                            <p className="text-xs uppercase tracking-widest text-[#927d6c] mb-3">Match Score</p>
                            <div className="flex items-center justify-center">
                                <div
                                    className="w-24 h-24 rounded-full grid place-items-center"
                                    style={{
                                        background: `conic-gradient(${scoreColor} ${plan.matchScore}%, #ead8c7 ${plan.matchScore}% 100%)`,
                                    }}
                                >
                                    <div className="w-20 h-20 rounded-full bg-white grid place-items-center text-center border border-[#ead8c7]">
                                        <p className="text-2xl font-bold">{plan.matchScore}</p>
                                        <p className="text-xs text-[#927d6c]">%</p>
                                    </div>
                                </div>
                            </div>
                            <p className="text-center text-xs mt-3" style={{ color: scoreColor }}>
                                {plan.matchScore >= 80 ? "Strong match for this role" : plan.matchScore >= 60 ? "Moderate match" : "Needs improvement"}
                            </p>
                        </div>

                        <div className="h-px bg-[#ead8c7]" />

                        <div>
                            <p className="text-xs uppercase tracking-widest text-[#927d6c] mb-3">Skill Gaps</p>
                            <div className="flex flex-wrap gap-2">
                                {plan.skillGaps.map((gap, idx) => {
                                    const cls =
                                        gap.severity === "high"
                                            ? "bg-[#fbe4e6] text-[#b04b5b] border-[#ebb6bf]"
                                            : gap.severity === "medium"
                                                ? "bg-[#f7eadb] text-[#8B5C2A] border-[#e4c9ad]"
                                                : "bg-[#e7f1e8] text-[#4f7d57] border-[#b9d6be]";
                                    return (
                                        <span key={idx} className={`text-xs px-2.5 py-1 rounded border ${cls}`}>
                                            {gap.skill}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default InterviewPlanResult;
