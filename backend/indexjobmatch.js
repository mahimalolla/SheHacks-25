app.get("/generate-jobs/:profileId", async (req, res) => {
    const profileId = req.params.profileId;
  
    try {
      const profileRef = doc(db, "profiles", profileId);
      const snap = await getDoc(profileRef);
  
      if (!snap.exists()) {
        return res.status(404).json({ error: "Profile not found" });
      }
  
      const { name, experience, careerGap, industry, techStack } = snap.data();
  
      const messages = [
        {
          role: "system",
          content: "You are an AI career assistant helping women returning to tech find suitable job roles."
        },
        {
          role: "user",
          content: `
  Suggest 5 suitable returnship job roles based on the following profile:
  - Name: ${name}
  - Experience: ${experience} years
  - Career Gap: ${careerGap} years
  - Industry: ${industry}
  - Tech Stack: ${techStack}
  
  Each job should include:
  - Job Title
  - Company (can be a realistic or generic company)
  - Location (Remote/Flexible/Hybrid preferred)
  - 1-liner Description
  Present in a clear, markdown-style list format.
          `
        }
      ];
  
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        max_tokens: 1000
      });
  
      const jobs = response.choices[0].message.content;
      await updateDoc(profileRef, { jobSuggestions: jobs });
  
      res.json({ success: true, jobs });
  
    } catch (error) {
      console.error("❌ Error generating job suggestions:", error);
      res.status(500).json({ success: false, error: "Job matching failed" });
    }
  });
  