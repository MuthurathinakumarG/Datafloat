# from flask import Flask, request, jsonify
# import sqlite3
 
# app = Flask(__name__)
# DATABASE = 'users.db'
 
# # ✅ Initialize DB (create table if not exists)
# def init_db():
#     with sqlite3.connect(DATABASE) as conn:
#         cursor = conn.cursor()
#         cursor.execute('''
#             CREATE TABLE IF NOT EXISTS users (
#                 id INTEGER PRIMARY KEY AUTOINCREMENT,
#                 name TEXT NOT NULL,
#                 email TEXT NOT NULL UNIQUE
#             )
#         ''')
#         conn.commit()
 
# # ✅ Insert user into DB
# def insert_user(name, email):
#     with sqlite3.connect(DATABASE) as conn:
#         cursor = conn.cursor()
#         cursor.execute('INSERT INTO users (name, email) VALUES (?, ?)', (name, email))
#         conn.commit()
#         return cursor.lastrowid
 
# # ✅ Get all users
# def get_all_users():
#     with sqlite3.connect(DATABASE) as conn:
#         cursor = conn.cursor()
#         cursor.execute('SELECT id, name, email FROM users')
#         rows = cursor.fetchall()
#         return [{'id': row[0], 'name': row[1], 'email': row[2]} for row in rows]
 
# @app.route('/users', methods=['POST'])
# def create_user():
#     data = request.get_json()
#     name = data.get('name')
#     email = data.get('email')
 
#     if not name or not email:
#         return jsonify({'error': 'Missing name or email'}), 400
 
#     try:
#         user_id = insert_user(name, email)
#         return jsonify({'message': 'User created', 'user_id': user_id}), 201
#     except sqlite3.IntegrityError:
#         return jsonify({'error': 'Email already exists'}), 409
 
 
 
 
# # ✅ Get user by ID
# def get_user_by_id(user_id):
#     with sqlite3.connect(DATABASE) as conn:
#         cursor = conn.cursor()
#         cursor.execute('SELECT id, name, email FROM users WHERE id = ?', (user_id,))
#         row = cursor.fetchone()
#         if row:
#             return {'id': row[0], 'name': row[1], 'email': row[2]}
#         return None
       
 
# @app.route('/users', methods=['GET'])
# def list_users():
#     users = get_all_users()
#     return jsonify(users)
 
 
 
# @app.route('/users/<int:user_id>', methods=['GET'])
# def get_user(user_id):
#     user = get_user_by_id(user_id)
#     if user:
#         return jsonify(user)
#     else:
#         return jsonify({'error': 'User not found'}), 404
 
# if __name__ == '__main__':
#     init_db()
#     app.run(debug=True)        


from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)
DATABASE = 'users.db'

# ✅ Initialize DB (create table if not exists, or alter it to add password)
def init_db():
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        
        # Check if 'users' table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='users'")
        table_exists = cursor.fetchone()

        if not table_exists:
            # Create table if it doesn't exist
            cursor.execute('''
                CREATE TABLE users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT NOT NULL UNIQUE,
                    password TEXT NOT NULL
                )
            ''')
        else:
            # Check if 'password' column exists, and add it if missing
            cursor.execute("PRAGMA table_info(users)")
            columns = [row[1] for row in cursor.fetchall()]
            if 'password' not in columns:
                cursor.execute('ALTER TABLE users ADD COLUMN password TEXT')
        
        conn.commit()

# ✅ Insert user into DB
def insert_user(password, email):
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute('INSERT INTO users (password, email) VALUES (?, ?)', (password, email))
        conn.commit()
        return cursor.lastrowid

# ✅ Get all users
def get_all_users():
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT id, password, email FROM users')
        rows = cursor.fetchall()
        return [{'id': row[0], 'password': row[1], 'email': row[2]} for row in rows]

# ✅ Get user by ID
def get_user_by_id(user_id):
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT id, password, email FROM users WHERE id = ?', (user_id,))
        row = cursor.fetchone()
        if row:
            return {'id': row[0], 'password': row[1], 'email': row[2]}
        return None

# ✅ Create new user
@app.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    password = data.get('password')
    email = data.get('email')

    if not password or not email:
        return jsonify({'error': 'Missing password or email'}), 400

    try:
        user_id = insert_user(password, email)
        return jsonify({'message': 'User created', 'user_id': user_id}), 201
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Email already exists'}), 409

# ✅ Get all users
@app.route('/users', methods=['GET'])
def list_users():
    users = get_all_users()
    return jsonify(users)

# ✅ Get user by ID
@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = get_user_by_id(user_id)
    if user:
        return jsonify(user)
    else:
        return jsonify({'error': 'User not found'}), 404

# ✅ Run the app
if __name__ == '__main__':
    init_db()
    app.run(debug=True)
