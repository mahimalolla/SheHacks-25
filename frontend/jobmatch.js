document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const profileId = urlParams.get("profileId");
  
    if (!profileId) {
      alert("Missing profile ID in URL.");
      return;
    }
  
    try {
      const doc = await db.collection("profiles").doc(profileId).get();
      if (!doc.exists) {
        alert("Profile not found.");
        return;
      }
  
      const profile = doc.data();
      const techStack = (profile.techStack || "").toLowerCase();
      const inputSkills = techStack.split(",").map(s => s.trim());
  
      console.log("🧠 Tech stack for matching:", inputSkills);
  
      Papa.parse("1000_Row_Returnship_Job_Matching_Dataset.csv", {
        download: true,
        header: true,
        complete: function (results) {
          const jobs = results.data;
  
          const scoredJobs = jobs.map(job => {
            const jobSkills = (job["Skills Required"] || "").toLowerCase();
            const score = inputSkills.reduce((acc, skill) =>
              jobSkills.includes(skill) ? acc + 1 : acc, 0);
  
            return { ...job, score };
          });
  
          const topMatches = scoredJobs
            .filter(job => job.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);
  
          const resultList = document.getElementById("jobResults");
          resultList.innerHTML = "";
  
          if (topMatches.length === 0) {
            resultList.innerHTML = "<li>No matching jobs found.</li>";
          } else {
            topMatches.forEach(job => {
              const li = document.createElement("li");
              li.innerHTML = `
                <strong>${job["Job Title"]}</strong> at <em>${job["Company"]}</em><br>
                <strong>Location:</strong> ${job["Location"] || "N/A"}<br>
                <strong>Required Skills:</strong> ${job["Skills Required"]}<br>
                <strong>Job Description:</strong> ${job["Job Description"] || "N/A"}
              `;
              resultList.appendChild(li);
            });
          }
        }
      });
  
    } catch (error) {
      console.error("❌ Error fetching profile or matching jobs:", error);
      alert("Something went wrong. Please try again.");
    }
  });
  