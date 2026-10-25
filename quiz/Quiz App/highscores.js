const highScoresList = document.getElementById('highScoresList');
const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

if (!highScores.length) {
  highScoresList.innerHTML = '<li class="empty-state">No scores yet. Be the first to play!</li>';
} else {
  highScoresList.innerHTML = highScores
    .map((score, index) => {
      const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '•';
      return `
        <li class="high-score-item ${index < 3 ? 'top-rank' : ''}">
          <span class="rank-label">${medal} ${index + 1}. ${score.name}</span>
          <span class="score-label">${score.score} pts</span>
        </li>
      `;
    })
    .join('');
}