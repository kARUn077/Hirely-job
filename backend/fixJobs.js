// Script to fix missing 'company' and 'created_by' fields in Job documents
// Usage: node fixJobs.js (after setting up your backend environment)

import mongoose from "mongoose";
import { Job } from "./models/job.model.js";

// Set your MongoDB connection string here
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/yourdbname";

async function fixJobs() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  // Set default ObjectIds for company and created_by (replace with valid IDs from your DB)
  const defaultCompanyId = "69c3e470e0f3aef4cfa304ee"; // Example company ObjectId
  const defaultUserId = "69c3e470e0f3aef4cfa304ef"; // Example recruiter ObjectId

  // Find jobs with missing company or created_by
  const jobs = await Job.find({ $or: [ { company: { $exists: false } }, { created_by: { $exists: false } } ] });
  console.log(`Found ${jobs.length} jobs to fix.`);

  for (const job of jobs) {
    if (!job.company) job.company = defaultCompanyId;
    if (!job.created_by) job.created_by = defaultUserId;
    await job.save();
    console.log(`Fixed job: ${job._id}`);
  }

  console.log("All jobs fixed.");
  await mongoose.disconnect();
}

fixJobs().catch(console.error);
