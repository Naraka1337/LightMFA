import sqlite3
from flask import g

DATABASE = 'users.db'

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row
    return db

def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def init_db():
    with sqlite3.connect(DATABASE) as conn:
        c = conn.cursor()
        c.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                totp_secret TEXT,
                face_embedding TEXT,
                totp_active INTEGER DEFAULT 0
            )
        ''')
        
        # Migration for existing databases
        try:
            c.execute('ALTER TABLE users ADD COLUMN totp_active INTEGER DEFAULT 0')
        except sqlite3.OperationalError:
            pass # Column likely exists
            
        conn.commit()
        print("Database initialized.")

if __name__ == '__main__':
    init_db()
