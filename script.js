// Initialize Supabase
const supabaseUrl = 'https://qguvmhnqorafjauogi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFndXZtaG5xb3JhZmphdW9naSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzI2NTYxMjAwLCJleHAiOjIwNDIxMzcyMDB9.ZzZ0W2X4Q5z1p3q8r7t9u0v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Tab functionality
function openTab(tabId) {
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  
  // Load data when tab opens
  if (tabId === 'registration') {
    loadPlayers();
  } else if (tabId === 'contributions') {
    loadContributions();
  }
}

// Player Registration with Supabase
async function registerPlayer() {
  let name = document.getElementById("playerName").value.trim();
  let amount = parseInt(document.getElementById("playerAmount").value);

  if (name === "" || isNaN(amount) || amount < 50) {
    alert("Enter valid name and amount 50 or greater.");
    return;
  }

  try {
    const { data, error } = await supabase
      .from('players')
      .insert([{ name: name, amount: amount, registration_date: new Date().toISOString() }]);

    if (error) throw error;
    
    alert('Player registered successfully!');
    document.getElementById("playerName").value = "";
    document.getElementById("playerAmount").value = "";
    
    // Refresh the list
    loadPlayers();
  } catch (error) {
    console.error('Error registering player:', error);
    alert('Error registering player. Please try again.');
  }
}

// Load Players from Supabase
async function loadPlayers() {
  try {
    const { data: players, error } = await supabase
      .from('players')
      .select('*')
      .order('registration_date', { ascending: false });

    if (error) throw error;

    const playerList = document.getElementById("playerList");
    if (players && players.length > 0) {
      playerList.innerHTML = players.map(player => `
        <tr>
          <td>${player.name}</td>
          <td>${player.amount}</td>
          <td>${new Date(player.registration_date).toLocaleDateString()}</td>
        </tr>
      `).join('');
    } else {
      playerList.innerHTML = '<tr><td colspan="3">No players registered yet.</td></tr>';
    }
  } catch (error) {
    console.error('Error loading players:', error);
    document.getElementById("playerList").innerHTML = 
      '<tr><td colspan="3">Error loading players.</td></tr>';
  }
}

// Add Contribution with Supabase
async function addContribution() {
  let name = document.getElementById("contribName").value.trim();
  let amount = parseInt(document.getElementById("contribAmount").value);

  if (name === "" || isNaN(amount) || amount < 20) {
    alert("Enter valid name and amount 20 or more.");
    return;
  }

  try {
    const { data, error } = await supabase
      .from('contributions')
      .insert([{ name: name, amount: amount, contribution_date: new Date().toISOString() }]);

    if (error) throw error;
    
    alert('Contribution added successfully!');
    document.getElementById("contribName").value = "";
    document.getElementById("contribAmount").value = "";
    
    // Refresh the list and total
    loadContributions();
  } catch (error) {
    console.error('Error adding contribution:', error);
    alert('Error adding contribution. Please try again.');
  }
}

// Load Contributions from Supabase
async function loadContributions() {
  try {
    const { data: contributions, error } = await supabase
      .from('contributions')
      .select('*')
      .order('contribution_date', { ascending: false });

    if (error) throw error;

    const contribList = document.getElementById("contribList");
    let total = 0;
    
    if (contributions && contributions.length > 0) {
      contribList.innerHTML = contributions.map(contrib => {
        total += contrib.amount;
        return `
          <tr>
            <td>${contrib.name}</td>
            <td>${contrib.amount}</td>
            <td>${new Date(contrib.contribution_date).toLocaleDateString()}</td>
          </tr>
        `;
      }).join('');
    } else {
      contribList.innerHTML = '<tr><td colspan="3">No contributions yet.</td></tr>';
    }
    
    document.getElementById("total").textContent = total;
  } catch (error) {
    console.error('Error loading contributions:', error);
    document.getElementById("contribList").innerHTML = 
      '<tr><td colspan="3">Error loading contributions.</td></tr>';
    document.getElementById("total").textContent = 'Error';
  }
}

// Copy M-Pesa Number
function copyMpesaNumber() {
  const number = document.getElementById("mpesaNumber").textContent;
  navigator.clipboard.writeText(number).then(() => {
    alert("M-Pesa number copied to clipboard!");
  }).catch(() => {
    alert("Failed to copy number. Please try manually.");
  });
}

// Gallery Functionality
let currentSlide = 0;
const slidesCount = 4; // Number of squad images

function changeSlide(direction) {
  currentSlide += direction;
  if (currentSlide >= slidesCount) currentSlide = 0;
  if (currentSlide < 0) currentSlide = slidesCount - 1;
  updateGallery();
}

function updateGallery() {
  const track = document.getElementById('galleryTrack');
  track.style.transform = `translateX(-${currentSlide * 25}%)`;
}

// Swipe Detection
let startX = 0;
let endX = 0;

document.addEventListener('DOMContentLoaded', function() {
  // Load initial data
  loadPlayers();
  loadContributions();
  
  const wrapper = document.querySelector('.gallery-wrapper');
  if (wrapper) {
    wrapper.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
    });

    wrapper.addEventListener('touchmove', e => {
      e.preventDefault(); // Prevent scrolling during swipe
    });

    wrapper.addEventListener('touchend', e => {
      endX = e.changedTouches[0].clientX;
      handleSwipe();
    });
  }
});

function handleSwipe() {
  const threshold = 50; // Minimum swipe distance
  const diff = startX - endX;

  if (Math.abs(diff) > threshold) {
    if (diff > 0) {
      // Swipe left - next slide
      changeSlide(1);
    } else {
      // Swipe right - prev slide
      changeSlide(-1);
    }
  }
}
