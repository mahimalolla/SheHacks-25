document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("profile-form");
  
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
  
      const name = document.getElementById("name").value;
      const experience = document.getElementById("experience").value;
      const careerGap = document.getElementById("career-gap").value;
      const industry = document.getElementById("industry").value;
      const techStack = document.getElementById("tech-stack").value;
  
      try {
        await db.collection("profiles").add({
          name,
          experience,
          careerGap,
          industry,
          techStack,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
  
        alert("Profile saved successfully!");
        window.location.href = "dashboard.html";
      } catch (error) {
        console.error("Error saving profile: ", error);
        alert("Error saving profile. Try again!");
      }
    });
  });
  