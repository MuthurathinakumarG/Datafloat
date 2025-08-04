from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import pandas as pd
from transformers import pipeline

# Start Flask app
app = Flask(__name__)
# Enable Cross-Origin Resource Sharing (React frontend needs this)
CORS(app)

# SQLite database path
DATABASE = 'users.db'

# Load the transformer-based emotion classification model
emotion_classifier = pipeline(
    "text-classification",
    model="j-hartmann/emotion-english-distilroberta-base",
    return_all_scores=True  # returns probabilities for each emotion
)

# ------------------- DB SETUP -------------------
def init_db():
    """Creates the database tables if they don't exist."""
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()

        # Table for user registration
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS register (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                phone TEXT,
                email TEXT UNIQUE,
                password TEXT
            )
        ''')

        # Table for user feedback
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS feedback (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                email TEXT,
                rating INTEGER,
                comment TEXT,
                emotion TEXT,
                submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # Table for both AI-predicted and uploaded emotions
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS emotions (
                email TEXT,
                text TEXT,
                emotion TEXT
            )
        ''')

        conn.commit()

# ------------------- HELPERS -------------------
def predict_emotion(text):
    """Predicts the dominant emotion of the input text using HuggingFace transformer."""
    if not text or not text.strip():
        return "neutral"

    scores = emotion_classifier(text)[0]
    top_emotion = max(scores, key=lambda x: x['score'])['label'].lower()

    # Standardized emotion mapping
    emotion_map = {
        "joy": "happiness", "love": "love", "anger": "anger", "fear": "worry",
        "surprise": "surprise", "sadness": "sadness", "disgust": "hate",
        "neutral": "neutral", "enthusiasm": "enthusiasm", "boredom": "boredom",
        "relief": "relief", "empty": "empty", "fun": "fun", "hate": "hate"
    }

    return emotion_map.get(top_emotion, "neutral")

# ------------------- USER ROUTES -------------------
@app.route('/users', methods=['POST'])
def create_user():
    """Registers a new user"""
    data = request.get_json()
    name, phone, email, password = data.get('name'), data.get('phone'), data.get('email'), data.get('password')

    if not all([name, phone, email, password]):
        return jsonify({'error': 'All fields are required'}), 400

    try:
        with sqlite3.connect(DATABASE) as conn:
            cursor = conn.cursor()
            cursor.execute(
                'INSERT INTO register (name, phone, email, password) VALUES (?, ?, ?, ?)',
                (name, phone, email, password)
            )
            conn.commit()
            return jsonify({'message': 'User registered successfully'}), 201
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Email already exists'}), 409

@app.route('/users1', methods=['POST'])
def get_user_by_email():
    """Fetches a user by email"""
    email = request.get_json().get('email')
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT name, email FROM register WHERE email = ?', (email,))
        row = cursor.fetchone()
        if row:
            return jsonify({'name': row[0], 'email': row[1]})
    return jsonify({'error': 'User not found'}), 404

@app.route('/users', methods=['GET'])
def list_users():
    """Returns all registered users"""
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT id, name, phone, email, password FROM register')
        users = [
            {
                'id': row[0],
                'name': row[1],
                'phone': row[2],
                'email': row[3],
                'password': row[4]
            } for row in cursor.fetchall()
        ]
    return jsonify(users)

# ------------------- FEEDBACK ROUTES -------------------
@app.route('/feedback', methods=['POST'])
def submit_feedback():
    """Handles feedback submission and emotion prediction"""
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    rating = data.get('rating')
    comment = data.get('comment', '')

    if not all([name, email, rating]):
        return jsonify({'error': 'Name, email, and rating are required'}), 400

    # Predict emotion from the comment
    emotion = predict_emotion(comment)

    try:
        with sqlite3.connect(DATABASE) as conn:
            cursor = conn.cursor()

            # Insert into feedback table
            cursor.execute(
                'INSERT INTO feedback (name, email, rating, comment, emotion) VALUES (?, ?, ?, ?, ?)',
                (name, email, rating, comment, emotion)
            )

            # Insert into emotion table for tracking
            cursor.execute(
                'INSERT INTO emotions (email, text, emotion) VALUES (?, ?, ?)',
                (email, comment, emotion)
            )

            conn.commit()
            return jsonify({
                'message': 'Feedback submitted and emotion stored',
                'emotion': emotion
            }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/feedback', methods=['GET'])
def get_feedback():
    """Returns all feedback records with emotion"""
    try:
        with sqlite3.connect(DATABASE) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT f.id, f.name, f.email, f.rating, f.comment, f.submitted_at, e.emotion
                FROM feedback f
                LEFT JOIN emotions e ON f.email = e.email
                ORDER BY f.submitted_at DESC
            ''')
            data = [
                {
                    'id': row[0],
                    'name': row[1],
                    'email': row[2],
                    'rating': row[3],
                    'comment': row[4],
                    'submitted_at': row[5],
                    'emotion': row[6]
                } for row in cursor.fetchall()
            ]
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ------------------- EXCEL UPLOAD ROUTE -------------------
@app.route('/bulk-insert', methods=['POST'])
def bulk_insert_emotion_data():
    """Uploads Excel dataset and stores emotion-labeled data"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    try:
        df = pd.read_excel(file, engine='openpyxl')
        required_columns = ['text', 'Emotion']
        if not all(col in df.columns for col in required_columns):
            return jsonify({'error': 'Missing required columns'}), 400

        data = df[required_columns].dropna().values.tolist()
        with sqlite3.connect(DATABASE) as conn:
            cursor = conn.cursor()
            cursor.executemany('INSERT INTO emotions (text, emotion) VALUES (?, ?)', data)
            conn.commit()
        return jsonify({'message': f'{len(data)} records inserted'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ------------------- EMOTION STATS -------------------
@app.route('/records', methods=['GET'])
def get_emotion_stats():
    """Returns emotion distribution for dashboard"""
    try:
        with sqlite3.connect(DATABASE) as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT emotion, COUNT(*) FROM emotions GROUP BY emotion')
            rows = cursor.fetchall()

            emotion_list = [
                "boredom", "anger", "empty", "enthusiasm", "fun", "happiness",
                "hate", "love", "neutral", "relief", "sadness", "surprise", "worry"
            ]
            result = {e: 0 for e in emotion_list}
            for emotion, count in rows:
                if emotion in result:
                    result[emotion] += count

            return jsonify([{"emotion": "All Emotions", **result}])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ------------------- COMBINED EMOTION COUNT -------------------
@app.route('/combined-emotion-count', methods=['GET'])
def combined_emotion_count():
    """Combines emotions from feedback and uploaded Excel to show total emotion distribution"""
    try:
        with sqlite3.connect(DATABASE) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT emotion, COUNT(*) AS count
                FROM (
                    SELECT emotion FROM emotions
                    UNION ALL
                    SELECT emotion FROM feedback
                ) AS combined
                GROUP BY emotion
                ORDER BY count DESC
            ''')
            rows = cursor.fetchall()
            result = [{'emotion': row[0], 'count': row[1]} for row in rows]
            return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ------------------- RUN THE APP -------------------
if __name__ == '__main__':
    init_db()  # Make sure DB is ready
    app.run(debug=True)  # Start server in debug mode
