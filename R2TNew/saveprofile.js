document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("profile-form");

  // Hardcoded user credentials
  const testUser = {
    name: "Khushee",
    email: "khushee@gmail.com",
    password: "12345"
  };

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value; // NEW
    const password = document.getElementById("password")?.value || "12345"; // Optional password input (default to hardcoded)
    const experience = document.getElementById("experience").value;
    const careerGap = document.getElementById("career-gap").value;
    const industry = document.getElementById("industry").value;
    const techStack = document.getElementById("tech-stack").value;

    // Match with hardcoded credentials
    if (email === testUser.email && password === testUser.password) {
      try {
        await db.collection("profiles").add({
          name,
          email,
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
    } else {
      alert("Email or password doesn't match. Access denied.");
    }
  });
});
