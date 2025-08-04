# from flask import Flask, request, jsonify
# import sqlite3

# app = Flask(__name__)
# DATABASE = 'users.db'  # Reuse the same database

# # ✅ Initialize DB (create `feedback` table if not exists)
# def init_db():
#     with sqlite3.connect(DATABASE) as conn:
#         cursor = conn.cursor()
#         cursor.execute('''
#             CREATE TABLE IF NOT EXISTS feedback (
#                 id INTEGER PRIMARY KEY AUTOINCREMENT,
#                 name TEXT NOT NULL,
#                 email TEXT NOT NULL,
#                 rating INTEGER CHECK(rating BETWEEN 1 AND 5),
#                 comment TEXT,
#                 submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
#             )
#         ''')
#         conn.commit()

# # ✅ Insert into `feedback` table
# def insert_feedback(name, email, rating, comment):
#     with sqlite3.connect(DATABASE) as conn:
#         cursor = conn.cursor()
#         cursor.execute(
#             'INSERT INTO feedback (name, email, rating, comment) VALUES (?, ?, ?, ?)',
#             (name, email, rating, comment)
#         )
#         conn.commit()
#         return cursor.lastrowid

# # ✅ Get all feedback
# def get_all_feedback():
#     with sqlite3.connect(DATABASE) as conn:
#         cursor = conn.cursor()
#         cursor.execute('SELECT id, name, email, rating, comment, submitted_at FROM feedback ORDER BY submitted_at DESC')
#         rows = cursor.fetchall()
#         return [
#             {
#                 'id': row[0],
#                 'name': row[1],
#                 'email': row[2],
#                 'rating': row[3],
#                 'comment': row[4],
#                 'submitted_at': row[5]
#             }
#             for row in rows
#         ]

# # ✅ POST /feedback - create feedback
# @app.route('/feedback', methods=['POST'])
# def create_feedback():
#     data = request.get_json()
#     name = data.get('name')
#     email = data.get('email')
#     rating = data.get('rating')
#     comment = data.get('comment', '')

#     if not all([name, email, rating]):
#         return jsonify({'error': 'Name, email, and rating are required'}), 400

#     try:
#         feedback_id = insert_feedback(name, email, rating, comment)
#         return jsonify({'message': 'Feedback submitted', 'feedback_id': feedback_id}), 201
#     except Exception as e:
#         return jsonify({'error': 'Failed to submit feedback'}), 500

# # ✅ GET /feedback - list all feedback
# @app.route('/feedback', methods=['GET'])
# def list_feedback():
#     feedback = get_all_feedback()
#     return jsonify(feedback)

# # ✅ Start the server
# if __name__ == '__main__':
#     init_db()
#     app.run(debug=True)


# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import sqlite3
# from transformers import pipeline

# app = Flask(__name__)
# CORS(app)

# DATABASE = 'users.db'

# # ✅ Load the emotion classification model
# emotion_classifier = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base", return_all_scores=True)

# # ✅ Initialize both `feedback` and `emotion` tables
# def init_db():
#     with sqlite3.connect(DATABASE) as conn:
#         cursor = conn.cursor()
#         # Feedback table
#         cursor.execute('''
#             CREATE TABLE IF NOT EXISTS feedback (
#                 id INTEGER PRIMARY KEY AUTOINCREMENT,
#                 name TEXT NOT NULL,
#                 email TEXT NOT NULL,
#                 rating INTEGER CHECK(rating BETWEEN 1 AND 5),
#                 comment TEXT,
#                 submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
#             )
#         ''')
#         # Emotion prediction table
#         cursor.execute('''
#             CREATE TABLE IF NOT EXISTS emotion (
#                 id INTEGER PRIMARY KEY AUTOINCREMENT,
#                 feedback_id INTEGER,
#                 text TEXT,
#                 emotion TEXT,
#                 FOREIGN KEY(feedback_id) REFERENCES feedback(id)
#             )
#         ''')
#         conn.commit()

# # ✅ Insert feedback
# def insert_feedback(name, email, rating, comment):
#     with sqlite3.connect(DATABASE) as conn:
#         cursor = conn.cursor()
#         cursor.execute(
#             'INSERT INTO feedback (name, email, rating, comment) VALUES (?, ?, ?, ?)',
#             (name, email, rating, comment)
#         )
#         conn.commit()
#         return cursor.lastrowid

# # ✅ Insert emotion prediction
# def insert_prediction(feedback_id, text, emotion):
#     with sqlite3.connect(DATABASE) as conn:
#         cursor = conn.cursor()
#         cursor.execute(
#             "INSERT INTO emotion (feedback_id, text, emotion) VALUES (?, ?, ?)",
#             (feedback_id, text, emotion)
#         )
#         conn.commit()

# # ✅ Predict emotion from text
# def predict_emotion(text):
#     scores = emotion_classifier(text)[0]
#     top_emotion = max(scores, key=lambda x: x['score'])["label"].lower()

#     supported_emotions = [
#         "boredom", "anger", "empty", "enthusiasm", "fun",
#         "happiness", "hate", "love", "neutral", "relief",
#         "sadness", "surprise", "worry"
#     ]
#     return top_emotion if top_emotion in supported_emotions else "neutral"

# # ✅ POST /feedback - create feedback and analyze emotion
# @app.route('/feedback', methods=['POST'])
# def create_feedback():
#     data = request.get_json()
#     name = data.get('name')
#     email = data.get('email')
#     rating = data.get('rating')
#     comment = data.get('comment', '')

#     if not all([name, email, rating]):
#         return jsonify({'error': 'Name, email, and rating are required'}), 400

#     try:
#         feedback_id = insert_feedback(name, email, rating, comment)
#         predicted_emotion = predict_emotion(comment)
#         insert_prediction(feedback_id, comment, predicted_emotion)

#         return jsonify({
#             'message': 'Feedback submitted and emotion analyzed',
#             'feedback_id': feedback_id,
#             'predicted_emotion': predicted_emotion
#         }), 201
#     except Exception as e:
#         return jsonify({'error': 'Failed to process feedback'}), 500

# # ✅ GET /feedback - list all feedback
# @app.route('/feedback', methods=['GET'])
# def list_feedback():
#     with sqlite3.connect(DATABASE) as conn:
#         cursor = conn.cursor()
#         cursor.execute('''
#             SELECT f.id, f.name, f.email, f.rating, f.comment, f.submitted_at, e.emotion
#             FROM feedback f
#             LEFT JOIN emotion e ON f.id = e.feedback_id
#             ORDER BY f.submitted_at DESC
#         ''')
#         rows = cursor.fetchall()

#         return jsonify([
#             {
#                 'id': row[0],
#                 'name': row[1],
#                 'email': row[2],
#                 'rating': row[3],
#                 'comment': row[4],
#                 'submitted_at': row[5],
#                 'predicted_emotion': row[6]
#             }
#             for row in rows
#         ])

# # ✅ Start the server
# if __name__ == '__main__':
#     init_db()
#     app.run(debug=True)


# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import sqlite3
# from transformers import pipeline

# app = Flask(__name__)
# CORS(app)

# DATABASE = 'users.db'

# # Load emotion model
# emotion_classifier = pipeline(
#     "text-classification",
#     model="j-hartmann/emotion-english-distilroberta-base",
#     return_all_scores=True
# )

# # Initialize database
# def init_db():
#     with sqlite3.connect(DATABASE) as conn:
#         cursor = conn.cursor()
#         # Feedback table
#         cursor.execute('''
#             CREATE TABLE IF NOT EXISTS feedback (
#                 id INTEGER PRIMARY KEY AUTOINCREMENT,
#                 name TEXT NOT NULL,
#                 email TEXT NOT NULL,
#                 rating INTEGER CHECK(rating BETWEEN 1 AND 5),
#                 comment TEXT,
#                 submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
#             )
#         ''')
#         # Emotion table
#         cursor.execute('''
#             CREATE TABLE IF NOT EXISTS emotion (
#                 id INTEGER PRIMARY KEY AUTOINCREMENT,
#                 feedback_id INTEGER,
#                 text TEXT,
#                 emotion TEXT,
#                 FOREIGN KEY(feedback_id) REFERENCES feedback(id)
#             )
#         ''')
#         conn.commit()

# # Insert feedback into DB
# def insert_feedback(name, email, rating, comment):
#     with sqlite3.connect(DATABASE) as conn:
#         cursor = conn.cursor()
#         cursor.execute(
#             'INSERT INTO feedback (name, email, rating, comment) VALUES (?, ?, ?, ?)',
#             (name, email, rating, comment)
#         )
#         conn.commit()
#         return cursor.lastrowid

# # Insert emotion
# def insert_prediction(feedback_id, text, emotion):
#     with sqlite3.connect(DATABASE) as conn:
#         cursor = conn.cursor()
#         cursor.execute(
#             "INSERT INTO emotion (feedback_id, text, emotion) VALUES (?, ?, ?)",
#             (feedback_id, text, emotion)
#         )
#         conn.commit()

# # Predict emotion with mapped label
# def predict_emotion(text):
#     if not text or not text.strip():
#         return "neutral"

#     scores = emotion_classifier(text)[0]
#     top_emotion = max(scores, key=lambda x: x['score'])['label'].lower()

#     # Mapping model output to our 13 emotion labels
#     mapping = {
#         "joy": "happiness",
#         "love": "love",
#         "anger": "anger",
#         "fear": "worry",
#         "surprise": "surprise",
#         "sadness": "sadness",
#         "disgust": "hate",
#         "neutral": "neutral",
#         "enthusiasm": "enthusiasm",
#         "boredom": "boredom",
#         "relief": "relief",
#         "empty": "empty",
#         "fun": "fun",
#         "hate": "hate"
#     }

#     return mapping.get(top_emotion, "neutral")

# # POST /feedback - Save and analyze
# @app.route('/feedback', methods=['POST'])
# def create_feedback():
#     data = request.get_json()
#     name = data.get('name')
#     email = data.get('email')
#     rating = data.get('rating')
#     comment = data.get('comment', '')

#     if not all([name, email, rating]):
#         return jsonify({'error': 'Name, email, and rating are required'}), 400

#     try:
#         feedback_id = insert_feedback(name, email, rating, comment)
#         predicted_emotion = predict_emotion(comment)
#         insert_prediction(feedback_id, comment, predicted_emotion)

#         return jsonify({
#             'message': 'Feedback submitted and emotion analyzed',
#             'feedback_id': feedback_id,
#             'predicted_emotion': predicted_emotion
#         }), 201
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# # GET /feedback - List all
# @app.route('/feedback', methods=['GET'])
# def list_feedback():
#     with sqlite3.connect(DATABASE) as conn:
#         cursor = conn.cursor()
#         cursor.execute('''
#             SELECT f.id, f.name, f.email, f.rating, f.comment, f.submitted_at, e.emotion
#             FROM feedback f
#             LEFT JOIN emotion e ON f.id = e.feedback_id
#             ORDER BY f.submitted_at DESC
#         ''')
#         rows = cursor.fetchall()

#         return jsonify([
#             {
#                 'id': row[0],
#                 'name': row[1],
#                 'email': row[2],
#                 'rating': row[3],
#                 'comment': row[4],
#                 'submitted_at': row[5],
#                 'predicted_emotion': row[6]
#             }
#             for row in rows
#         ])

# # Start server
# if __name__ == '__main__':
#     init_db()
#     app.run(debug=True)


from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from transformers import pipeline

app = Flask(__name__)
CORS(app)

DATABASE = 'users.db'

# Load the emotion analysis model
emotion_classifier = pipeline(
    "text-classification",
    model="j-hartmann/emotion-english-distilroberta-base",
    return_all_scores=True
)

# Initialize database and tables
def init_db():
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()

        # Feedback table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS feedback (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                rating INTEGER CHECK(rating BETWEEN 1 AND 5),
                comment TEXT,
                submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # Emotion analysis table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS emotion (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                feedback_id INTEGER,
                text TEXT,
                emotion TEXT,
                FOREIGN KEY(feedback_id) REFERENCES feedback(id)
            )
        ''')
        conn.commit()

# Insert feedback
def insert_feedback(name, email, rating, comment):
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO feedback (name, email, rating, comment) VALUES (?, ?, ?, ?)',
            (name, email, rating, comment)
        )
        conn.commit()
        return cursor.lastrowid

# Insert emotion prediction
def insert_prediction(feedback_id, text, emotion):
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO emotion (feedback_id, text, emotion) VALUES (?, ?, ?)',
            (feedback_id, text, emotion)
        )
        conn.commit()

# Map model label to 13 target emotions
def predict_emotion(text):
    if not text or not text.strip():
        return "neutral"

    scores = emotion_classifier(text)[0]
    top_emotion = max(scores, key=lambda x: x['score'])['label'].lower()

    # Mapping the model's output to 13 emotion categories
    emotion_map = {
        "joy": "happiness",
        "love": "love",
        "anger": "anger",
        "fear": "worry",
        "surprise": "surprise",
        "sadness": "sadness",
        "disgust": "hate",
        "neutral": "neutral",
        "enthusiasm": "enthusiasm",
        "boredom": "boredom",
        "relief": "relief",
        "empty": "empty",
        "fun": "fun",
        "hate": "hate"
    }

    return emotion_map.get(top_emotion, "neutral")

# API: Submit feedback and analyze emotion
@app.route('/feedback', methods=['POST'])
def create_feedback():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    rating = data.get('rating')
    comment = data.get('comment', '')

    if not all([name, email, rating]):
        return jsonify({'error': 'Name, email, and rating are required'}), 400

    try:
        # Save feedback
        feedback_id = insert_feedback(name, email, rating, comment)

        # Predict emotion from comment
        predicted_emotion = predict_emotion(comment)

        # Save emotion
        insert_prediction(feedback_id, comment, predicted_emotion)

        return jsonify({
            'message': 'Feedback submitted and emotion analyzed',
            'feedback_id': feedback_id,
            'predicted_emotion': predicted_emotion
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# API: Get all feedback + emotion
@app.route('/feedback', methods=['GET'])
def list_feedback():
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute('''
            SELECT f.id, f.name, f.email, f.rating, f.comment, f.submitted_at, e.emotion
            FROM feedback f
            LEFT JOIN emotion e ON f.id = e.feedback_id
            ORDER BY f.submitted_at DESC
        ''')
        rows = cursor.fetchall()

        return jsonify([
            {
                'id': row[0],
                'name': row[1],
                'email': row[2],
                'rating': row[3],
                'comment': row[4],
                'submitted_at': row[5],
                'predicted_emotion': row[6]
            }
            for row in rows
        ])

# Initialize and run
if __name__ == '__main__':
    init_db()
    app.run(debug=True)
