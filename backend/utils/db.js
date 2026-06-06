import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

        if (!mongoUri) {
            throw new Error("MongoDB connection string is missing. Set MONGO_URI in backend/.env");
        }

        try {
            await mongoose.connect(mongoUri);
            console.log('mongodb connected successfully');
            return;
        } catch (err) {
            console.error("MongoDB initial connection failed:", err.message || err);

            // During local development, try a local MongoDB fallback if available
            const tryLocal = process.env.NODE_ENV !== 'production';
            if (tryLocal) {
                const localUri = process.env.LOCAL_MONGO_URI || 'mongodb://127.0.0.1:27017/hirely';
                console.log(`Attempting fallback local MongoDB at ${localUri}`);
                await mongoose.connect(localUri);
                console.log('mongodb connected successfully (local fallback)');
                return;
            }

            // Re-throw if not handled
            throw err;
        }
    } catch (error) {
        console.error("MongoDB connection failed:", error.message || error);
        throw error;
    }
}
export default connectDB;