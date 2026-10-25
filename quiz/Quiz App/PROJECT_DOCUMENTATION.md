# Quizzify Project Documentation

## 1. Project Overview

Quizzify is a browser-based quiz application built using plain HTML, CSS, and JavaScript. It is designed as a local multiplayer quiz game where players answer questions from categories such as General Knowledge, India, and Science.

The application does not require a backend or database. It stores user settings and top scores in browser localStorage and runs directly from static files.

## 2. Main Features

- Category selection before starting the game
- Difficulty levels: Easy, Medium, Hard
- Game modes: Solo, Multiplayer, Team vs Team
- Custom player names and number of players
- Selectable number of questions
- Countdown timer for each question
- Score tracking and streak system
- Correct/wrong/timeout feedback sounds using Web Audio API
- High score tracking using localStorage
- Responsive design for desktop and smaller screens

## 3. Project Structure

- index.html
  - Home screen and setup form
- game.html
  - Quiz gameplay screen
- end.html
  - Final result summary screen
- highscores.html
  - Leaderboard display
- app.css
  - Styling and animations
- game.js
  - Core game logic
- end.js
  - End-of-game summary and local high-score saving
- highscores.js
  - High score rendering
- questions.json
  - Local question dataset

## 4. How the App Works

### 4.1 Home Screen

The app starts at index.html. This page lets the player:

- choose a category
- choose difficulty
- choose mode
- set number of players
- enter optional player names
- choose total number of questions

When the user clicks Play, the selected values are saved in localStorage and the browser redirects to game.html.

### 4.2 Game Flow

When game.html loads, the script reads the saved values from localStorage:

- selected category
- difficulty
- game mode
- player list
- question count

It then loads the question list from questions.json. If the file is unavailable or fails to load, the app falls back to a built-in array of sample questions in game.js.

The game loop works like this:

1. A question is selected from the current category.
2. The timer starts based on the selected difficulty.
3. The player answers one of four options.
4. The system checks correctness.
5. Score and streak are updated.
6. If the player answers correctly, the score increases.
7. If the answer is wrong or the timer reaches zero, the correct answer is revealed and the turn advances.
8. The process repeats until all selected questions are completed.

### 4.3 Timer and Difficulty

The timer is controlled by the difficulty settings in game.js:

- Easy: 18 seconds
- Medium: 13 seconds
- Hard: 10 seconds

The timer decreases every second. When the time reaches 5 seconds, the timer is visually flagged as warning. If it reaches 0, the app triggers a timeout sound and moves to the next question.

### 4.4 Multiplayer and Team Mode

The app supports:

- Solo mode for one player
- Multiplayer hot-seat mode where each player takes turns
- Team vs Team mode where groups are treated as two teams

Scores are tracked in an array, and the current player index changes after each question. At the end of the round, the highest score is picked as the winner or winning team.

### 4.5 Scoring System

Scoring logic is handled in game.js. A correct answer awards points and updates the streak.

- score is a running total for the current player
- playerScores stores the total for each player
- currentStreak tracks consecutive correct answers
- the streak badge shows the player’s current streak value

### 4.6 Feedback Sounds

The app uses the browser Web Audio API to play short tones for:

- correct answer
- wrong answer
- timeout / buzzer

This makes the game feel more interactive and game-like without needing any external library.

## 5. Local Data Storage

The application uses localStorage to persist important state, including:

- selected category
- selected difficulty
- selected mode
- player names
- question count
- most recent score
- high scores
- final game results

This is useful because the app is static and does not rely on a backend service.

## 6. Question Data Format

Questions are stored in questions.json as objects with the following structure:

```json
{
  "category": "Science",
  "question": "What is the chemical formula of water?",
  "choices": ["CO2", "H2O", "O2", "NaCl"],
  "answer": 2
}
```

Each object contains:

- category
- question
- choices
- answer index

## 7. End Screen and Leaderboard

After the game ends:

- end.html displays the winner and score summary
- end.js checks whether the game was multiplayer or solo
- in solo mode, the user can save their score to the leaderboard
- highscores.html loads all saved scores from localStorage and displays them in order

## 8. How to Run the Project

Because it is a static web app, there is no installation step required.

### Option 1: Open directly in a browser

- Open index.html in your browser.

### Option 2: Run using a local server

From the project folder, you can run a simple local server such as:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## 9. Important Notes

- The project is intentionally built with no frameworks or dependencies.
- It is meant for local play only.
- All data is stored in the browser, so it is not shared across devices.
- The question bank is local and can be edited easily in questions.json.

## 10. Future Improvements

Possible future enhancements include:

- online multiplayer with a backend
- room codes and real-time synchronization
- sound controls and audio settings
- more categories and larger question banks
- admin panel for adding questions

## 11. Summary

Quizzify is a complete local quiz game system built with HTML, CSS, and JavaScript. It demonstrates a practical browser-based game architecture with state management, timers, multiplayer score logic, localStorage persistence, and responsive styling. The app is easy to run, easy to customize, and suitable as a lightweight quiz project or learning example.
