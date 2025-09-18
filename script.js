// Wait for Supabase to load before running anything
document.addEventListener('DOMContentLoaded', function() {
  console.log('📄 Waiting for Supabase...');
  
  // Wait a moment for Supabase to initialize
  setTimeout(() => {
    console.log('🔗 Initializing Supabase client...');
    
    // Supabase Configuration
    const supabaseUrl = 'https://qguvmhnqorafjauogi.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFndXZtaG5xb3JhZmphdW9naSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzI2NTYxMjAwLCJleHAiOjIwNDIxMzcyMDB9.ZzZ0W2X4Q5z1p3q8r7t9u0v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2';
    
    const supabase = supabase.createClient(supabaseUrl, supabaseKey);
    
    console.log('✅ Supabase ready:', supabase);
    
    // Now define all your functions
    window.supabase = supabase; // Make it global so functions can access it
    
    // Tab Navigation
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
    
    // Player Registration
    window.registerPlayer = async function() {
      const name = document.getElementById("playerName").value.trim();
      const amount = parseInt(document.getElementById("playerAmount").value);

      if (!name || isNaN(amount) || amount < 50) {
        alert("Enter valid name and amount (50 or greater).");
        return;
      }

      try {
        const { error } = await supabase
          .from('players')
          .insert([{ name, amount }]);

        if (error) throw error;
        
        alert('Player registered successfully!');
        document.getElementById("playerName").value = "";
        document.getElementById("playerAmount").value = "";
        loadPlayers();
      } catch (error) {
        console.error('Registration error:', error);
        alert('Error registering player: ' + error.message);
      }
    };
    
    // Load Players
    window.loadPlayers = async function() {
      try {
        console.log('📥 Loading players...');
        const { data: players, error } = await supabase
          .from('players')
          .select('*')
          .order('created_at', { ascending: false });

        const tbody = document.getElementById("playerList");
        
        if (error) throw error;
        
        if (players && players.length > 0) {
          tbody.innerHTML = players.map(player => `
            <tr>
              <td>${player.name}</td>
              <td>${player.amount}</td>
              <td>${new Date(player.created_at).toLocaleDateString()}</td>
            </tr>
          `).join('');
          console.log('✅ Loaded', players.length, 'players');
        } else {
          tbody.innerHTML = '<tr><td colspan="3">No players registered yet.</td></tr>';
          console.log('ℹ️ No players found');
        }
      } catch (error) {
        console.error('💥 Load players error:', error);
        document.getElementById("playerList").innerHTML = 
          '<tr><td colspan="3">Error loading players: ' + error.message + '</td></tr>';
      }
    };
    
    // Add Contribution
    window.addContribution = async function() {
      const name = document.getElementById("contribName").value.trim();
      const amount = parseInt(document.getElementById("contribAmount").value);

      if (!name || isNaN(amount) || amount < 20) {
        alert("Enter valid name and amount (20 or more).");
        return;
      }

      try {
        const { error } = await supabase
          .from('contributions')
          .insert([{ name, amount }]);

        if (error) throw error;
        
        alert('Contribution added successfully!');
        document.getElementById("contribName").value = "";
        document.getElementById("contribAmount").value = "";
        loadContributions();
      } catch (error) {
        console.error('💥 Contribution error:', error);
        alert('Error adding contribution: ' + error.message);
      }
    };
    
    // Load Contributions
    window.loadContributions = async function() {
      try {
        console.log('📥 Loading contributions...');
        const { data: contributions, error } = await supabase
          .from('contributions')
          .select('*')
          .order('created_at', { ascending: false });

        const tbody = document.getElementById("contribList");
        let total = 0;
        
        if (error) throw error;
        
        if (contributions && contributions.length > 0) {
          tbody.innerHTML = contributions.map(contrib => {
            total += contrib.amount;
            return `
              <tr>
                <td>${contrib.name}</td>
                <td>${contrib.amount}</td>
                <td>${new Date(contrib.created_at).toLocaleDateString()}</td>
              </tr>
            `;
          }).join('');
          document.getElementById("total").textContent = total;
          console.log('✅ Loaded', contributions.length, 'contributions, total:', total);
        } else {
          tbody.innerHTML = '<tr><td colspan="3">No contributions yet.</td></tr>';
          document.getElementById("total").textContent = 0;
          console.log('ℹ️ No contributions found');
        }
      } catch (error) {
        console.error('💥 Load contributions error:', error);
        document.getElementById("contribList").innerHTML = 
          '<tr><td colspan="3">Error loading contributions: ' + error.message + '</td></tr>';
        document.getElementById("total").textContent = 'Error';
      }
    };
    
    // Copy M-Pesa Number
    window.copyMpesaNumber = function() {
      const number = document.getElementById("mpesaNumber").textContent;
      navigator.clipboard.writeText(number).then(() => {
        alert("M-Pesa number copied to clipboard!");
      }).catch(() => {
        alert("Failed to copy. Please copy manually: 0708884863");
      });
    };
    
    // Gallery Functions
    let currentSlide = 0;
    const slidesCount = 4;
    
    window.changeSlide = function(direction) {
      currentSlide += direction;
      if (currentSlide >= slidesCount) currentSlide = 0;
      if (currentSlide < 0) currentSlide = slidesCount - 1;
      updateGallery();
    };
    
    function updateGallery() {
      const track = document.getElementById('galleryTrack');
      if (track) {
        track.style.transform = `translateX(-${currentSlide * 25}%)`;
      }
    }
    
    // Touch/Swipe for Gallery
    let startX = 0, endX = 0;
    const wrapper = document.querySelector('.gallery-wrapper');
    if (wrapper) {
      wrapper.addEventListener('touchstart', e => startX = e.touches[0].clientX);
      wrapper.addEventListener('touchmove', e => e.preventDefault());
      wrapper.addEventListener('touchend', e => {
        endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        if (Math.abs(diff) > 50) {
          changeSlide(diff > 0 ? 1 : -1);
        }
      });
    }
    
    // Test connection
    console.log('🚀 Irindiro FC app ready with', supabase ? 'Supabase' : 'NO Supabase');
    
    // Load initial data after everything is ready
    setTimeout(() => {
      loadContributions();
      loadPlayers();
    }, 1000);
    
  }, 500); // Wait 500ms for Supabase to fully load
});
