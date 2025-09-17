// Tab functionality
const buttons = document.querySelectorAll(".tab-button");
const contents = document.querySelectorAll(".tab-content");

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    buttons.forEach(b => b.classList.remove("active"));
    contents.forEach(c => c.classList.remove("active"));

    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

// Load README.md content dynamically
fetch("https://raw.githubusercontent.com/Katulivu1/irindiro-FC/main/README.md")
  .then(response => response.text())
  .then(markdown => {
    document.getElementById("readme-content").innerText = markdown;
  })
  .catch(error => {
    document.getElementById("readme-content").innerText = "⚠️ Failed to load club history.";
    console.error(error);
  });
