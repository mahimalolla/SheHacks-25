import express from "express";
import cors from "cors";
import { db } from "./firebase-server.js"; // Firestore config
import { doc, getDoc, updateDoc } from "firebase/firestore";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); // Initialize once

// =========================
// 🔹 Roadmap Generator
// =========================
app.get("/generate-roadmap/:profileId", async (req, res) => {
  const profileId = req.params.profileId;
  console.log(`🧭 Generating roadmap for profileId: ${profileId}`);

  try {
    const profileRef = doc(db, "profiles", profileId);
    const profileSnap = await getDoc(profileRef);

    if (!profileSnap.exists()) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const { name, experience, careerGap, industry, techStack } = profileSnap.data();

    const messages = [
      {
        role: "system",
        content: "You are an AI assistant tasked with creating concise reskilling roadmaps for women re-entering the tech industry after a career gap. Focus on essential steps and key skills needed to quickly regain relevance.",
      },
      {
        role: "user",
        content: `
Generate a concise, personalized learning roadmap for:
- Name: ${name}
- Years of Experience: ${experience}
- Career Gap Duration: ${careerGap} years
- Industry: ${industry}
- Tech Stack: ${techStack}

Provide a 1-month plan with 3 key steps, including recommended courses or tutorials and a project to apply new skills.
        `,
      },
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 1000,
    });

    const roadmap = response.choices[0].message.content;
    await updateDoc(profileRef, { roadmap });

    res.json({ success: true, roadmap });
    console.log("✅ Roadmap successfully returned.");
  } catch (error) {
    console.error("❌ Error generating roadmap:", error);
    res.status(500).json({ success: false, error: "Failed to generate roadmap" });
  }
});

// =========================
// 🔹 Job Match Generator
// =========================
app.get("/generate-jobs/:profileId", async (req, res) => {
  const profileId = req.params.profileId;
  console.log(`💼 Generating job matches for profileId: ${profileId}`);

  try {
    const profileRef = doc(db, "profiles", profileId);
    const profileSnap = await getDoc(profileRef);

    if (!profileSnap.exists()) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const { name, experience, careerGap, industry, techStack } = profileSnap.data();

    const messages = [
      {
        role: "system",
        content: "You are an AI assistant helping women re-enter tech with relevant returnship job role suggestions.",
      },
      {
        role: "user",
        content: `
Suggest 5 realistic returnship job roles for this user:
- Name: ${name}
- Experience: ${experience} years
- Career Gap: ${careerGap} years
- Industry: ${industry}
- Tech Stack: ${techStack}

Each job should include:
- Job Title
- Company (realistic or placeholder)
- Location (preferably Remote/Flexible)
- One-liner description

Present the output in a clean markdown-style list.
        `
      }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 1000,
    });

    const jobs = response.choices[0].message.content;
    await updateDoc(profileRef, { jobSuggestions: jobs });

    res.json({ success: true, jobs });
    console.log("✅ Job suggestions successfully returned.");
  } catch (error) {
    console.error("❌ Error generating job suggestions:", error);
    res.status(500).json({ success: false, error: "Failed to generate job suggestions" });
  }
});

// =========================
// ✅ Start Server
// =========================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
