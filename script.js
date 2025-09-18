function openTab(tabId) {
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
}

function registerPlayer() {
  let name = document.getElementById("playerName").value.trim();
  let amount = parseInt(document.getElementById("playerAmount").value);

  if (name === "" || isNaN(amount) || amount < 50) {
    alert("Enter valid name and amount 50 or greater.");
    return;
  }

  let row = `<tr><td>${name}</td><td>${amount}</td></tr>`;
  document.getElementById("playerList").innerHTML += row;

  document.getElementById("playerName").value = "";
  document.getElementById("playerAmount").value = "";
}

let total = 0;
function addContribution() {
  let name = document.getElementById("contribName").value.trim();
  let amount = parseInt(document.getElementById("contribAmount").value);

  if (name === "" || isNaN(amount) || amount < 20) {
    alert("Enter valid name and amount 20 or more.");
    return;
  }

  let row = `<tr><td>${name}</td><td>${amount}</td></tr>`;
  document.getElementById("contribList").innerHTML += row;

  total += amount;
  document.getElementById("total").innerText = total;

  document.getElementById("contribName").value = "";
  document.getElementById("contribAmount").value = "";
}
