from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
from database import init_db, get_db, close_connection
from config import Config
import bcrypt
import pyotp
import smtplib
from email.mime.text import MIMEText
import random
import string
import json
import math

app = Flask(__name__)
app.config.from_object(Config)
app.teardown_appcontext(close_connection)

# Initialize DB on start (for demo purposes)
with app.app_context():
    init_db()

def send_email_otp(email, otp):
    # In a real app, use app.config['MAIL_SERVER'] etc.
    # For this demo, we print to console if not configured, or try to send if configured.
    print(f"========================================")
    print(f"SENDING OTP to {email}: {otp}")
    print(f"========================================")
    
    if app.config['MAIL_SERVER'] == 'localhost':
        return True # Mock success
        
    try:
        msg = MIMEText(f"Your OTP is: {otp}")
        msg['Subject'] = "Your MFA Code"
        msg['From'] = app.config['MAIL_USERNAME'] or "noreply@example.com"
        msg['To'] = email

        with smtplib.SMTP(app.config['MAIL_SERVER'], app.config['MAIL_PORT']) as server:
            if app.config['MAIL_USE_TLS']:
                server.starttls()
            if app.config['MAIL_USERNAME'] and app.config['MAIL_PASSWORD']:
                server.login(app.config['MAIL_USERNAME'], app.config['MAIL_PASSWORD'])
            server.send_message(msg)
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False

@app.route('/')
def index():
    if 'user_id' in session:
        db = get_db()
        user = db.execute('SELECT * FROM users WHERE id = ?', (session['user_id'],)).fetchone()
        return render_template('base.html', logged_in=True, user=user)
    return redirect(url_for('login'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        face_embedding = request.form.get('face_embedding') # JSON string

        db = get_db()
        try:
            hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            totp_secret = pyotp.random_base32()
            
            db.execute('INSERT INTO users (email, password_hash, totp_secret, face_embedding) VALUES (?, ?, ?, ?)',
                       (email, hashed, totp_secret, face_embedding))
            db.commit()
            flash('Registration successful! Please login.', 'success')
            return redirect(url_for('login'))
        except Exception as e:
            flash(f'Error: {e}', 'danger')
    
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        
        db = get_db()
        user = db.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
        
        if user and bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
            session['pre_auth_user_id'] = user['id']
            # Ask for MFA method
            return render_template('login.html', step='mfa_select', user=user)
        else:
            flash('Invalid credentials', 'danger')
            
    return render_template('login.html', step='credentials')

@app.route('/mfa/email', methods=['GET', 'POST'])
def mfa_email():
    if 'pre_auth_user_id' not in session:
        return redirect(url_for('login'))
    
    user_id = session['pre_auth_user_id']
    db = get_db()
    user = db.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()

    if request.method == 'GET':
        # Generate and send OTP
        otp = ''.join(random.choices(string.digits, k=6))
        session['email_otp'] = otp
        send_email_otp(user['email'], otp)
        return render_template('email_otp.html')
    
    if request.method == 'POST':
        entered_otp = request.form['otp']
        if entered_otp == session.get('email_otp'):
            session.pop('email_otp', None)
            session['user_id'] = user_id
            session.pop('pre_auth_user_id', None)
            return redirect(url_for('index'))
        else:
            flash('Invalid OTP', 'danger')
            return render_template('email_otp.html')

@app.route('/mfa/totp', methods=['GET', 'POST'])
def mfa_totp():
    if 'pre_auth_user_id' not in session:
        return redirect(url_for('login'))
        
    user_id = session['pre_auth_user_id']
    db = get_db()
    user = db.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()
    
    if request.method == 'POST':
        code = request.form['code']
        totp = pyotp.TOTP(user['totp_secret'])
        if totp.verify(code):
            session['user_id'] = user_id
            session.pop('pre_auth_user_id', None)
            return redirect(url_for('index'))
        else:
            flash('Invalid TOTP code', 'danger')
            
    return render_template('totp_verify.html')

@app.route('/setup-totp', methods=['GET', 'POST'])
def setup_totp():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    user_id = session['user_id']
    db = get_db()
    user = db.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()
    
    if request.method == 'POST':
        code = request.form['code']
        totp = pyotp.TOTP(user['totp_secret'])
        if totp.verify(code):
            db.execute('UPDATE users SET totp_active = 1 WHERE id = ?', (user_id,))
            db.commit()
            flash('TOTP Setup Successful!', 'success')
            return redirect(url_for('index'))
        else:
            flash('Invalid code. Please try again.', 'danger')
    
    totp_uri = pyotp.totp.TOTP(user['totp_secret']).provisioning_uri(name=user['email'], issuer_name='MFA Demo')
    
    import qrcode
    import io
    import base64
    
    img = qrcode.make(totp_uri)
    buf = io.BytesIO()
    img.save(buf)
    img_b64 = base64.b64encode(buf.getvalue()).decode('utf-8')
    
    return render_template('totp_setup.html', qr_code=img_b64, secret=user['totp_secret'])

@app.route('/mfa/face', methods=['GET', 'POST'])
def mfa_face():
    if 'pre_auth_user_id' not in session:
        return redirect(url_for('login'))

    if request.method == 'POST':
        # Receive face descriptor from frontend
        data = request.get_json()
        if not data or 'descriptor' not in data:
            return jsonify({'success': False, 'message': 'No descriptor provided'})
            
        descriptor = data['descriptor'] # List of floats
        
        user_id = session['pre_auth_user_id']
        db = get_db()
        user = db.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()
        
        if not user['face_embedding']:
            return jsonify({'success': False, 'message': 'No face registered for this user'})
            
        stored_descriptor = json.loads(user['face_embedding'])
        
        # Calculate Euclidean distance
        # face-api.js descriptors are 128D vectors.
        # Simple Euclidean distance: sqrt(sum((a-b)^2))
        # Threshold usually around 0.6 for face-api.js
        
        dist = math.sqrt(sum((a - b) ** 2 for a, b in zip(descriptor, stored_descriptor)))
        print(f"Face Distance: {dist}")
        
        if dist < 0.6: # Threshold
            session['user_id'] = user_id
            session.pop('pre_auth_user_id', None)
            return jsonify({'success': True, 'redirect': url_for('index')})
        else:
            return jsonify({'success': False, 'message': 'Face not recognized'})

    return render_template('face_login.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True, port=5000)
