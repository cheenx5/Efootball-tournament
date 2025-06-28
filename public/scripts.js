const API_URL = "https://script.google.com/macros/s/AKfycbz6WNCK1_2ZK5zoSf_9s4gLjCGdtunDPPrHq-iyg4hAaQuqOMvQUTKAVAOkFpK7ssrUYA/exec";

// Shared functions
async function fetchPlayers() {
  const response = await fetch(API_URL);
  return await response.json();
}

function renderLeaderboard(players, elementId = 'leaderboard') {
  const container = document.getElementById(elementId);
  container.innerHTML = players.map(player => `
    <div class="player-card ${player.qualified === 'YES' ? 'qualified' : ''}">
      <span>${player.ytUsername}</span>
      <span>${player.points} pts</span>
      <span>${player.qualified === 'YES' ? '✅ Qualified' : '❌ Needs ${500 - player.points} more'}</span>
    </div>
  `).join('');
}

// Public registration
async function register() {
  const username = document.getElementById('ytUsername').value.trim();
  if (!username) return alert('Enter YouTube username');
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: "register", ytUsername: username })
    });
    const result = await response.json();
    alert(result.success ? "Registered!" : `Error: ${result.error}`);
    refreshLeaderboard();
  } catch (error) {
    alert("Network error - try again");
  }
}

// Admin controls
async function updatePoints() {
  const pin = document.getElementById('adminPin').value;
  const username = document.getElementById('playerName').value;
  const points = document.getElementById('playerPoints').value;
  
  if (pin !== "6756") return alert("Wrong PIN");
  if (!username || !points) return alert("Fill all fields");
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({
        action: "updatePoints",
        pin: pin,
        ytUsername: username,
        points: points
      })
    });
    const result = await response.json();
    alert(result.success ? "Points updated!" : `Error: ${result.error}`);
    refreshAdminLeaderboard();
  } catch (error) {
    alert("Update failed");
  }
}

// Initialize
if (document.getElementById('leaderboard')) {
  fetchPlayers().then(players => renderLeaderboard(players));
}

if (document.getElementById('adminLeaderboard')) {
  fetchPlayers().then(players => renderLeaderboard(players, 'adminLeaderboard'));
}
