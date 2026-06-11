"""
Generates MyUniPath_Documentation.pdf with:
  - Cover
  - Tech Stack
  - Context Diagram (DFD Level 0)
  - DFD Level 1
  - DFD Level 2 (Recommendation Engine)
  - ERD
  - UML Class Diagram
"""
import math
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, PageBreak,
    Table, TableStyle, NextPageTemplate, KeepTogether,
)
from reportlab.graphics.shapes import (
    Drawing, Rect, String, Line, Polygon, Circle, Ellipse, Group,
)

# UNITEN brand palette
NAVY = HexColor("#0F3361")
ORANGE = HexColor("#e34628")
MUDDY = HexColor("#ba7a65")
LIGHT_BG = HexColor("#F4F6FA")
DARK_TEXT = HexColor("#1f2937")
GREY = HexColor("#6b7280")
LIGHT_GREY = HexColor("#e5e7eb")

OUTPUT = "MyUniPath_Documentation.pdf"


# ───────────────────────── Diagram drawing helpers ─────────────────────────

def arrow(d, x1, y1, x2, y2, label="", color=NAVY, label_offset=(0, 6),
          dashed=False, label_bg=False):
    """Draw an arrow from (x1,y1) to (x2,y2) with optional label."""
    line = Line(x1, y1, x2, y2, strokeColor=color, strokeWidth=1.2)
    if dashed:
        line.strokeDashArray = [4, 3]
    d.add(line)
    # Arrow head
    angle = math.atan2(y2 - y1, x2 - x1)
    ah = 8  # arrow head length
    aw = 4  # arrow head half-width
    p1 = (x2, y2)
    p2 = (x2 - ah * math.cos(angle) + aw * math.sin(angle),
          y2 - ah * math.sin(angle) - aw * math.cos(angle))
    p3 = (x2 - ah * math.cos(angle) - aw * math.sin(angle),
          y2 - ah * math.sin(angle) + aw * math.cos(angle))
    head = Polygon([p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]],
                   fillColor=color, strokeColor=color)
    d.add(head)
    if label:
        mx = (x1 + x2) / 2 + label_offset[0]
        my = (y1 + y2) / 2 + label_offset[1]
        if label_bg:
            tw = len(label) * 4.2
            d.add(Rect(mx - tw / 2 - 2, my - 4, tw + 4, 11,
                       fillColor=colors.white, strokeColor=None))
        d.add(String(mx, my, label,
                     fontName="Helvetica", fontSize=8,
                     fillColor=DARK_TEXT, textAnchor="middle"))


def process_box(d, x, y, w, h, number, label, color=NAVY):
    """Rounded rectangle for a DFD process bubble."""
    d.add(Rect(x, y, w, h, rx=10, ry=10,
               fillColor=color, strokeColor=color))
    d.add(String(x + w / 2, y + h - 14, f"{number}",
                 fontName="Helvetica-Bold", fontSize=10,
                 fillColor=colors.white, textAnchor="middle"))
    # multi-line label
    lines = label.split("\n")
    line_h = 11
    start_y = y + h / 2 + (len(lines) - 1) * line_h / 2 - 4
    for i, ln in enumerate(lines):
        d.add(String(x + w / 2, start_y - i * line_h, ln,
                     fontName="Helvetica-Bold", fontSize=9,
                     fillColor=colors.white, textAnchor="middle"))


def entity_box(d, x, y, w, h, label, color=ORANGE):
    """External entity (rectangle with double border style)."""
    d.add(Rect(x, y, w, h, fillColor=color, strokeColor=color))
    d.add(Rect(x + 2, y + 2, w - 4, h - 4,
               fillColor=color, strokeColor=colors.white, strokeWidth=1))
    lines = label.split("\n")
    line_h = 11
    start_y = y + h / 2 + (len(lines) - 1) * line_h / 2 - 4
    for i, ln in enumerate(lines):
        d.add(String(x + w / 2, start_y - i * line_h, ln,
                     fontName="Helvetica-Bold", fontSize=9,
                     fillColor=colors.white, textAnchor="middle"))


def datastore(d, x, y, w, h, code, label):
    """Open-ended rectangle for a data store."""
    d.add(Line(x, y, x + w, y, strokeColor=NAVY, strokeWidth=1.5))
    d.add(Line(x, y + h, x + w, y + h, strokeColor=NAVY, strokeWidth=1.5))
    d.add(Line(x + 30, y, x + 30, y + h, strokeColor=NAVY, strokeWidth=1.2))
    d.add(Rect(x, y, w, h, fillColor=HexColor("#EAF1FA"),
               strokeColor=None))
    d.add(String(x + 15, y + h / 2 - 3, code,
                 fontName="Helvetica-Bold", fontSize=9,
                 fillColor=NAVY, textAnchor="middle"))
    d.add(String(x + 30 + (w - 30) / 2, y + h / 2 - 3, label,
                 fontName="Helvetica", fontSize=9,
                 fillColor=DARK_TEXT, textAnchor="middle"))


def entity_table(d, x, y, w, title, fields, fill=HexColor("#FFFFFF"),
                 header_fill=NAVY):
    """ERD entity table: header strip + field rows."""
    row_h = 16
    header_h = 22
    total_h = header_h + row_h * len(fields)
    # Outer box
    d.add(Rect(x, y - total_h, w, total_h,
               fillColor=fill, strokeColor=NAVY, strokeWidth=1.2))
    # Header
    d.add(Rect(x, y - header_h, w, header_h,
               fillColor=header_fill, strokeColor=header_fill))
    d.add(String(x + w / 2, y - header_h + 6, title,
                 fontName="Helvetica-Bold", fontSize=10,
                 fillColor=colors.white, textAnchor="middle"))
    # Fields
    for i, (key, name) in enumerate(fields):
        ry = y - header_h - (i + 1) * row_h
        if i % 2 == 0:
            d.add(Rect(x, ry, w, row_h,
                       fillColor=HexColor("#F8F9FB"), strokeColor=None))
        d.add(String(x + 5, ry + 4, key,
                     fontName="Helvetica-Bold", fontSize=8,
                     fillColor=ORANGE if key in ("PK", "FK", "PK,FK") else GREY))
        d.add(String(x + 32, ry + 4, name,
                     fontName="Helvetica", fontSize=8.5,
                     fillColor=DARK_TEXT))
    # Bottom edge of header line
    d.add(Line(x, y - header_h, x + w, y - header_h,
               strokeColor=colors.white, strokeWidth=0.5))
    return total_h


def uml_class(d, x, y, w, title, attrs, methods, header_fill=NAVY):
    """UML class box: header + attributes + methods."""
    row_h = 12
    header_h = 20
    sep_h = 4
    body_h = row_h * len(attrs) + sep_h + row_h * len(methods) + 8
    total_h = header_h + body_h
    d.add(Rect(x, y - total_h, w, total_h,
               fillColor=colors.white, strokeColor=NAVY, strokeWidth=1))
    # Header
    d.add(Rect(x, y - header_h, w, header_h,
               fillColor=header_fill, strokeColor=header_fill))
    d.add(String(x + w / 2, y - header_h + 6, title,
                 fontName="Helvetica-Bold", fontSize=10,
                 fillColor=colors.white, textAnchor="middle"))
    # Attributes
    cy = y - header_h - row_h
    for a in attrs:
        d.add(String(x + 5, cy, a,
                     fontName="Helvetica", fontSize=8,
                     fillColor=DARK_TEXT))
        cy -= row_h
    # Separator
    d.add(Line(x, cy + 2, x + w, cy + 2,
               strokeColor=LIGHT_GREY, strokeWidth=0.5))
    cy -= sep_h
    # Methods
    for m in methods:
        d.add(String(x + 5, cy, m,
                     fontName="Helvetica-Oblique", fontSize=8,
                     fillColor=NAVY))
        cy -= row_h
    return total_h


# ───────────────────────── Specific diagrams ─────────────────────────

def build_context_diagram():
    d = Drawing(720, 380)
    # System bubble in the middle
    cx, cy = 360, 190
    r = 80
    d.add(Ellipse(cx, cy, r, r * 0.7, fillColor=NAVY, strokeColor=NAVY))
    d.add(String(cx, cy + 6, "0",
                 fontName="Helvetica-Bold", fontSize=14,
                 fillColor=colors.white, textAnchor="middle"))
    d.add(String(cx, cy - 10, "MyUniPath System",
                 fontName="Helvetica-Bold", fontSize=11,
                 fillColor=colors.white, textAnchor="middle"))

    # External entities
    entity_box(d, 30, 250, 130, 60, "STUDENT")
    entity_box(d, 30, 80, 130, 60, "ADMIN")
    entity_box(d, 560, 250, 130, 60, "UNITEN\nWEBSITE")
    entity_box(d, 560, 80, 130, 60, "BROWSER\n(Guest)")

    # Flows from STUDENT
    arrow(d, 160, 295, 280, 220,
          "Quiz answers, login,\nprofile updates", label_offset=(0, 12),
          label_bg=True)
    arrow(d, 280, 200, 160, 280,
          "Persona, recommendations,\nprofile data", label_offset=(0, -14),
          color=ORANGE, label_bg=True)

    # Flows from ADMIN
    arrow(d, 160, 115, 280, 170,
          "Login, edit user,\nrule changes", label_offset=(0, 12),
          label_bg=True)
    arrow(d, 280, 150, 160, 95,
          "Analytics, user list,\nrule data", label_offset=(0, -14),
          color=ORANGE, label_bg=True)

    # Flows to/from UNITEN WEBSITE
    arrow(d, 440, 220, 560, 285,
          "Program URLs\n(external link)", label_offset=(0, 12),
          color=GREY, label_bg=True, dashed=True)

    # Flows to/from Guest BROWSER
    arrow(d, 560, 105, 440, 170,
          "Browse programs,\nview about page", label_offset=(0, 12),
          label_bg=True)
    arrow(d, 440, 150, 560, 90,
          "Public pages,\nprogram data", label_offset=(0, -14),
          color=ORANGE, label_bg=True)

    return d


def build_dfd_level1():
    d = Drawing(760, 460)

    # External entities (left + right edges)
    entity_box(d, 15, 380, 110, 50, "STUDENT")
    entity_box(d, 15, 180, 110, 50, "ADMIN")
    entity_box(d, 15, 20, 110, 50, "GUEST")

    # Processes (centre)
    process_box(d, 175, 380, 120, 55, "1.0", "Authenticate\nUser")
    process_box(d, 175, 290, 120, 55, "2.0", "Run Quiz\nAssessment")
    process_box(d, 175, 200, 120, 55, "3.0", "Recommendation\nEngine", color=ORANGE)
    process_box(d, 175, 110, 120, 55, "4.0", "Manage\nProfile")
    process_box(d, 175, 20, 120, 55, "5.0", "Admin\nAnalytics")

    # Data stores (right side)
    datastore(d, 410, 395, 200, 25, "D1", "students")
    datastore(d, 410, 360, 200, 25, "D2", "quiz_questions")
    datastore(d, 410, 290, 200, 25, "D3", "quiz_completions")
    datastore(d, 410, 220, 200, 25, "D4", "persona_rules")
    datastore(d, 410, 150, 200, 25, "D5", "programs")
    datastore(d, 410, 80, 200, 25, "D6", "admin_settings")

    # ─── Flows ───
    # STUDENT → 1.0 → D1
    arrow(d, 125, 405, 175, 407, "credentials")
    arrow(d, 295, 407, 410, 407, "create/read", color=ORANGE)

    # STUDENT → 2.0
    arrow(d, 125, 400, 175, 320, "start quiz", label_offset=(-8, 12),
          label_bg=True)
    # 2.0 ↔ D2 (read questions)
    arrow(d, 295, 325, 410, 370, "read", color=NAVY, label_offset=(-8, 6))
    # 2.0 → 3.0
    arrow(d, 235, 290, 235, 255, "answers", color=NAVY)

    # 3.0 ↔ D4 (read rules)
    arrow(d, 295, 225, 410, 230, "read rules", color=ORANGE)
    # 3.0 ↔ D5 (read programs)
    arrow(d, 295, 215, 410, 160, "map programs", color=ORANGE,
          label_offset=(-6, 8))
    # 3.0 → D3 (save completion)
    arrow(d, 295, 235, 410, 300, "save", color=ORANGE,
          label_offset=(-2, 8))
    # 3.0 → 4.0 (update student persona)
    arrow(d, 235, 200, 235, 165, "persona", color=ORANGE)
    # 3.0 → STUDENT (results)
    arrow(d, 175, 215, 125, 395, "results", color=ORANGE,
          label_offset=(-6, 10), label_bg=True)

    # 4.0 ↔ D1 (update student)
    arrow(d, 295, 137, 410, 405, "update profile",
          label_offset=(-6, 16), label_bg=True)

    # ADMIN → 5.0
    arrow(d, 125, 205, 175, 47, "admin login",
          label_offset=(-8, 14), label_bg=True)
    # 5.0 ↔ D1
    arrow(d, 295, 50, 410, 400, "list users",
          label_offset=(-2, 14), label_bg=True)
    # 5.0 ↔ D3
    arrow(d, 295, 45, 410, 300, "analytics", color=NAVY,
          label_offset=(-2, 10), label_bg=True)
    # 5.0 ↔ D4 (rule CRUD)
    arrow(d, 295, 55, 410, 230, "rule CRUD", color=ORANGE,
          label_offset=(-2, 8), label_bg=True)
    # 5.0 → ADMIN (charts)
    arrow(d, 175, 60, 125, 205, "charts, table", color=ORANGE,
          label_offset=(-12, -10), label_bg=True)

    # GUEST → (D5 via Process 6.0 implicit — keep simple)
    arrow(d, 125, 45, 175, 110, "browse",
          label_offset=(-8, 12), label_bg=True)

    return d


def build_dfd_level2_engine():
    """Decomposition of process 3.0 — Recommendation Engine."""
    d = Drawing(760, 360)

    # Inputs / outputs (entities)
    entity_box(d, 15, 270, 110, 50, "Quiz Page\n(2.0)")
    entity_box(d, 15, 60, 110, 50, "Results Page\n(student)")

    # Data stores
    datastore(d, 620, 280, 130, 25, "D4", "persona_rules")
    datastore(d, 620, 175, 130, 25, "D5", "programs")
    datastore(d, 620, 70, 130, 25, "D3", "quiz_completions")
    datastore(d, 620, 35, 130, 25, "D1", "students")

    # Sub-processes
    process_box(d, 175, 280, 110, 50, "3.1", "Lookup\nRule Points")
    process_box(d, 320, 280, 110, 50, "3.2", "Tally Score\nper Persona")
    process_box(d, 465, 280, 110, 50, "3.3", "Pick Top\nPersona", color=ORANGE)
    process_box(d, 465, 175, 110, 50, "3.4", "Map Persona\nto Programs",
                color=ORANGE)
    process_box(d, 320, 70,  110, 50, "3.5", "Persist\nCompletion")
    process_box(d, 175, 70,  110, 50, "3.6", "Build Result\nResponse",
                color=ORANGE)

    # Flows
    arrow(d, 125, 295, 175, 305, "answer texts")
    arrow(d, 285, 305, 320, 305, "matched rules", color=NAVY)
    arrow(d, 430, 305, 465, 305, "scores", color=NAVY)
    arrow(d, 285, 295, 620, 293, "read rules", color=GREY, dashed=True,
          label_offset=(0, 6))
    arrow(d, 520, 280, 520, 225, "winning\npersona", color=ORANGE,
          label_offset=(0, 10))
    arrow(d, 575, 200, 620, 188, "read programs", color=GREY, dashed=True)
    arrow(d, 465, 195, 430, 95, "program ids", color=ORANGE,
          label_offset=(-6, 10))
    arrow(d, 430, 95, 620, 83, "save row", color=NAVY, dashed=True)
    arrow(d, 320, 95, 285, 95, "completion id")
    arrow(d, 285, 80, 125, 80, "persona +\nprograms", color=ORANGE,
          label_offset=(0, 8))
    arrow(d, 320, 75, 620, 50, "update\nstudent", color=GREY,
          dashed=True, label_offset=(0, 6))

    return d


def build_erd():
    d = Drawing(760, 480)

    # students (centre-left)
    entity_table(d, 20, 470, 180, "students",
                 [("PK", "id : bigint"),
                  ("",   "session_id : string (uniq)"),
                  ("",   "name : string"),
                  ("",   "email : string (uniq)"),
                  ("",   "password : string"),
                  ("",   "age : string"),
                  ("",   "persona : string?"),
                  ("",   "quiz_completed : bool"),
                  ("",   "quiz_response : json?"),
                  ("",   "highest_qualification : string?"),
                  ("",   "transcript_path : string?"),
                  ("",   "timestamps")])

    # quiz_completions (centre-right)
    entity_table(d, 250, 470, 200, "quiz_completions",
                 [("PK", "id : bigint"),
                  ("",   "session_id : string"),
                  ("",   "persona : string"),
                  ("",   "logic_score : int"),
                  ("",   "creative_score : int"),
                  ("",   "answers : json"),
                  ("",   "recommended_program_ids : json"),
                  ("",   "ip_address : string?"),
                  ("",   "user_agent : string?"),
                  ("",   "timestamps")])

    # persona_rules
    entity_table(d, 500, 470, 200, "persona_rules",
                 [("PK", "id : bigint"),
                  ("",   "answer_text : string"),
                  ("",   "persona : string"),
                  ("",   "points : int"),
                  ("",   "is_active : bool"),
                  ("",   "timestamps")])

    # programs
    entity_table(d, 20, 230, 180, "programs",
                 [("PK", "id : bigint"),
                  ("",   "slug : string (uniq)"),
                  ("",   "name : string"),
                  ("",   "short_desc : string"),
                  ("",   "duration : string"),
                  ("",   "fees : string"),
                  ("",   "intakes : string"),
                  ("",   "campus : string"),
                  ("",   "requirements : json"),
                  ("",   "careers : json"),
                  ("",   "external_url : string"),
                  ("",   "timestamps")])

    # quiz_questions
    entity_table(d, 250, 230, 200, "quiz_questions",
                 [("PK", "id : bigint"),
                  ("",   "question : string"),
                  ("",   "options : json"),
                  ("",   "order : int"),
                  ("",   "timestamps")])

    # admin_settings
    entity_table(d, 500, 230, 200, "admin_settings",
                 [("PK", "id : bigint"),
                  ("",   "key : string (uniq)"),
                  ("",   "value : string"),
                  ("",   "timestamps")])

    # Relationships (cardinality 1 ↔ N etc.)
    # students 1 — N quiz_completions  (logical, via session_id)
    arrow(d, 200, 380, 250, 380, "session_id", color=GREY,
          label_offset=(0, 6))
    d.add(String(195, 388, "1", fontName="Helvetica-Bold", fontSize=9,
                 fillColor=ORANGE))
    d.add(String(255, 388, "N", fontName="Helvetica-Bold", fontSize=9,
                 fillColor=ORANGE))

    # persona_rules feed quiz_completions via answer_text match
    arrow(d, 450, 425, 500, 425, "answer_text match",
          color=GREY, label_offset=(0, 6))
    d.add(String(495, 433, "N", fontName="Helvetica-Bold", fontSize=9,
                 fillColor=ORANGE))
    d.add(String(455, 433, "1", fontName="Helvetica-Bold", fontSize=9,
                 fillColor=ORANGE))

    # programs ↔ recommended_program_ids
    arrow(d, 200, 175, 250, 290, "slug ⊆ recommended_program_ids",
          color=GREY, label_offset=(60, 6), label_bg=True)

    # Legend
    d.add(Rect(20, 30, 720, 50, fillColor=LIGHT_BG, strokeColor=LIGHT_GREY))
    d.add(String(30, 60, "Legend",
                 fontName="Helvetica-Bold", fontSize=10, fillColor=DARK_TEXT))
    d.add(String(30, 45, "PK = primary key   "
                          "Relationships are logical (no hard FK constraints in the "
                          "current migrations — the app couples tables by session_id and slug).",
                 fontName="Helvetica", fontSize=8.5, fillColor=GREY))

    return d


def build_uml():
    d = Drawing(760, 520)

    # Backend layer
    d.add(String(20, 510, "Backend  (Laravel 11 / PHP 8.3)",
                 fontName="Helvetica-Bold", fontSize=11, fillColor=NAVY))
    d.add(Line(20, 505, 740, 505, strokeColor=NAVY, strokeWidth=1))

    # Models row
    uml_class(d, 20, 495, 150, "Student «Model»",
              ["- id : bigint", "- name : string", "- email : string",
               "- password : string", "- persona : string?",
               "- quiz_completed : bool", "- quiz_response : json?"],
              ["+ updateProfile()"])
    uml_class(d, 195, 495, 150, "QuizCompletion «Model»",
              ["- id : bigint", "- persona : string",
               "- logic_score : int", "- creative_score : int",
               "- answers : json",
               "- recommended_program_ids : json"],
              ["+ create()"])
    uml_class(d, 370, 495, 150, "PersonaRule «Model»",
              ["- id : bigint", "- answer_text : string",
               "- persona : string", "- points : int",
               "- is_active : bool"],
              ["+ whereIn()"])
    uml_class(d, 545, 495, 150, "Program «Model»",
              ["- id : bigint", "- slug : string",
               "- name : string", "- summary : string",
               "- external_url : string"],
              ["+ all()"])

    # Controllers row
    uml_class(d, 20, 330, 165, "StudentController",
              ["- request : Request"],
              ["+ index()", "+ store()", "+ login()",
               "+ me()", "+ update()",
               "+ adminUpdate()", "+ adminDestroy()"])
    uml_class(d, 210, 330, 165, "QuizController",
              ["- engine : RecommendationEngine"],
              ["+ questions()", "+ submit()", "+ recommend()"])
    uml_class(d, 400, 330, 165, "AnalyticsController",
              ["- admin_password : string"],
              ["+ login()", "+ dashboard()"])
    uml_class(d, 590, 330, 160, "RecommendationEngine «Service»",
              ["- scores : array"],
              ["+ calculate(answers) : array"])

    # Frontend layer header
    d.add(String(20, 200, "Frontend  (React 18 / TypeScript / Vite)",
                 fontName="Helvetica-Bold", fontSize=11, fillColor=ORANGE))
    d.add(Line(20, 195, 740, 195, strokeColor=ORANGE, strokeWidth=1))

    uml_class(d, 20, 185, 160, "StudentContext «Provider»",
              ["- studentData : StudentData",
               "- isLoggedIn : bool",
               "- isLoaded : bool"],
              ["+ login(student)", "+ logout()",
               "+ updateStudentData()"], header_fill=ORANGE)
    uml_class(d, 195, 185, 165, "api «Module»",
              ["- API_BASE : string",
               "- sessionId : string"],
              ["+ loginStudent()", "+ submitQuiz()",
               "+ getRecommendation()",
               "+ adminUpdateStudent()",
               "+ getAnalytics()"], header_fill=ORANGE)
    uml_class(d, 375, 185, 165, "recommendationEngine «Module»",
              ["- FALLBACK_PERSONA_PROGRAM_MAP"],
              ["+ calculateScores()",
               "+ getPersonaFromScores()",
               "+ getRecommendations()",
               "+ getActivePersonaRules()"], header_fill=ORANGE)
    uml_class(d, 555, 185, 165, "Pages «View»",
              ["WelcomePage, LoginPage,",
               "QuizPage, ResultPage,",
               "StudentProfile,",
               "AnalyticsDashboard, ..."],
              ["render()"], header_fill=ORANGE)

    # Relationship arrows
    arrow(d, 102, 410, 102, 380, "uses", color=GREY,
          label_offset=(-12, 0))
    arrow(d, 290, 410, 290, 380, "uses", color=GREY,
          label_offset=(-12, 0))
    arrow(d, 480, 410, 480, 380, "uses", color=GREY,
          label_offset=(-12, 0))
    arrow(d, 290, 330, 670, 380, "depends", color=GREY, dashed=True,
          label_offset=(0, 8))

    # HTTP boundary
    arrow(d, 275, 195, 275, 270, "HTTP / JSON", color=ORANGE,
          label_offset=(-25, 0))
    arrow(d, 275, 270, 275, 195, "responses", color=NAVY,
          label_offset=(25, 0))

    return d


# ───────────────────────── Document composition ─────────────────────────

def fit_drawing(d, max_w=720, max_h=380):
    """Wrap the drawing's contents in a Group with a scale transform so the
    overall bounding box fits within (max_w, max_h)."""
    sx = max_w / d.width if d.width > max_w else 1.0
    sy = max_h / d.height if d.height > max_h else 1.0
    s = min(sx, sy)
    if s >= 1.0:
        return d
    new = Drawing(d.width * s, d.height * s)
    g = Group(*list(d.contents))
    g.scale(s, s)
    new.add(g)
    return new


def build_pdf():
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle("CoverTitle",
                              fontName="Helvetica-Bold", fontSize=30,
                              alignment=TA_CENTER, textColor=NAVY,
                              leading=36, spaceAfter=10))
    styles.add(ParagraphStyle("CoverSubtitle",
                              fontName="Helvetica", fontSize=14,
                              alignment=TA_CENTER, textColor=ORANGE,
                              leading=20, spaceAfter=20))
    styles.add(ParagraphStyle("CoverMeta",
                              fontName="Helvetica", fontSize=11,
                              alignment=TA_CENTER, textColor=GREY,
                              leading=16, spaceAfter=6))
    styles.add(ParagraphStyle("H1",
                              fontName="Helvetica-Bold", fontSize=20,
                              textColor=NAVY, spaceBefore=4, spaceAfter=10,
                              leading=24))
    styles.add(ParagraphStyle("H2",
                              fontName="Helvetica-Bold", fontSize=14,
                              textColor=ORANGE, spaceBefore=8, spaceAfter=6,
                              leading=18))
    styles.add(ParagraphStyle("Body",
                              fontName="Helvetica", fontSize=10.5,
                              textColor=DARK_TEXT, leading=15,
                              spaceAfter=4))
    styles.add(ParagraphStyle("Caption",
                              fontName="Helvetica-Oblique", fontSize=9,
                              textColor=GREY, alignment=TA_CENTER,
                              spaceBefore=6, spaceAfter=10))

    # Two page templates: portrait for text, landscape for diagrams
    portrait_frame = Frame(20 * mm, 18 * mm,
                           A4[0] - 40 * mm, A4[1] - 36 * mm,
                           id="portrait")
    landscape_frame = Frame(15 * mm, 15 * mm,
                            landscape(A4)[0] - 30 * mm,
                            landscape(A4)[1] - 30 * mm,
                            id="landscape")

    def header_footer(canvas, doc):
        canvas.saveState()
        canvas.setFont("Helvetica", 8)
        canvas.setFillColor(GREY)
        canvas.drawString(15 * mm, 10 * mm,
                          "MyUniPath  •  Technical Documentation")
        canvas.drawRightString(doc.pagesize[0] - 15 * mm, 10 * mm,
                               f"Page {doc.page}")
        canvas.restoreState()

    doc = BaseDocTemplate(OUTPUT, pagesize=A4,
                          leftMargin=20 * mm, rightMargin=20 * mm,
                          topMargin=18 * mm, bottomMargin=18 * mm,
                          title="MyUniPath Technical Documentation",
                          author="MyUniPath FYP")
    doc.addPageTemplates([
        PageTemplate(id="portrait", frames=[portrait_frame],
                     onPage=header_footer),
        PageTemplate(id="landscape", frames=[landscape_frame],
                     pagesize=landscape(A4), onPage=header_footer),
    ])

    story = []

    # ─── Cover ───
    story.append(Spacer(1, 60 * mm))
    story.append(Paragraph("MyUniPath", styles["CoverTitle"]))
    story.append(Paragraph(
        "Rule-Based ICT Career Decision Support System",
        styles["CoverSubtitle"]))
    story.append(Spacer(1, 8 * mm))
    story.append(Paragraph("Technical Documentation", styles["CoverMeta"]))
    story.append(Paragraph("Tech Stack &nbsp;•&nbsp; Context Diagram &nbsp;•&nbsp; "
                           "DFD (Level 1 &amp; 2) &nbsp;•&nbsp; ERD &nbsp;•&nbsp; UML",
                           styles["CoverMeta"]))
    story.append(Spacer(1, 70 * mm))
    story.append(Paragraph("Final Year Project &nbsp;|&nbsp; "
                           "College of Computing &amp; Informatics, UNITEN",
                           styles["CoverMeta"]))
    story.append(PageBreak())

    # ─── 1. Tech Stack ───
    story.append(Paragraph("1.  Tech Stack", styles["H1"]))
    story.append(Paragraph(
        "MyUniPath is built as a decoupled web application. The React frontend "
        "talks to the Laravel API exclusively via asynchronous JSON requests, "
        "and the API persists data in MySQL.", styles["Body"]))
    story.append(Spacer(1, 4 * mm))

    tech_rows = [
        ["Layer", "Technology", "Purpose"],
        ["Frontend Framework",  "React 18 + TypeScript",         "Component-driven SPA"],
        ["Build Tool",          "Vite 6",                         "Dev server + bundler"],
        ["Styling",             "Tailwind CSS v4",                "Utility-first CSS"],
        ["UI Primitives",       "shadcn/ui + Radix UI",           "Accessible components"],
        ["Animation",           "Framer Motion",                  "Page & UI transitions"],
        ["Routing",             "React Router v6",                "Client-side routes"],
        ["Charts",              "Recharts",                       "Radar, pie, bar charts"],
        ["State",               "React Context (StudentContext)", "Auth + student session"],
        ["Icons",               "lucide-react",                   "Iconography"],
        ["Backend Framework",   "Laravel 11",                     "REST API & MVC"],
        ["Language",            "PHP 8.3",                        "Runtime"],
        ["ORM",                 "Eloquent",                       "DB abstraction"],
        ["Database",            "MySQL 8",                        "Relational store"],
        ["Auth",                "Custom session-id (X-Session-Id header)", "Stateless API auth"],
        ["Admin Auth",          "Admin password (X-Admin-Password header)", "Admin endpoints"],
        ["Asset Hosting",       "Laravel public/storage (transcripts)",     "PDF uploads"],
        ["HTTP Client",         "Fetch API (typed wrapper in lib/api.ts)",  "Frontend ↔ Laravel"],
        ["Package Mgmt",        "npm + Composer",                 "JS & PHP dependencies"],
        ["Dev Server",          "Vite (port 3000) + php artisan serve (8000)", "Local dev"],
    ]
    tbl = Table(tech_rows, colWidths=[40 * mm, 55 * mm, 70 * mm])
    tbl.setStyle(TableStyle([
        ("BACKGROUND",   (0, 0), (-1, 0), NAVY),
        ("TEXTCOLOR",    (0, 0), (-1, 0), colors.white),
        ("FONTNAME",     (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE",     (0, 0), (-1, -1), 9.5),
        ("BOTTOMPADDING",(0, 0), (-1, 0), 7),
        ("TOPPADDING",   (0, 0), (-1, 0), 7),
        ("ROWBACKGROUNDS",(0, 1), (-1, -1), [colors.white, HexColor("#F4F6FA")]),
        ("GRID",         (0, 0), (-1, -1), 0.3, LIGHT_GREY),
        ("VALIGN",       (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING",  (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TEXTCOLOR",    (0, 1), (-1, -1), DARK_TEXT),
    ]))
    story.append(tbl)

    story.append(Spacer(1, 6 * mm))
    story.append(Paragraph("Architecture in one line", styles["H2"]))
    story.append(Paragraph(
        "Browser  ⇄  React (Vite, :3000)  ⇄  HTTP JSON  ⇄  "
        "Laravel API (:8000)  ⇄  Eloquent ORM  ⇄  MySQL",
        styles["Body"]))

    story.append(NextPageTemplate("landscape"))
    story.append(PageBreak())

    # ─── 2. Context Diagram (DFD Level 0) ───
    story.append(Paragraph("2.  Context Diagram &nbsp;(DFD Level 0)",
                           styles["H1"]))
    story.append(Paragraph(
        "The whole system is shown as a single process. External entities "
        "represent the actors that exchange data with MyUniPath.",
        styles["Body"]))
    story.append(Spacer(1, 4 * mm))
    story.append(fit_drawing(build_context_diagram(), 720, 380))
    story.append(Paragraph(
        "Figure 1 — Context Diagram. Inputs in navy, outputs in orange; dashed "
        "lines represent external (uniten.edu.my) links opened in a new tab.",
        styles["Caption"]))
    story.append(PageBreak())

    # ─── 3. DFD Level 1 ───
    story.append(Paragraph("3.  Data Flow Diagram &nbsp;(Level 1)",
                           styles["H1"]))
    story.append(Paragraph(
        "Decomposition of the single process from the context diagram into "
        "the five main sub-processes. Data stores (D1–D6) map 1:1 onto MySQL "
        "tables.",
        styles["Body"]))
    story.append(Spacer(1, 4 * mm))
    story.append(fit_drawing(build_dfd_level1(), 720, 380))
    story.append(Paragraph(
        "Figure 2 — Level 1 DFD. Orange flows indicate outputs back to the "
        "user / writes to data stores; navy flows indicate inputs / reads.",
        styles["Caption"]))
    story.append(PageBreak())

    # ─── 4. DFD Level 2 ───
    story.append(Paragraph("4.  DFD Level 2 &nbsp;—&nbsp; Recommendation Engine (3.0)",
                           styles["H1"]))
    story.append(Paragraph(
        "Further decomposition of process 3.0 from the Level 1 DFD. Shows "
        "exactly how the engine turns a list of selected answer texts into a "
        "persona and a list of recommended program IDs.",
        styles["Body"]))
    story.append(Spacer(1, 4 * mm))
    story.append(fit_drawing(build_dfd_level2_engine(), 720, 380))
    story.append(Paragraph(
        "Figure 3 — Level 2 DFD for the Recommendation Engine. Dashed lines "
        "are reads / writes to data stores; solid lines are inter-process "
        "data flows.",
        styles["Caption"]))
    story.append(PageBreak())

    # ─── 5. ERD ───
    story.append(Paragraph("5.  Entity–Relationship Diagram",
                           styles["H1"]))
    story.append(Paragraph(
        "Schema as defined in Laravel migrations under "
        "<font face='Courier'>backend/database/migrations/</font>. "
        "Relationships shown here are logical — the application links "
        "tables by <font face='Courier'>session_id</font> and by program "
        "<font face='Courier'>slug</font> rather than hard foreign-key "
        "constraints.",
        styles["Body"]))
    story.append(Spacer(1, 2 * mm))
    story.append(fit_drawing(build_erd(), 720, 380))
    story.append(Paragraph(
        "Figure 4 — ERD. Each box represents a MySQL table; PK marks the "
        "primary key. Bracketed cardinalities (1, N) show the multiplicity "
        "of the relationship.",
        styles["Caption"]))
    story.append(PageBreak())

    # ─── 6. UML Class Diagram ───
    story.append(Paragraph("6.  UML Class Diagram", styles["H1"]))
    story.append(Paragraph(
        "Layered view of the key classes / modules in both tiers. Top half "
        "is Laravel (Models, Controllers, Service). Bottom half is React "
        "(Context, API client, Engine, Pages). The two tiers communicate "
        "only over HTTP / JSON.",
        styles["Body"]))
    story.append(Spacer(1, 2 * mm))
    story.append(fit_drawing(build_uml(), 720, 380))
    story.append(Paragraph(
        "Figure 5 — UML Class Diagram. «Stereotype» tags clarify the role of "
        "each class (Model / Service / Provider / Module / View).",
        styles["Caption"]))

    doc.build(story)


if __name__ == "__main__":
    build_pdf()
    print(f"Generated {OUTPUT}")
