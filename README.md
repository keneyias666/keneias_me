# keneyias.me — Portfolio

A minimal, editorial-style personal portfolio with an integrated Flowise AI chatbot assistant.
Built with **Python (Flask)** backend and **HTML + CSS + Tailwind** frontend.

![Portfolio Preview](https://img.shields.io/badge/BSIT-4th%20Year-blue) ![Flask](https://img.shields.io/badge/Flask-3.0.3-black) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-cyan)

---

## ✨ Features

- **Dark / Light mode** — remembers preference via localStorage, respects system preference
- **Profile image swap** — smooth cross-fade + rotate animation between modes
- **Custom cursor** — dot + ring follower, scales on hover
- **Grain overlay** — subtle film grain texture
- **Scroll reveal** — elements fade up as they enter the viewport
- **Editorial typography** — Cormorant Garamond display + DM Sans body + JetBrains Mono accents
- **Flowise chatbot** — AI-powered chat with custom "Powered by keneyias666" branding
- **Deployment ready** — Procfile, render.yaml, .env.example included

---

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/keneyias666/keneias_me.git
cd keneias_me/portfolio

# Create virtual environment
python -m venv venv
source venv/bin/activate      # macOS/Linux
venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt

# Run the app
python app.py
# Visit http://localhost:5000
```

---

## 🤖 Flowise Chatbot

The chatbot is powered by [Flowise](https://flowiseai.com) — an open-source visual LLM flow builder.

To update the chatflow ID, edit `app.py`:

```python
FLOWISE_API_URL = "https://cloud.flowiseai.com/api/v1/prediction/YOUR_CHATFLOW_ID"
```

---

## 🎨 Customization

### Update your info
Edit `portfolio/templates/index.html` to update your name, projects, skills, and contact info.

### Colors & Styling
Edit CSS variables in `portfolio/static/css/style.css`.

---

## ☁️ Deployment

### Render.com (Recommended)
1. Push code to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo
4. Set:
   - **Build Command:** `cd portfolio && pip install -r requirements.txt`
   - **Start Command:** `cd portfolio && gunicorn app:app`
5. Add environment variable: `PORT=5000`
6. Deploy

---

## 📁 Project Structure

```
keneias_me/
├── portfolio/
│   ├── app.py              # Flask backend + Flowise proxy
│   ├── requirements.txt    # Python dependencies
│   ├── templates/
│   │   └── index.html      # Main portfolio page
│   └── static/
│       ├── css/style.css   # All styles
│       ├── js/main.js      # Theme, cursor, chat
│       └── images/         # Images & artworks
└── README.md
```

---

## 📝 License

MIT — feel free to use it! A ⭐ on GitHub is always appreciated!

---

Built with ❤️ by [keneyias666](https://github.com/keneyias666)