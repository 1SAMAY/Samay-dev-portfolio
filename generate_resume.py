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
        Spacer(1, 1.6 * mm),
        Paragraph(text, styles["section"]),
        Spacer(1, 0.8 * mm),
        HRFlowable(width="100%", thickness=0.9, color=colors.HexColor("#1F4E79"), spaceBefore=0, spaceAfter=0),
        Spacer(1, 1.2 * mm),
    ]


styles = getSampleStyleSheet()
styles.add(
    ParagraphStyle(
        name="Name",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=21,
        leading=23,
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
        fontSize=9,
        leading=10.8,
        textColor=colors.HexColor("#34495E"),
        spaceAfter=0,
    )
)
styles.add(
    ParagraphStyle(
        name="section",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=11,
        leading=12.4,
        textColor=colors.HexColor("#1F4E79"),
        spaceAfter=0,
    )
)
styles.add(
    ParagraphStyle(
        name="Body",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=9.1,
        leading=10.8,
        textColor=colors.HexColor("#1F2937"),
        spaceAfter=1.1,
    )
)
styles.add(
    ParagraphStyle(
        name="BulletLine",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=8.9,
        leading=10.3,
        leftIndent=9,
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
        fontSize=9.5,
        leading=10.8,
        textColor=colors.HexColor("#111827"),
        spaceAfter=0.4,
    )
)


doc = SimpleDocTemplate(
    OUTPUT_FILE,
    pagesize=A4,
    leftMargin=15 * mm,
    rightMargin=15 * mm,
    topMargin=12 * mm,
    bottomMargin=12 * mm,
)

story = []

story.append(p("SAMAY DUDHAREJIYA", styles["Name"]))
story.append(p("Junagadh, India | 8734940440 | Samay4932@gmail.com", styles["Contact"]))
story.append(
    p(
        '<link href="https://www.linkedin.com/in/samay-dudhrejiya">LinkedIn</link> | '
        '<link href="https://samay-dev-portfolio.vercel.app/">Portfolio</link> | '
        '<link href="https://github.com/1SAMAY">GitHub</link>',
        styles["Contact"],
    )
)

story.extend(section_title("SUMMARY", styles))
story.append(
    p(
        "Motivated BCA graduate with a strong interest in web development and UI/UX design. Skilled in building responsive, user-friendly interfaces with modern web technologies. Quick learner with a strong eye for clean design, problem solving, and continuous improvement.",
        styles["Body"],
    )
)

story.extend(section_title("EDUCATION", styles))
story.append(p("Bachelor of Computer Applications (BCA)", styles["Role"]))
story.append(p("CCSIT College, Junagadh | Completed: 2026", styles["Body"]))

story.extend(section_title("EXPERIENCE", styles))
story.append(p("Self-Learning Full Stack Development (Ongoing)", styles["Role"]))
for bullet in [
    "Expanding skills in frontend + backend development using modern web technologies.",
    "Practicing backend fundamentals with Node.js, Express.js, and REST APIs (learning phase).",
    "Working on small full-stack projects integrating frontend UI with backend logic and databases.",
    "Strengthening understanding of authentication, database design, and API integration.",
]:
    story.append(p(f"- {bullet}", styles["BulletLine"]))

story.extend(section_title("TECHNICAL SKILLS", styles))
skills_table = Table(
    [
        [p("<b>Frontend:</b> HTML, CSS, JavaScript, React.js, Bootstrap, Responsive Web Design", styles["Body"])],
        [p("<b>Backend:</b> Node.js, Express.js, REST APIs (learning phase)", styles["Body"])],
        [p("<b>Tools:</b> Git, GitHub, Figma", styles["Body"])],
        [p("<b>Other:</b> Python (Basic), SQL (Basic)", styles["Body"])],
        [p("<b>Soft Skills:</b> Problem Solving, Team Collaboration", styles["Body"])],
    ],
    colWidths=[170 * mm],
    style=TableStyle(
        [
            ("BACKGROUND", (0, 0), (-1, -1), colors.whitesmoke),
            ("BOX", (0, 0), (-1, -1), 0.6, colors.HexColor("#D8E2EA")),
            ("INNERGRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#E6EDF3")),
            ("LEFTPADDING", (0, 0), (-1, -1), 6),
            ("RIGHTPADDING", (0, 0), (-1, -1), 6),
            ("TOPPADDING", (0, 0), (-1, -1), 3),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ]
    ),
)
story.append(skills_table)

story.extend(section_title("PROJECTS", styles))
story.append(p("Portfolio Website", styles["Role"]))
for bullet in [
    "Developed a personal portfolio using HTML, CSS, and JavaScript.",
    "Implemented responsive design for mobile and desktop devices.",
    "Showcased projects, skills, and contact information in a clean UI.",
]:
    story.append(p(f"- {bullet}", styles["BulletLine"]))

story.append(Spacer(1, 0.9 * mm))
story.append(p("GitHub Projects", styles["Role"]))
for bullet in [
    "Built and maintained multiple projects for practice and learning.",
    "Worked on real-world features like UI components, APIs, and extensions.",
    "Improved coding structure, version control, and UI/UX design skills.",
]:
    story.append(p(f"- {bullet}", styles["BulletLine"]))

story.extend(section_title("ACHIEVEMENTS", styles))
for bullet in [
    "Developed and deployed multiple live projects.",
    "Completed UI/UX Internship Certification.",
]:
    story.append(p(f"- {bullet}", styles["BulletLine"]))

story.extend(section_title("LANGUAGES", styles))
story.append(p("Gujarati, Hindi, English", styles["Body"]))


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
