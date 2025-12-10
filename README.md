# LightMFA 🔐

Hi there! 👋

This is a lightweight, easy-to-understand demo of Multi-Factor Authentication (MFA) built with Flask. We wanted to show that adding security layers doesn't have to be complicated or scary.

## What's inside? 🧐

We've implemented three cool ways to prove you are who you say you are:

1.  **Email OTP**: The classic "we sent you a code" method.
2.  **Authenticator App**: Scan a QR code with Google Authenticator or Authy. (Time-based OTP)
3.  **Face Recognition**: Log in just by looking at your camera! 📸 (Uses `face-api.js` on the frontend).

## How to run it 🏃‍♂️

It's super simple. You don't need Docker or any complex setup.

1.  **Clone the repo** (if you haven't already).
2.  **Set up a virtual environment** (optional but recommended):
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```
3.  **Install the goods**:
    ```bash
    pip install -r requirements.txt
    ```
4.  **Get the face models**:
    We need some AI magic for the face detection. Run this script to download them:
    ```bash
    chmod +x download_models.sh
    ./download_models.sh
    ```
5.  **Launch it!**:
    ```bash
    python app.py
    ```
    Then open `http://127.0.0.1:5000` in your browser.

## A note on Email 📧

By default, the app just **prints the email code to your terminal** so you don't need to mess with SMTP servers.
If you want to send *real* emails, check `config.py` or the walkthrough for instructions on setting up Gmail.

## Tech Stack 🛠️

-   **Python & Flask**: For the backend logic.
-   **SQLite**: Simple database, no setup required.
-   **HTML/CSS/JS**: Vanilla frontend.
-   **face-api.js**: For the face recognition magic.

Enjoy exploring! If you break it, you keep the pieces. 😉

---
*Built with ❤️ by Team 404-PageNotFound*
