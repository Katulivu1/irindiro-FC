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

// Load README.md into About tab
fetch("https://raw.githubusercontent.com/Katulivu1/irindiro-FC/main/README.md")
  .then(response => response.text())
  .then(markdown => {
    document.getElementById("readme-content").innerText = markdown;
  })
  .catch(() => {
    document.getElementById("readme-content").innerText = "⚠️ Failed to load club history.";
  });

// Players & Contributions Storage (local only for now)
let players = [];
let contributions = [];

// Registration Form
document.getElementById("registration-form").addEventListener("submit", function(e) {
  e.preventDefault();
  const name = document.getElementById("playerName").value.trim().toUpperCase();
  const amount = parseInt(document.getElementById("amount").value);

  if (amount < 50) {
    document.getElementById("regMessage").textContent = "❌ Amount must be KES 50 or above!";
    return;
  }

  players.push({ name, amount });
  renderPlayers();

  document.getElementById("regMessage").textContent = `✅ ${name} registered successfully!`;
  document.getElementById("playerName").value = "";
  document.getElementById("amount").value = "";
});

// Render Players
function renderPlayers() {
  const ul = document.getElementById("player-list");
  ul.innerHTML = "";
  players.forEach((p, i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}. ${p.name} – Paid: ${p.amount}`;
    ul.appendChild(li);
  });
}

// Contributions Form
document.getElementById("contrib-form").addEventListener("submit", function(e) {
  e.preventDefault();
  const name = document.getElementById("contribName").value.trim().toUpperCase();
  const amount = parseInt(document.getElementById("contribAmount").value);

  if (amount < 20) {
    alert("❌ Contribution must be at least KES 20!");
    return;
  }

  contributions.push({ name, amount });
  renderContributions();

  document.getElementById("contribName").value = "";
  document.getElementById("contribAmount").value = "";
});

// Render Contributions
function renderContributions() {
  const tbody = document.getElementById("contrib-body");
  tbody.innerHTML = "";
  let total = 0;

  contributions.forEach((c, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${i + 1}</td><td>${c.name}</td><td>${c.amount}</td>`;
    tbody.appendChild(tr);
    total += c.amount;
  });

  document.getElementById("total-contrib").textContent = total;
}
