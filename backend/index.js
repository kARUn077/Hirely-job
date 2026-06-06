import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import interviewRoute from "./routes/interview.route.js";

dotenv.config({});

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
const allowedOrigins = [
    process.env.CLIENT_URL,
    "http://localhost:5173",
    "http://localhost:5174",
].filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, true);
        }

        const isLocalhost = /^http:\/\/localhost:\d+$/i.test(origin);
        if (allowedOrigins.includes(origin) || isLocalhost) {
            return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
    },
    credentials:true
}

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;


// api's
app.get("/", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Hirely backend is running"
    });
});

app.get("/healthz", (req, res) => {
    return res.status(200).json({
        success: true,
        status: "ok"
    });
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/interview", interviewRoute);


const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running at port ${PORT}`);
        });
    } catch (error) {
        process.exit(1);
    }
};

startServer();