# Portfolio — BSIT Student & Graphic Artist

A minimal, editorial-style personal portfolio with an integrated Flowise AI chatbot assistant.  
Built with **Python (Flask)** backend and **HTML + CSS + Tailwind** frontend.  
Features seamless dark/light mode with animated profile image switching.

---

## 📁 File Structure

```
portfolio/
├── app.py                    # Flask backend + Flowise proxy endpoint
├── requirements.txt          # Python dependencies
├── Procfile                  # For Heroku / Render deployment
├── render.yaml               # Render.com deployment config
├── .env.example              # Environment variable template
├── .gitignore
├── README.md
│
├── templates/
│   └── index.html            # Main portfolio page (Jinja2 template)
│
└── static/
    ├── css/
    │   └── style.css         # All custom styles, CSS variables, animations
    ├── js/
    │   └── main.js           # Theme toggle, cursor, chat, scroll reveal
    └── images/
        ├── profile-light.svg # Avatar shown in LIGHT mode
        └── profile-dark.svg  # Avatar shown in DARK mode
```

---

## 🚀 Local Development

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
```

### 2. Create a virtual environment
```bash
python -m venv venv
source venv/bin/activate      # macOS/Linux
venv\Scripts\activate         # Windows
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure environment
```bash
cp .env.example .env
# Edit .env with your Flowise URL and optional API key
```

### 5. Run the app
```bash
python app.py
# Visit http://localhost:5000
```

---

## 🤖 Flowise AI Setup

The chatbot is powered by [Flowise](https://github.com/FlowiseAI/Flowise) — an open-source visual LLM flow builder.

### Step 1 — Install and run Flowise
```bash
npm install -g flowise
npx flowise start
# Flowise runs on http://localhost:3000
```

### Step 2 — Create your chatflow
1. Open `http://localhost:3000` in your browser
2. Create a new **Chatflow**
3. Build a flow using one of these recommended setups:
   - **Conversational Retrieval QA Chain** (for knowledge base Q&A)
   - **ReAct Agent** (for more dynamic responses)
4. Add a **Text File / PDF Loader** node and upload a document about yourself (bio, skills, projects, CV)
5. Connect it to a **Vector Store** (e.g. In-Memory or Qdrant)
6. Connect to an **LLM** (e.g. ChatOpenAI, Ollama, or any supported model)
7. Add a system prompt like:
   ```
   You are a helpful portfolio assistant for [Your Name], a BSIT 4th year student 
   passionate about typography and graphic art. Answer questions about their 
   skills, projects, experience, and contact information based on the provided 
   context. Be friendly, concise, and professional.
   ```
8. **Save and Deploy** the chatflow

### Step 3 — Get your Chatflow ID
- After deploying, click the **API** button on your chatflow
- Copy the chatflow ID from the URL: `.../api/v1/prediction/YOUR_CHATFLOW_ID`

### Step 4 — Update your `.env`
```env
FLOWISE_API_URL=http://localhost:3000/api/v1/prediction/YOUR_CHATFLOW_ID
FLOWISE_API_KEY=your_api_key_if_required
```

---

## 🎨 Customization

### Update your personal info
Edit `templates/index.html`:
- Replace `Your Name Here` in the hero section
- Update `your@email.com`, GitHub, and LinkedIn links
- Edit project titles, descriptions, and tags in the Work section
- Update the About section text with your real details

### Swap profile images
Replace the SVGs in `static/images/`:
- `profile-light.svg` — shown in **light mode**
- `profile-dark.svg` — shown in **dark mode**
- Use any image format (`.jpg`, `.png`, `.webp`) — just update the `src` attributes in `index.html`

### Adjust colors
Edit CSS variables in `static/css/style.css`:
```css
[data-theme="dark"] {
  --bg-primary: #0a0a0a;
  --text-primary: #f0f0f0;
  /* ... */
}
[data-theme="light"] {
  --bg-primary: #fafafa;
  --text-primary: #0a0a0a;
  /* ... */
}
```

---

## ☁️ Deployment

### Option A — Render.com (Recommended, free tier)
1. Push your code to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo
4. Render auto-detects `render.yaml`
5. Add environment variables in the Render dashboard:
   - `FLOWISE_API_URL` = your deployed Flowise URL
   - `FLOWISE_API_KEY` = your API key (if any)
6. Deploy 🎉

> **Note:** You also need to deploy Flowise somewhere accessible (Railway, Render, or self-hosted VPS). Update `FLOWISE_API_URL` to point to your deployed Flowise instance.

### Option B — Railway
```bash
railway init
railway up
railway vars set FLOWISE_API_URL=https://your-flowise.railway.app/api/v1/prediction/YOUR_ID
```

### Option C — Heroku
```bash
heroku create your-portfolio-name
heroku config:set FLOWISE_API_URL=https://your-flowise.app/api/v1/prediction/YOUR_ID
git push heroku main
```

### Deploying Flowise (for production)
Deploy Flowise to Railway or Render as a separate service, then update your `.env` / environment variables to point to it.

---

## ✨ Features

- **Dark / Light mode** — remembers preference via localStorage, respects system preference
- **Profile image swap** — smooth cross-fade + rotate animation between modes
- **Custom cursor** — dot + ring follower, scales on hover
- **Grain overlay** — subtle film grain texture
- **Scroll reveal** — elements fade up as they enter the viewport
- **Editorial typography** — Cormorant Garamond display + DM Sans body + JetBrains Mono accents
- **Flowise chatbot** — API key stays server-side, never exposed to client
- **Deployment ready** — Procfile, render.yaml, .env.example included

---

## 📝 License

MIT — do whatever you want with it. A ⭐ on GitHub is always appreciated!
