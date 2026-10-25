from reportlab.lib.pagesizes import LETTER
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, ListFlowable, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

OUTPUT_PATH = r"c:\Users\chhim\Downloads\quiz\Quiz App\Quiz_App_Documentation.pdf"

styles = getSampleStyleSheet()
heading_style = ParagraphStyle(
    'Heading1',
    parent=styles['Title'],
    fontSize=20,
    leading=24,
    spaceAfter=18,
    alignment=1,
)
subheading_style = ParagraphStyle(
    'Heading2',
    parent=styles['Heading2'],
    fontSize=13,
    leading=16,
    spaceBefore=12,
    spaceAfter=8,
)
body_style = ParagraphStyle(
    'BodyText',
    parent=styles['BodyText'],
    fontSize=10,
    leading=14,
    spaceAfter=6,
)

story = []

story.append(Paragraph('Quizzify Project Documentation', heading_style))
story.append(Paragraph('A browser-based local multiplayer quiz game built with HTML, CSS, and JavaScript.', body_style))
story.append(Spacer(1, 0.2 * inch))

sections = [
    ('1. Project Overview', 'Quizzify is a browser-based quiz game designed for solo play, multiplayer hot-seat play, and team-vs-team mode. It runs entirely in the browser and uses localStorage for saving selections and leaderboard scores.'),
    ('2. Main Features', 'Category selection, difficulty levels, mode selection, custom player names, question count selection, countdown timer, scoring, streak system, sound effects, and high score storage.'),
    ('3. Project Structure', 'The app is split into HTML pages for the home screen, gameplay screen, result screen, and leaderboard, with supporting CSS and JavaScript files for logic and styling.'),
    ('4. How the Home Screen Works', 'The index page lets the user choose the category, difficulty, number of players, player names, and number of questions. These values are saved in localStorage and passed into the game session.'),
    ('5. How the Game Works', 'The game page reads the saved settings, selects questions from the chosen category, starts a timer, and evaluates each answer. Score, streak, player turn, and progress are updated during play.'),
    ('6. Difficulty and Timer', 'Easy = 18s, Medium = 13s, Hard = 10s. The timer decreases every second and triggers a warning when the countdown reaches 5 seconds.'),
    ('7. Multiplayer Logic', 'The game tracks each player in an array and rotates turns after every question. Team mode treats the players as two teams, and the result screen identifies the highest total score.'),
    ('8. Local Storage', 'localStorage stores category, difficulty, player list, game mode, question count, recent score, and saved leaderboard entries. This allows the app to remain fully static and local.'),
    ('9. Question Data', 'Questions are stored in questions.json in a structured JSON format with category, question, four answer choices, and the correct answer index.'),
    ('10. Result and High Score Flow', 'When the quiz ends, the app redirects to the result screen. For solo mode, the user can save a score to the leaderboard. The leaderboard page reads the saved results and displays them in order.'),
    ('11. Run the App', 'Open index.html directly in a browser or run a local server such as: python -m http.server 8000 and then visit http://localhost:8000.'),
    ('12. Conclusion', 'This project works as a lightweight, no-framework quiz game that is easy to run, modify, and customize. It demonstrates practical JavaScript logic, browser storage, UI flow, and game-state management.')
]

for title, text in sections:
    story.append(Paragraph(title, subheading_style))
    story.append(Paragraph(text, body_style))
    story.append(Spacer(1, 0.1 * inch))

story.append(Paragraph('Key files:', subheading_style))
files = [
    'index.html — configuration and home page',
    'game.html — quiz gameplay view',
    'game.js — question logic, timer, score tracking, multiplayer flow',
    'end.js — final result handling and saving scores',
    'highscores.js — leaderboard rendering',
    'questions.json — local question bank',
    'app.css — UI styling and animations'
]
story.append(ListFlowable([Paragraph(item, body_style) for item in files], bulletType='bullet', bulletText='•', leftIndent=20, spaceBefore=6, spaceAfter=6))

story.append(PageBreak())
story.append(Paragraph('Developer Notes', subheading_style))
story.append(Paragraph('This app was built as a fully front-end quiz project. It does not use a backend or database. The localStorage mechanism allows the app to retain settings and scores without external services. The game is intentionally lightweight so it can be opened and run without any setup or build tool.', body_style))
story.append(Spacer(1, 0.2 * inch))
story.append(Paragraph('Project status: Completed demo / local quiz game with multiplayer features.', body_style))

pdf = SimpleDocTemplate(
    OUTPUT_PATH,
    pagesize=LETTER,
    rightMargin=0.7 * inch,
    leftMargin=0.7 * inch,
    topMargin=0.7 * inch,
    bottomMargin=0.7 * inch,
)
pdf.build(story)
print(f'PDF generated: {OUTPUT_PATH}')
