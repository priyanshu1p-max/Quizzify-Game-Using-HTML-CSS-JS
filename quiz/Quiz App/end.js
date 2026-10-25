const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const scoreForm = document.getElementById('scoreForm');

const gameResults = JSON.parse(localStorage.getItem('gameResults'));
const mostRecentScore = Number(localStorage.getItem('mostRecentScore')) || 0;
const MAX_HIGH_SCORES = 5;

if (gameResults && Array.isArray(gameResults.players) && gameResults.players.length > 1) {
  const winner = gameResults.players[gameResults.scores.indexOf(Math.max(...gameResults.scores))];
  finalScore.textContent = `Winner: ${winner}`;

  const list = document.createElement('ul');
  list.className = 'high-score-list';
  list.innerHTML = gameResults.players
    .map((player, index) => `<li class="high-score-item"><span>${player}</span><span>${gameResults.scores[index]} pts</span></li>`)
    .join('');

  scoreForm.replaceWith(list);
  saveScoreBtn.remove();

  const resultSummary = document.createElement('p');
  resultSummary.className = 'score-status';
  resultSummary.textContent = `${winner} takes the round!`;
  finalScore.insertAdjacentElement('afterend', resultSummary);
} else {
  finalScore.textContent = `Score: ${mostRecentScore}`;

  const statusText = document.createElement('p');
  statusText.className = 'score-status';
  statusText.textContent = mostRecentScore >= 60 ? 'Excellent work!' : mostRecentScore >= 30 ? 'Nice run!' : 'Keep practicing!';
  finalScore.insertAdjacentElement('afterend', statusText);

  username.addEventListener('input', () => {
    saveScoreBtn.disabled = username.value.trim().length === 0;
  });

  scoreForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const trimmedName = username.value.trim();
    if (!trimmedName) {
      return;
    }

    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    const entry = {
      name: trimmedName,
      score: mostRecentScore,
      date: new Date().toLocaleDateString()
    };

    highScores.push(entry);
    highScores.sort((a, b) => b.score - a.score);
    const topScores = highScores.slice(0, MAX_HIGH_SCORES);

    localStorage.setItem('highScores', JSON.stringify(topScores));
    window.location.href = './highscores.html';
  });
}