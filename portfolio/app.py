from flask import Flask, render_template, request, jsonify
import os
import requests

app = Flask(
    __name__,
    template_folder="templates",
    static_folder="static",
    static_url_path="/static"
)

# ── Flowise Configuration ──
# Replace these with your actual Flowise deployment values
# Chatflow ID: 0256b6d0-12c4-4eb9-950a-75dc59f549a1
# Using prediction endpoint for chat functionality
FLOWISE_API_URL = os.environ.get("FLOWISE_API_URL", "https://cloud.flowiseai.com/api/v1/prediction/0256b6d0-12c4-4eb9-950a-75dc59f549a1")
FLOWISE_API_KEY = os.environ.get("FLOWISE_API_KEY", "")  # Optional: if your Flowise instance requires auth


@app.route("/")
def index():
    works = [
        {
            "num": "01",
            "title": "SignBridge · Where Silence Finds a Voice",
            "desc": "Capstone: A 2-way real-time communication platform bridging deaf and hearing individuals — powered by Python, OpenCV, and machine learning for sign-language recognition.",
            "tags": ["Capstone", "Python", "OpenCV", "Machine Learning", "JS", "HTML/CSS"],
            "link": "#",
            "aria": "Capstone project — SignBridge",
            "year": "2025",
            "type_badge": "ml",
            "featured": True,
        },
        {
            "num": "02",
            "title": "Cohhee · Poured with Code",
            "desc": "A full-stack coffee shop web application built under the BSIT program — warm in concept, clean in execution.",
            "tags": ["Web Dev", "Coffee Shop", "Full-Stack"],
            "link": "https://github.com/keneyias666/cohhee",
            "aria": "Open Cohhee on GitHub",
            "year": "2024",
            "type_badge": "web",
            "featured": False,
        },
        {
            "num": "03",
            "title": "TESQUA · Events, Elegantly and Precisely Managed",
            "desc": "An event scheduling and organizer platform with structured admin features, database integration, and a calm, functional interface.",
            "tags": ["System Design", "Web App", "Database"],
            "link": "https://github.com/keneyias666/Event_Organizer_System",
            "aria": "Open Event Organizer System on GitHub",
            "year": "2024",
            "type_badge": "system",
            "featured": False,
        },
        {
            "num": "04",
            "title": "The Basics, Done Beautifully · A CRUD Story",
            "desc": "A modest but intentional CRUD Python application using SQLite3 — proof that even simple systems deserve a little elegance.",
            "tags": ["Python", "SQLite3", "CRUD"],
            "link": "https://github.com/keneyias666/simple_crud",
            "aria": "Open Simple CRUD on GitHub",
            "year": "2023",
            "type_badge": "web",
            "featured": False,
        },
        {
            "num": "05",
            "title": "Ink & Intent · Artworks and Visual Works",
            "desc": "A curated collection of editorial posters, typographic compositions, and digital illustrations — exploring mood, contrast, and quiet visual storytelling.",
            "tags": ["Graphic Art", "Typography", "Illustration", "Poster Design"],
            "link": "https://www.behance.net/eliasamaba1",
            "aria": "View artworks on Behance",
            "year": "2022–",
            "type_badge": "art",
            "featured": True,
        },
        {
            "num": "06",
            "title": "A Letter in Code · Love Proposal Web App",
            "desc": "A heartfelt interactive web experience I built to court my girlfriend — featuring an animated journey, a mini fishing game she had to win, and a personalised email invitation to ask her on a date. Because some things deserve more than a text message.",
            "tags": ["Web App", "HTML/CSS/JS", "EmailJS", "Interactive", "Personal"],
            "link": "https://github.com/keneyias666/love-proposal-mwe",
            "aria": "View Love Proposal Web App on GitHub",
            "year": "2025",
            "type_badge": "web",
            "featured": True,
        },
    ]
    return render_template("index.html", works=works)


@app.route("/api/chat", methods=["POST"])
def chat():
    """Proxy endpoint for Flowise chatbot – keeps the API key server-side."""
    data = request.get_json(silent=True)
    if not data or "question" not in data:
        return jsonify({"error": "Missing 'question' field"}), 400

    question = data["question"].strip()
    if not question:
        return jsonify({"error": "Empty question"}), 400

    headers = {"Content-Type": "application/json"}
    if FLOWISE_API_KEY:
        headers["Authorization"] = f"Bearer {FLOWISE_API_KEY}"

    # Try different payload formats
    payloads = [
        {"question": question},
        {"chatInput": {"question": question}},
    ]

    for payload in payloads:
        try:
            resp = requests.post(FLOWISE_API_URL, json=payload, headers=headers, timeout=30)
            if resp.status_code == 200:
                flowise_data = resp.json()
                answer = flowise_data.get("text") or flowise_data.get("answer") or "I didn't get a response. Please try again."
                return jsonify({"answer": answer})
        except Exception as e:
            app.logger.error(f"Flowise attempt failed: {e}")
            continue

    return jsonify({"answer": "⚠️ Chatbot is currently unavailable. Please try again later."}), 200


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "false").lower() == "true"
    app.run(host="0.0.0.0", port=port, debug=debug)
