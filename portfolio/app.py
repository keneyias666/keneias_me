from flask import Flask, render_template, request, jsonify
import os
import re
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
            "title": "VoiceVerSign · Where Silence Finds a Voice",
            "desc": "Capstone: A 2-way real-time communication platform bridging deaf and hearing individuals — powered by Python, OpenCV, and machine learning for sign-language recognition.",
            "tags": ["Capstone", "Python", "OpenCV", "Machine Learning", "JS", "HTML/CSS"],
            "link": "https://voiceversign.tech/index.html#home",
            "aria": "Visit VoiceVerSign live web app",
            "year": "2025",
            "type_badge": "ml",
            "featured": True,
            "btn_label": "Live App",
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
            "desc": "A heartfelt interactive web experience I built — featuring an animated journey, a mini fishing game she had to win, and a personalised email invitation to ask her on a date. Because some things deserve more than a text message.",
            "tags": ["Web App", "HTML/CSS/JS", "EmailJS", "Interactive", "Personal Project"],
            "link": "https://github.com/keneyias666/love-proposal-mwe",
            "aria": "View Love Proposal Web App on GitHub",
            "year": "2025",
            "type_badge": "web",
            "featured": True,
        },
    ]
    return render_template("index.html", works=works)



def get_portfolio_bot_response(question: str) -> str:
    """Intelligent built-in fallback response engine for portfolio queries."""
    q = question.lower().strip()

    # Greetings
    if re.search(r'\b(hi|hello|hey|yo|greetings|morning|afternoon|evening|sup|howdy)\b', q):
        return (
            "Hi there! I'm Kenette Elias's portfolio assistant. "
            "Ask me anything about his projects, technical skills, design work, experience, or contact info."
        )

    # Resume / CV
    if re.search(r'\b(resume|cv|curriculum vitae|biodata)\b', q):
        return (
            "You can preview Elias's resume directly in the floating card on this page, "
            "or download the official PDF here: /static/images/elias_resume_pdf.pdf"
        )

    # Contact / Hire / Reach / Socials
    if re.search(r'\b(contact|email|phone|call|location|address|hire|available|availability|linkedin|github|reach|message)\b', q):
        return (
            "Here is how you can connect with Kenette Elias:\n"
            "• Status: Open to Opportunities\n"
            "• Email: keneyias666@gmail.com\n"
            "• Phone: +63 915 843 0692\n"
            "• Location: Sinai Mohon 2 Tisa Cebu City, Philippines\n"
            "• GitHub: https://github.com/keneyias666\n"
            "• LinkedIn: https://www.linkedin.com/in/kenette-elias-amaba-71aa5b3b9/"
        )

    # Specific Projects
    if re.search(r'\b(voiceversign|sign language|capstone)\b', q):
        return (
            "VoiceVerSign (2025 Capstone) is a real-time 2-way communication platform bridging deaf and hearing individuals. "
            "Powered by Python, OpenCV, and Machine Learning for sign-language recognition.\n"
            "Live app: https://voiceversign.tech/index.html#home"
        )
    if re.search(r'\b(cohhee|coffee)\b', q):
        return (
            "Cohhee (2024) is a warm, clean full-stack coffee shop web application built under the BSIT program.\n"
            "GitHub repository: https://github.com/keneyias666/cohhee"
        )
    if re.search(r'\b(tesqua|event|organizer)\b', q):
        return (
            "TESQUA (2024) is an event scheduling and organizer platform with structured admin features and database integration.\n"
            "GitHub repository: https://github.com/keneyias666/Event_Organizer_System"
        )
    if re.search(r'\b(crud|sqlite|simple_crud|basics)\b', q):
        return (
            "The Basics, Done Beautifully (2023) is a modest, intentional Python CRUD application built using SQLite3.\n"
            "GitHub repository: https://github.com/keneyias666/simple_crud"
        )
    if re.search(r'\b(proposal|letter|love)\b', q):
        return (
            "A Letter in Code (2025) is an interactive web experience featuring an animated journey, a mini fishing game, and EmailJS invitation.\n"
            "GitHub repository: https://github.com/keneyias666/love-proposal-mwe"
        )
    if re.search(r'\b(art|artwork|artworks|poster|posters|behance|illustration|drawing|typography|graphics?)\b', q):
        return (
            "Elias curates typographic compositions, editorial posters (such as 'Noir', 'Solemn', 'Paranoia'), and digital illustrations under 'Ink & Intent'.\n"
            "You can watch his creation process videos in the Artworks section or visit his Behance portfolio: https://www.behance.net/eliasamaba1"
        )
    if re.search(r'\b(project|projects|work|works|built|portfolio)\b', q):
        return (
            "Elias has built several notable projects:\n"
            "1. VoiceVerSign (2025) — Sign language recognition capstone (voiceversign.tech)\n"
            "2. Cohhee (2024) — Full-stack coffee shop web application\n"
            "3. TESQUA (2024) — Event organizer management platform\n"
            "4. Simple CRUD (2023) — Python SQLite3 management system\n"
            "5. Ink & Intent (2022–) — Editorial poster designs & typography on Behance\n"
            "6. A Letter in Code (2025) — Interactive web experience with mini-game\n"
            "Feel free to ask about any specific project for details!"
        )

    # Experience / Work history
    if re.search(r'\b(intern|internship|5bdf|bdf)\b', q):
        return (
            "At 5BDF Corporation (August 2026 – Present), Elias is a Graphic Artist & UI/UX Designer Intern. "
            "He designs promotional posters, marketing visuals, produces video content, and is currently leading a full redesign of the company website."
        )
    if re.search(r'\b(eperformax|tmobile|t-mobile|telco|customer service|call center)\b', q):
        return (
            "At EPERFORMAX (2023–2024), Elias worked as a Customer Service Rep Telco supporting US telecom client T-Mobile. "
            "He handled day-to-day accounts, technical troubleshooting, and high-pressure escalations."
        )
    if re.search(r'\b(barangay|tisa|encoder)\b', q):
        return (
            "At Barangay Tisa (2020–2021), Elias worked as a Barangay Encoder and IT support. "
            "He maintained the barangay website, provided tech support, and assisted with community aid and case documentation."
        )
    if re.search(r'\b(experience|jobs?|work experience|career|history)\b', q):
        return (
            "Elias's professional experience includes:\n"
            "• Graphic Artist & UI/UX Designer Intern at 5BDF Corporation (Aug 2026 – Present)\n"
            "• Customer Service Rep Telco at EPERFORMAX / T-Mobile (2023 – 2024)\n"
            "• Barangay Encoder & Tech Support at Barangay Tisa (2020 – 2021)"
        )

    # Skills / Tech Stack
    if re.search(r'\b(skills?|tech|stack|languages?|frameworks?|tools?|python|javascript|typescript|tailwind|css|html|database|mysql|sqlite|figma)\b', q):
        return (
            "Elias's core technical and design skills:\n"
            "• Web Dev: Python, JavaScript (ES6+), TypeScript, HTML5, CSS3, Tailwind CSS, Flask, REST APIs, WordPress\n"
            "• Design: Typography & Layout, Graphic Art, Branding, Adobe Photoshop/Illustrator/InDesign, UI/UX, Figma\n"
            "• Systems & DB: MySQL, SQLite, MSSQL Server, CRUD, System Analysis, XAMPP\n"
            "• Tools: Git/GitHub, VS Code, Render, Vercel, Cursor, Antigravity AI"
        )

    # Education
    if re.search(r'\b(education|college|university|school|study|studying|degree|uc|cebu)\b', q):
        return (
            "Elias is a 4th-year BS Information Technology student at the University of Cebu – Main Campus (2021 – Present). "
            "He completed his Senior High School STEM track at Don Carlos A. Gothon Memorial National High School."
        )

    # Hobbies / Interests
    if re.search(r'\b(hobb(y|ies)|gaming|games?|dota|csgo|cs2|stardew|steam|books?|reading|goodreads|music|songs?|spotify|j cole|nf|neck deep)\b', q):
        return (
            "Outside of coding and design, Elias enjoys:\n"
            "• Gaming: Dota 2, CS2, Stardew Valley (Steam: steamcommunity.com/id/elias666)\n"
            "• Reading: Psychology & storytelling like 'Man's Search for Meaning' and 'The Metamorphosis'\n"
            "• Music: J. Cole, NF, and Neck Deep for productivity (Spotify: open.spotify.com/user/31yilc5ibrxm3fnkq5xgdm3xddoe)"
        )

    # About / Philosophy
    if re.search(r'\b(who (are you|is elias|is kenette)|about|bio|background|philosophy|motto)\b', q):
        return (
            "Kenette Elias Amaba is a 4th-year BSIT student, full-stack developer, and graphic artist from Cebu City, Philippines. "
            "His belief is 'Progress, not perfection' — crafting thoughtful digital experiences where code meets design."
        )

    # Fallback response for unrecognized or brief queries
    return (
        "I'm Elias's portfolio assistant. You can ask me about:\n"
        "• Skills & Tech Stack (Python, JS, Tailwind, UI/UX)\n"
        "• Works & Projects (VoiceVerSign, Cohhee, TESQUA)\n"
        "• Experience (5BDF Corporation, EPERFORMAX, Brgy Tisa)\n"
        "• Artworks & Typography (Posters, Behance)\n"
        "• Resume & Contact info"
    )


@app.route("/api/chat", methods=["POST"])
def chat():
    """Proxy endpoint for chatbot with smart portfolio assistant fallback."""
    data = request.get_json(silent=True)
    if not data or "question" not in data:
        return jsonify({"error": "Missing 'question' field"}), 400

    question = data["question"].strip()
    if not question:
        return jsonify({"error": "Empty question"}), 400

    # Try external Flowise if custom endpoint or environment is provided
    if FLOWISE_API_URL and ("flowiseai.com" not in FLOWISE_API_URL or os.environ.get("FLOWISE_API_URL")):
        headers = {"Content-Type": "application/json"}
        if FLOWISE_API_KEY:
            headers["Authorization"] = f"Bearer {FLOWISE_API_KEY}"

        payloads = [
            {"question": question},
            {"chatInput": {"question": question}},
        ]

        for payload in payloads:
            try:
                resp = requests.post(FLOWISE_API_URL, json=payload, headers=headers, timeout=5)
                if resp.status_code == 200:
                    flowise_data = resp.json()
                    answer = flowise_data.get("text") or flowise_data.get("answer")
                    if answer and answer.strip():
                        return jsonify({"answer": answer})
            except Exception as e:
                app.logger.warning(f"Flowise query failed, falling back to local engine: {e}")
                break

    # Instant intelligent local assistant response
    answer = get_portfolio_bot_response(question)
    return jsonify({"answer": answer})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "false").lower() == "true"
    print(f"Starting Flask on port {port}")
    app.run(host="0.0.0.0", port=port, debug=debug)
