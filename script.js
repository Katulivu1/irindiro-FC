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

// Gallery Functionality
let currentSlide = 0;
const slidesCount = 4; // Number of images

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
