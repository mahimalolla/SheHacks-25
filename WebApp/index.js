import express from "express";
import cors from "cors";
import { db } from "./firebase-config.js"; // Firestore config
import { doc, getDoc, updateDoc } from "firebase/firestore";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); // Initialize once

// Generate AI-Powered Roadmap
app.get("/generate-roadmap/:profileId", async (req, res) => {
  const profileId = req.params.profileId;
  console.log(`Received request to generate roadmap for profileId: ${profileId}`);

  try {
    // Fetch user profile from Firestore
    const profileRef = doc(db, "profiles", profileId);
    const profileSnap = await getDoc(profileRef);

    if (!profileSnap.exists()) {
      console.log("Profile not found for profileId:", profileId);
      return res.status(404).json({ error: "Profile not found" });
    }

    const profileData = profileSnap.data();
    console.log("Fetched profile data:", profileData);

    // Prepare prompt for GPT
    const { name, experience, careerGap, industry, techStack } = profileData;
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

    console.log("Generated GPT prompt:", messages);

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      max_tokens: 1000,
    });

    const roadmap = response.choices[0].message.content;
    console.log("Generated roadmap:", roadmap);

    // Save roadmap back to Firestore
    await updateDoc(profileRef, { roadmap });

    res.json({ success: true, roadmap });
    console.log("Roadmap successfully generated and returned to client.");
  } catch (error) {
    console.error("Error generating roadmap:", error);
    res.status(500).json({ success: false, error: "Failed to generate roadmap" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
