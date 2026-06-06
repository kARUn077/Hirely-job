import { GoogleGenAI } from "@google/genai";

const getApiKey = () => process.env.GOOGLE_GEN_API_KEY || process.env.GOOGLE_GENAI_API_KEY;
const shouldUseFallback = () => String(process.env.AI_FALLBACK_ENABLED || "true").toLowerCase() !== "false";

const STOP_WORDS = new Set([
    "the", "and", "for", "with", "that", "this", "from", "your", "you", "are", "have", "has", "will", "into",
    "job", "role", "candidate", "required", "requirements", "experience", "years", "work", "skills", "skill",
    "using", "ability", "strong", "good", "knowledge", "about", "their", "them", "our", "team", "etc"
]);

const parseJsonFromModelText = (rawText) => {
    if (!rawText) {
        throw new Error("AI returned an empty response");
    }

    const fenced = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    const candidate = fenced?.[1] || rawText;

    const start = candidate.indexOf("{");
    const end = candidate.lastIndexOf("}");

    if (start === -1 || end === -1 || end <= start) {
        throw new Error("AI response did not contain valid JSON object");
    }

    return JSON.parse(candidate.slice(start, end + 1));
};

const normalizePlan = (data) => {
    const technicalQuestions = Array.isArray(data?.technicalQuestions) ? data.technicalQuestions : [];
    const behavioralQuestions = Array.isArray(data?.behavioralQuestions) ? data.behavioralQuestions : [];
    const skillGaps = Array.isArray(data?.skillGaps) ? data.skillGaps : [];
    const preparationPlan = Array.isArray(data?.preparationPlan) ? data.preparationPlan : [];

    return {
        title: String(data?.title || "Interview Plan"),
        matchScore: Math.max(0, Math.min(100, Number(data?.matchScore || 0))),
        technicalQuestions: technicalQuestions.map((q) => ({
            question: String(q?.question || ""),
            intention: String(q?.intention || ""),
            answer: String(q?.answer || ""),
        })).filter((q) => q.question),
        behavioralQuestions: behavioralQuestions.map((q) => ({
            question: String(q?.question || ""),
            intention: String(q?.intention || ""),
            answer: String(q?.answer || ""),
        })).filter((q) => q.question),
        skillGaps: skillGaps.map((g) => ({
            skill: String(g?.skill || "").trim(),
            severity: ["low", "medium", "high"].includes(String(g?.severity || "").toLowerCase())
                ? String(g?.severity || "").toLowerCase()
                : "medium",
        })).filter((g) => g.skill),
        preparationPlan: preparationPlan.map((d, index) => ({
            day: Number(d?.day || index + 1),
            focus: String(d?.focus || `Day ${index + 1} Preparation`),
            tasks: Array.isArray(d?.tasks)
                ? d.tasks.map((t) => String(t || "").trim()).filter(Boolean)
                : [],
        })),
    };
};

const extractKeywords = (text = "") => {
    const words = text
        .toLowerCase()
        .replace(/[^a-z0-9+.#\s-]/g, " ")
        .split(/\s+/)
        .map((w) => w.trim())
        .filter(Boolean)
        .filter((w) => w.length > 2)
        .filter((w) => !STOP_WORDS.has(w));

    const freq = new Map();
    for (const w of words) {
        freq.set(w, (freq.get(w) || 0) + 1);
    }

    return [...freq.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([k]) => k);
};

const titleFromJobDescription = (jobDescription) => {
    const firstLine = String(jobDescription || "").split("\n").find((line) => line.trim());
    if (!firstLine) return "Interview Plan";
    const trimmed = firstLine.trim();
    return trimmed.length > 80 ? `${trimmed.slice(0, 77)}...` : trimmed;
};

const fallbackQuestionSet = (keywords, type) => {
    const focus = keywords[0] || "core engineering";
    const second = keywords[1] || "system design";

    if (type === "behavioral") {
        return [
            {
                question: `Tell me about a time you handled a difficult project while working with ${focus}.`,
                intention: "Evaluate ownership, resilience, and communication under pressure.",
                answer: "Use STAR format. Explain context, constraints, your actions, and measurable impact.",
            },
            {
                question: `Describe a conflict with a teammate and how you resolved it in a ${second}-heavy project.`,
                intention: "Assess collaboration and conflict resolution maturity.",
                answer: "Show empathy, structured communication, and a balanced outcome for product and team.",
            },
            {
                question: "Share a situation where you had to learn something quickly to deliver on time.",
                intention: "Measure adaptability and growth mindset.",
                answer: "Highlight fast learning approach, prioritization, and what changed in your execution.",
            },
            {
                question: "How do you prioritize multiple deadlines with competing stakeholders?",
                intention: "Understand prioritization and stakeholder management.",
                answer: "Explain your framework: impact vs urgency, dependencies, and clear expectation setting.",
            },
            {
                question: "Describe feedback you received that changed your way of working.",
                intention: "Assess self-awareness and coachability.",
                answer: "Give a real example, what you changed, and how results improved afterwards.",
            },
            {
                question: "Why are you interested in this role, and how does it fit your career direction?",
                intention: "Check motivation and role alignment.",
                answer: "Connect your experience, strengths, and long-term goals to the role requirements.",
            },
        ];
    }

    return [
        {
            question: `How would you design and implement a scalable solution using ${focus}?`,
            intention: "Evaluate architecture depth and practical implementation thinking.",
            answer: "Start with requirements, propose architecture, discuss trade-offs, then observability and scaling.",
        },
        {
            question: `What are common performance bottlenecks in systems involving ${second}, and how do you fix them?`,
            intention: "Test performance troubleshooting and optimization skills.",
            answer: "Discuss profiling, bottleneck identification, indexing/caching, and impact measurement.",
        },
        {
            question: "How do you ensure code quality and reliability in production?",
            intention: "Assess engineering discipline and risk management.",
            answer: "Cover testing strategy, code reviews, CI, observability, and safe rollout practices.",
        },
        {
            question: "Explain an API design decision you made and the trade-offs involved.",
            intention: "Understand API design maturity and decision rationale.",
            answer: "Describe constraints, versioning, security, pagination, and why your chosen design fit.",
        },
        {
            question: `How would you secure an application that processes sensitive user data?`,
            intention: "Measure security fundamentals for real systems.",
            answer: "Discuss authn/authz, secret management, encryption, validation, and monitoring.",
        },
        {
            question: "Walk through how you debug a hard-to-reproduce production issue.",
            intention: "Evaluate debugging method and incident response approach.",
            answer: "Explain hypothesis-driven debugging, logs/metrics/traces, rollback strategy, and postmortem learning.",
        },
    ];
};

const fallbackSkillGaps = (keywords) => {
    const defaultGaps = [
        { skill: "Advanced system design", severity: "high" },
        { skill: "Testing strategy and automation", severity: "medium" },
        { skill: "Production observability", severity: "medium" },
        { skill: "Security hardening", severity: "high" },
        { skill: "Stakeholder communication", severity: "low" },
    ];

    const inferred = keywords.slice(0, 3).map((k, idx) => ({
        skill: `Depth in ${k}`,
        severity: idx === 0 ? "high" : "medium",
    }));

    return [...inferred, ...defaultGaps].slice(0, 6);
};

const fallbackPreparationPlan = (keywords) => {
    const k1 = keywords[0] || "core concepts";
    const k2 = keywords[1] || "problem solving";
    const k3 = keywords[2] || "system design";

    return [
        { day: 1, focus: `Role analysis and ${k1} fundamentals`, tasks: ["Break down JD into must-have skills", `Revise ${k1} concepts and common pitfalls`, "Create short revision notes"] },
        { day: 2, focus: `Hands-on practice for ${k1}`, tasks: ["Build one focused mini implementation", "Write and run edge-case tests", "Document trade-offs in your approach"] },
        { day: 3, focus: `${k2} interview drills`, tasks: ["Solve 4-6 role-relevant scenarios", "Explain your reasoning aloud", "Review weak areas and patterns"] },
        { day: 4, focus: `${k3} and architecture`, tasks: ["Design one end-to-end system", "Discuss scale, reliability, and failure modes", "Prepare a clear whiteboard-style explanation"] },
        { day: 5, focus: "Behavioral and communication", tasks: ["Prepare 6 STAR stories", "Practice concise impact-focused delivery", "Align stories to role expectations"] },
        { day: 6, focus: "Mock interview simulation", tasks: ["Run one technical mock", "Run one behavioral mock", "Capture feedback and correction plan"] },
        { day: 7, focus: "Final revision and interview readiness", tasks: ["Review notes and common mistakes", "Practice rapid answer structures", "Prepare intro, questions for interviewer, and confidence routine"] },
    ];
};

const buildFallbackPlan = ({ jobDescription, selfDescription, resumeText }) => {
    const sourceText = [jobDescription, selfDescription, resumeText].filter(Boolean).join(" ");
    const keywords = extractKeywords(sourceText);
    const evidenceSize = (selfDescription?.length || 0) + (resumeText?.length || 0);

    const matchScoreBase = Math.min(88, Math.max(58, 58 + Math.floor(evidenceSize / 220)));

    return {
        title: titleFromJobDescription(jobDescription),
        matchScore: matchScoreBase,
        technicalQuestions: fallbackQuestionSet(keywords, "technical"),
        behavioralQuestions: fallbackQuestionSet(keywords, "behavioral"),
        skillGaps: fallbackSkillGaps(keywords),
        preparationPlan: fallbackPreparationPlan(keywords),
        _meta: {
            source: "local-fallback",
            reason: "Gemini unavailable or quota exceeded",
        },
    };
};

const isGeminiQuotaError = (error) => {
    const statusCode = Number(error?.status || error?.code);
    const message = String(error?.message || "").toLowerCase();
    return statusCode === 429 || message.includes("quota") || message.includes("resource_exhausted");
};

export const generateInterviewPlan = async ({ jobDescription, selfDescription, resumeText }) => {
    const apiKey = getApiKey();
    if (!apiKey) {
        if (shouldUseFallback()) {
            return buildFallbackPlan({ jobDescription, selfDescription, resumeText });
        }
        throw new Error("Missing GOOGLE_GEN_API_KEY in backend/.env");
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are an interview preparation assistant.
Create a precise interview plan for a candidate.

INPUTS:
- Target Job Description: ${jobDescription}
- Resume Content: ${resumeText || "Not provided"}
- Self Description: ${selfDescription || "Not provided"}

Return ONLY a valid JSON object with this exact shape:
{
  "title": "string",
  "matchScore": number,
  "technicalQuestions": [{"question":"string","intention":"string","answer":"string"}],
  "behavioralQuestions": [{"question":"string","intention":"string","answer":"string"}],
  "skillGaps": [{"skill":"string","severity":"low|medium|high"}],
  "preparationPlan": [{"day":1,"focus":"string","tasks":["string"]}]
}

Rules:
- matchScore must be between 0 and 100.
- Provide 6 technical questions and 6 behavioral questions.
- Provide 4-6 skill gaps.
- Provide a 7 day preparationPlan.
- Keep content practical and role-specific.
- Do not include markdown or extra keys.`;

    try {
        const response = await ai.models.generateContent({
            model: process.env.GOOGLE_GEN_MODEL || "gemini-2.0-flash",
            contents: prompt,
        });

        const rawText = typeof response?.text === "function" ? await response.text() : response?.text;
        const parsed = parseJsonFromModelText(rawText);
        const normalized = normalizePlan(parsed);

        if (!normalized.technicalQuestions.length || !normalized.behavioralQuestions.length || !normalized.preparationPlan.length) {
            throw new Error("AI response was incomplete");
        }

        return normalized;
    } catch (error) {
        if (shouldUseFallback() && isGeminiQuotaError(error)) {
            return buildFallbackPlan({ jobDescription, selfDescription, resumeText });
        }
        throw error;
    }
};
