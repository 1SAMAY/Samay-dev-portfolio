from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import HRFlowable, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


OUTPUT_FILE = "public/Samay_Dudharejiya_Resume.pdf"


def p(text, style):
    return Paragraph(text, style)


def section_title(text, styles):
    return [
        Spacer(1, 0.9 * mm),
        Paragraph(text, styles["section"]),
        Spacer(1, 0.35 * mm),
        HRFlowable(width="100%", thickness=0.75, color=colors.HexColor("#1F4E79"), spaceBefore=0, spaceAfter=0),
        Spacer(1, 0.7 * mm),
    ]


styles = getSampleStyleSheet()
styles.add(
    ParagraphStyle(
        name="Name",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=18,
        leading=19.5,
        textColor=colors.HexColor("#12304A"),
        alignment=TA_LEFT,
        spaceAfter=2,
    )
)
styles.add(
    ParagraphStyle(
        name="Contact",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=8,
        leading=9.1,
        textColor=colors.HexColor("#34495E"),
        spaceAfter=0,
    )
)
styles.add(
    ParagraphStyle(
        name="section",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=9.2,
        leading=10.2,
        textColor=colors.HexColor("#1F4E79"),
        spaceAfter=0,
    )
)
styles.add(
    ParagraphStyle(
        name="Body",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=7.8,
        leading=8.8,
        textColor=colors.HexColor("#1F2937"),
        spaceAfter=1.1,
    )
)
styles.add(
    ParagraphStyle(
        name="BulletLine",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=7.55,
        leading=8.4,
        leftIndent=7,
        firstLineIndent=-5,
        bulletIndent=0,
        spaceAfter=0.7,
        textColor=colors.HexColor("#1F2937"),
    )
)
styles.add(
    ParagraphStyle(
        name="Role",
        parent=styles["BodyText"],
        fontName="Helvetica-Bold",
        fontSize=8.2,
        leading=9.0,
        textColor=colors.HexColor("#111827"),
        spaceAfter=0.4,
    )
)


doc = SimpleDocTemplate(
    OUTPUT_FILE,
    pagesize=A4,
    leftMargin=12 * mm,
    rightMargin=12 * mm,
    topMargin=9 * mm,
    bottomMargin=9 * mm,
)

story = []

story.append(p("SAMAY DUDHAREJIYA", styles["Name"]))
story.append(p("Junagadh, Gujarat, India | +91 8734940440 | samay4932@gmail.com", styles["Contact"]))
story.append(
    p(
        '<link href="https://www.linkedin.com/in/samay-dudhrejiya">LinkedIn</link> | '
        '<link href="https://github.com/1SAMAY">GitHub</link> | '
        '<link href="https://samay-dev-portfolio.vercel.app/">Portfolio</link>',
        styles["Contact"],
    )
)

story.extend(section_title("SUMMARY", styles))
story.append(
    p(
        "Full Stack Developer pursuing an M.Sc. in Information Technology with hands-on experience building web applications, desktop software, browser extensions, and AI-powered tools end-to-end. Skilled in Python, PHP, JavaScript, React.js, FastAPI, and SQL, with a focus on clean, scalable code and shipping practical software.",
        styles["Body"],
    )
)

story.extend(section_title("EDUCATION", styles))
story.append(p("Master of Science (M.Sc.) in Information Technology - Pursuing", styles["Role"]))
story.append(p("Bachelor of Computer Applications (BCA) - Graduated 2026", styles["Role"]))
story.append(p("Bhakta Kavi Narsinh Mehta University (BKNMU), CCSIT College, Junagadh, Gujarat, India", styles["Body"]))

story.extend(section_title("INDEPENDENT PROJECT WORK", styles))
story.append(p("2025 - Present", styles["Role"]))
for bullet in [
    "Designed full-stack web apps, desktop applications, browser extensions, and developer tools from concept to implementation.",
    "Built REST APIs and backend services using Python, FastAPI, PHP, Node.js, and SQL databases.",
    "Developed responsive interfaces with React.js, Next.js, JavaScript, HTML5, CSS3, Bootstrap, and Tailwind CSS.",
    "Implemented authentication, database integration, API communication, Git workflows, debugging, and performance optimization.",
]:
    story.append(p(f"- {bullet}", styles["BulletLine"]))

story.extend(section_title("TECHNICAL SKILLS", styles))
skills_table = Table(
    [
        [p("<b>Programming Languages:</b> Python, JavaScript, PHP, HTML5, CSS3, SQL", styles["Body"])],
        [p("<b>Frontend:</b> React.js, Next.js, Bootstrap, Tailwind CSS, Responsive Web Design", styles["Body"])],
        [p("<b>Backend:</b> FastAPI, Node.js, Express.js, REST API Development", styles["Body"])],
        [p("<b>Databases:</b> MySQL, SQLite", styles["Body"])],
        [p("<b>Tools:</b> Git, GitHub, Docker, Postman, VS Code, Figma", styles["Body"])],
        [p("<b>Development Skills:</b> Authentication (JWT), API Integration, JSON, Desktop Application Development, Browser Extension Development, Software Architecture, Debugging & Testing, Problem Solving", styles["Body"])],
    ],
    colWidths=[170 * mm],
    style=TableStyle(
        [
            ("BACKGROUND", (0, 0), (-1, -1), colors.whitesmoke),
            ("BOX", (0, 0), (-1, -1), 0.6, colors.HexColor("#D8E2EA")),
            ("INNERGRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#E6EDF3")),
            ("LEFTPADDING", (0, 0), (-1, -1), 6),
            ("RIGHTPADDING", (0, 0), (-1, -1), 6),
            ("TOPPADDING", (0, 0), (-1, -1), 2),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
        ]
    ),
)
story.append(skills_table)

story.extend(section_title("PROJECTS", styles))
project_items = [
    (
        "CodeGuard OS - Offline Source Code Analysis Platform",
        "Python, FastAPI, Next.js, SQLite, JavaScript",
        "Built an offline-first security scanner for ZIP/folder analysis with vulnerability checks, dependency risk review, code quality scoring, metrics dashboard, architecture visualization, and HTML/PDF reports.",
    ),
    (
        "PDFShield Pro - Local PDF Security Suite",
        "TypeScript, FastAPI, PDF tooling, Docker",
        "Created a privacy-focused PDF protection workflow for encryption, authorized unlocking, batch processing, secure local handling, and clean dashboard-based operations.",
    ),
    (
        "VisionText-AI & RepoGalaxy",
        "JavaScript, OCR, GitHub API, 3D Visualization",
        "Delivered an OCR web app for extracting editable text from images/PDFs and a client-side 3D GitHub visualizer for exploring repositories and project structure.",
    ),
    (
        "Portfolio, Extensions & Browser Tools",
        "React.js, TypeScript, Chrome Extensions, CSS",
        "Built a modern developer portfolio plus practical tools such as Cookie-Sync, media downloader extension, Game Store, Fun Game, and other public GitHub projects.",
    ),
]
for title, stack, detail in project_items:
    story.append(p(title, styles["Role"]))
    story.append(p(f"- <b>Tech:</b> {stack}. {detail}", styles["BulletLine"]))

story.extend(section_title("ACHIEVEMENTS", styles))
for bullet in [
    "Developed multiple full-stack applications and developer tools, from CodeGuard OS to browser extensions and desktop software.",
    "Shipped an offline-first security analysis platform covering vulnerability detection, dependency analysis, and reporting.",
    "Maintain an active GitHub portfolio showcasing practical, working software projects.",
]:
    story.append(p(f"- {bullet}", styles["BulletLine"]))

story.extend(section_title("LANGUAGES", styles))
story.append(p("English, Hindi, Gujarati", styles["Body"]))


def add_page_number(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor("#D8E2EA"))
    canvas.setLineWidth(0.7)
    canvas.line(doc.leftMargin, 11.5 * mm, A4[0] - doc.rightMargin, 11.5 * mm)
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.HexColor("#6B7280"))
    canvas.drawRightString(A4[0] - doc.rightMargin, 7.6 * mm, f"Page {doc.page}")
    canvas.restoreState()


doc.build(story, onFirstPage=add_page_number, onLaterPages=add_page_number)
print(OUTPUT_FILE)
