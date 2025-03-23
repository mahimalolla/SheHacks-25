document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("profile-form");
  const roadmapBtn = document.getElementById("roadmap-btn");
  const matchBtn = document.getElementById("match-btn");

  const params = new URLSearchParams(window.location.search);
  const profileId = params.get("profileId");

  if (!profileId) {
    alert("Missing profileId in URL. Please sign up or log in first.");
    return;
  }

  let saved = false;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email")?.value || "";
    const password = document.getElementById("password")?.value || "";
    const experience = document.getElementById("experience").value;
    const careerGap = document.getElementById("career-gap").value;
    const industry = document.getElementById("industry").value;
    const techStack = document.getElementById("tech-stack").value;

    try {
      // ✅ Use set() with merge:true to update existing profile
      await db.collection("profiles").doc(profileId).set({
        name,
        email,
        password,
        experience,
        careerGap,
        industry,
        techStack,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });

      alert("Profile saved successfully!");
      saved = true;

      roadmapBtn.disabled = false;
      matchBtn.disabled = false;

    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Error saving profile. Try again!");
    }
  });

  roadmapBtn.addEventListener("click", function () {
    if (!saved) {
      alert("Please save your profile first!");
    } else {
      window.location.href = `profile-roadmap.html?profileId=${profileId}`;
    }
  });

  matchBtn.addEventListener("click", function () {
    if (!saved) {
      alert("Please save your profile first!");
    } else {
      window.location.href = `job-match.html?profileId=${profileId}`;
    }
  });
});
