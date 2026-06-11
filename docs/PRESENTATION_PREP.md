# MyUniPath FYP2 — Presentation Prep (21–22 May 2026)

> One-page reference for the panel defense. Slot: 20-min presentation + Q&A.
> Format: MS Teams (mandatory recording per assigned channel).

---

## 0. Pre-flight checklist (do these tonight + 1 hour before slot)

**Tonight:**
- [x] Smoke-tested: MySQL up, programs seeded (6), quiz_questions (8), persona_rules (33), all key API endpoints return 200, frontend serves on :3000.
- [ ] Close laptop normally, do **not** shut down WAMP — restart laptop tomorrow and re-verify WAMP is green.
- [x] Slide deck generated at `docs/MyUniPath_Presentation.pptx` (17 slides). Open in PowerPoint to do a final read-through tonight.

**1 hour before slot:**
1. Open **WAMP** → left-click tray icon → **Start All Services** → icon turns green.
2. Open two PowerShell terminals in the project root:
   - Terminal A (backend):
     ```powershell
     cd backend
     C:\wamp64\bin\php\php8.3.14\php.exe artisan serve --port=8000
     ```
   - Terminal B (frontend):
     ```powershell
     npm run dev
     ```
3. Open browser to `http://localhost:3000` — confirm hero page loads.
4. Open a second browser tab to `http://localhost:3000/admin` — confirm admin login screen.
5. Have `docs/MyUniPath_Documentation.pdf` open in another tab for architecture diagrams if examiners ask.
6. **Login MS Teams** to the assigned channel, share screen, start recording.

**Known gotchas:**
- Frontend has no `.env` file — it falls back to `http://localhost:8000/api` via `api.ts:5`. Don't touch this.
- Admin password is `admin123` (from `backend/.env`).
- `persona_rules` table has no `is_active` column — the ERD in the PDF shows it but it was dropped during development. If asked, say "the field is in the design but was deferred since all seeded rules are active; can be added without breaking the engine."

---

## 1. Intro (~3 min) — script

> *"Good morning panel. I'm presenting **MyUniPath: a Rule-Based ICT Career Decision Support System**, my Final Year Project for the College of Computing and Informatics."*

### Problem Background (~45 sec)
> *"Every year, SPM leavers face six different ICT programs at UNITEN — Software Engineering, IT, Information Systems, Cybersecurity, AI, and Data Science. Most students pick based on what sounds interesting, not on whether the program actually matches their personality and strengths. The existing UNITEN website lists programs but offers no personalized guidance. Generic career tests like MBTI or Holland Code don't map to actual UNITEN programs. Career counselors are available but bottlenecked."*

### Problem Statement (~30 sec)
> *"There is no UNITEN-specific tool that translates an SPM leaver's interests and aptitudes into a concrete recommendation among UNITEN's ICT programs. Students choose blindly, sometimes switching programs in year 2 — costing time and money."*

### Project Objective (~45 sec)
> *"MyUniPath solves this with three objectives:*
> 1. *Build a web-based **8-question assessment** that captures interests and cognitive style.*
> 2. *Implement a **rule-based recommendation engine** that maps answers to one of four UNITEN-specific tech personas — Creator, Solver, Guardian, Analyst — and ranks the top three programs.*
> 3. *Provide an **admin panel** where UNITEN counselors can edit personas and rules without touching code, so the system stays current as programs evolve."*

### Presentation Structure (~30 sec)
> *"My presentation will cover:*
> 1. *User Registration & Login*
> 2. *The 8-question Quiz Assessment*
> 3. *Persona Result with radar-chart score breakdown + Top 3 program recommendations*
> 4. *Program browsing, comparison, and details*
> 5. *Admin — Analytics dashboard, User Management, Persona Rules CRUD*
> 6. *Architecture overview (briefly)*
> 7. *Q & A"*

---

## 2. System Demo (~17 min) — walkthrough

### Beat 1 — Landing & branding (1 min)
- Open `http://localhost:3000`.
- Point out: UNITEN brand (navy `#0F3361`, cinnabar `#e34628`), gradient title, mascot logo.
- Hover the hero image (tilts).
- Show the three feature cards: Quick & Easy, Highly Personalized, Expert Guidance.
- Click **"Start Assessment"** → redirected to `/login` because quiz requires auth.

### Beat 2 — Registration (1.5 min)
- Click **"Sign up"** (or navigate to `/register`).
- Fill: name = `Demo Student`, email = `demo@uniten.edu.my`, password = `demo1234`, age = `19`, highest qualification = `SPM`.
- *(Optional)* Upload SPM transcript PDF (any small PDF — there are sample ones in `storage/app/public/transcripts/`).
- Submit → auto-logged in → redirected to `/quiz`.
- **Talking point:** *"Passwords are hashed with Bcrypt at registration — never stored in plaintext. The student model marks password as $hidden so it never leaks in API responses."*

### Beat 3 — Quiz Assessment (3 min)
- 8 questions appear one at a time.
- Point out: per-question theme image, mascot **"Uni"** with stage-specific encouragement, progress bar, choose-one options.
- **Talking point:** *"Each option carries three values: a `persona` tag, a `logic` score (0–4), and a `creative` score (0–4). These feed two parallel signals into the engine."*
- Pick answers that lean toward Creator (e.g. "Building apps and websites", "Designing interfaces that look beautiful").
- On Q8, click **"See Results"** — submitting calls `/api/recommend` to compute persona via rules, then `/api/quiz/submit` to persist.

### Beat 4 — Result page (2 min)
- Radar chart shows score breakdown across Creator / Solver / Guardian / Analyst.
- Persona reveal card with floating mascot, persona title, traits.
- **Talking point:** *"The radar chart visualises the engine's actual scoring, not a hardcoded result. If I retake the quiz with different answers, the chart shape changes."*
- Scroll down: Top 3 recommended ICT programs as cards.
- Three CTAs: View All Programs, Compare Programs, Take Quiz Again.

### Beat 5 — Program details (1.5 min)
- Click a program card → `/program/:slug`.
- Show: duration, fees (RM), intakes, campus, requirements (SPM credits), careers list.
- Point out the external "Visit UNITEN" link → opens uniten.edu.my in a new tab (matches Context Diagram).

### Beat 6 — Program comparison (1.5 min)
- Navigate to `/compare`.
- Select 2–3 programs side-by-side.
- **Talking point:** *"For indecisive students, this is the killer feature — compare fees, careers, and entry requirements at a glance without scrolling between pages."*

### Beat 7 — Student profile (1 min)
- Navigate to `/profile`.
- Shows: name, email, age, qualification, persona badge, uploaded transcript link.
- Click **Edit Profile** → re-uses the `StudentInfoForm` component.
- **Talking point:** *"The same form handles both registration and profile editing — single source of truth for student data validation."*

### Beat 8 — Admin Dashboard (2.5 min)
- Logout student. Click **Admin** button → `/admin`.
- Enter password `admin123`.
- Show the three tabs:
  1. **Analytics** — bar chart of program view counts, pie chart of persona distribution, total participants metric.
  2. **User Management** — list of all students, edit/delete (calls `PATCH /api/admin/students/{id}` and `DELETE /api/admin/students/{id}`, guarded by `X-Admin-Password` header).
  3. **Persona Rules CRUD** — counselors can add/edit personas, set traits, map programs, adjust logic/creative weights, mark active/inactive. Changes persist to localStorage and immediately affect the recommendation engine.
- **Talking point:** *"This is the system's flexibility story. If UNITEN adds a new degree next year — say Quantum Computing — a counselor with no coding skills can add a 'Quantum' persona, map it to the new program, and the engine picks it up on the next quiz submission."*

### Beat 9 — Architecture overview (1.5 min) — *use if time permits*
- Open `docs/MyUniPath_Documentation.pdf` to the Context Diagram (page 3).
- One-line architecture: *"Browser → React on Vite port 3000 → HTTP JSON → Laravel 11 on PHP 8.3 port 8000 → Eloquent ORM → MySQL 8."*
- Briefly point at: 4 external actors (Student, Admin, Guest, UNITEN Website), 5 main processes (DFD Level 1: Authenticate, Quiz, Recommend, Profile, Analytics), 6 MySQL tables.
- Mention the **Level 2 DFD** of the Recommendation Engine: Lookup Rule Points → Tally → Pick Top Persona → Map to Programs → Persist → Build Response.

### Beat 10 — Close (30 sec)
> *"That's MyUniPath: a personalized, UNITEN-specific, rule-based career decision support system. Built end-to-end with React, Laravel, and MySQL, deployable locally with WAMP, and maintainable by non-technical UNITEN staff through the admin CRUD. I'm happy to take any questions."*

---

## 3. Q&A defense brief

### A. Algorithm & design

**Q: Why rule-based instead of machine learning?**
> *"Three reasons. First, **interpretability** — a panel or counselor can read a persona_rule row and explain to a student exactly why they got their result. ML would be a black box. Second, **cold start** — I don't have years of historical 'student-took-program-and-was-happy' training data. Third, **maintainability** — UNITEN staff can edit rules in the CRUD. Retraining an ML model every time programs change would require a data scientist on staff."*

**Q: How does the recommendation engine work?**
> *"Each of the 8 quiz options has a fixed answer_text. The `persona_rules` table maps answer_text → persona → points. When the student submits, the engine looks up every selected answer in the rules table, tallies scores per persona (Creator, Solver, Guardian, Analyst), picks the highest scorer, and maps that persona to a fixed list of UNITEN programs via the `programs` table. The radar chart on the result page renders the actual score breakdown so the student sees not just their winning persona but their full profile."*

**Q: How did you decide on 4 personas?**
> *"I clustered UNITEN's six ICT programs by skill orientation. **Creator** (Software Engineering, IT) for builders. **Guardian** (Cybersecurity) for defenders. **Analyst** (Data Science, Information Systems) for pattern-finders. **Solver** (AI, problem-heavy SE) for puzzle-thinkers. Four is enough to be discriminating without being arbitrary — I rejected 8+ personas because some would have had only one program mapped, defeating the point."*

**Q: How do you handle ties between personas?**
> *"In the current implementation, the engine returns the first max-scoring persona it finds. For the realistic case where one answer-text contributes to multiple personas with different weights — for example, 'Building apps and websites' gives Creator +10 and Solver +2 — the weighting itself usually breaks ties. If a true tie occurs, a future enhancement would be to ask one tie-breaker question; for now the engine is deterministic and reproducible."*

**Q: What if a student's answers don't match any rule?**
> *"Two layers of fallback. First, the frontend `recommendationEngine.ts` has a `FALLBACK_PERSONA_PROGRAM_MAP` hardcoded — even if the backend is unreachable, the student still gets a result. Second, if all four personas score zero, the engine returns 'Solver' as a default since Software Engineering is the most general ICT program."*

### B. Architecture & tech choices

**Q: Why Laravel + React instead of a monolithic stack?**
> *"Decoupling lets me iterate the React UI without touching the API. The API is also reusable — UNITEN could embed the quiz on its main website with just a script tag if they wanted. Laravel gives me Eloquent ORM, migrations, validation, and Bcrypt out of the box; building those in raw PHP would have eaten a month of project time."*

**Q: Why session-id auth instead of JWT or OAuth?**
> *"Scope. The data the student stores is non-sensitive — name, email, quiz answers. JWT or OAuth would be overkill and would add token-refresh complexity. The session-id is a UUID stored client-side, passed in `X-Session-Id`, and the API treats it as a stateless lookup key. Passwords themselves are Bcrypt-hashed before storage."*

**Q: Why a custom admin header (X-Admin-Password) instead of a proper auth system?**
> *"For a single-admin, intranet-deployed tool, a shared secret stored in `.env` is acceptable and far simpler than building a full admin auth table. If MyUniPath were deployed publicly with multiple admins, I'd swap this for Laravel's built-in Sanctum or session auth — that's about a 1-hour migration."*

**Q: Is your admin password comparison vulnerable to timing attacks?**
> *"The current code uses `!==` which is technically not constant-time. For local intranet use this is acceptable; for production I'd swap to `hash_equals()` — one-line change."*

### C. Database & data

**Q: Your ERD shows `is_active` on persona_rules but the migration doesn't have it. Why?**
> *"Honest answer — the ERD reflects the original design. During implementation I deferred the soft-delete column because every seeded rule is currently active, and the CRUD UI uses a separate `isActive` boolean in localStorage for unsaved rule edits. The column is a 1-line migration if examiners want to see it added; the documentation should be updated to match the live schema."*

**Q: Why are relationships logical (no foreign keys)?**
> *"Two reasons. First, the `quiz_completions` table is append-only audit data; if a student is deleted, I want to keep the anonymous completion record. Second, `recommended_program_ids` is a JSON column for flexibility — a hard FK to programs would block adding/removing programs without a migration. The trade-off is that the application code has to enforce referential integrity, which it does via the `slug` lookup in the seeder."*

**Q: What data are you collecting and how is it protected?**
> *"Student name, email, age, highest qualification, an optional SPM transcript PDF, and quiz answers. Passwords are Bcrypt-hashed. Transcripts are stored in `storage/app/public/transcripts/` with hashed filenames. For full PDPA compliance in production I would add: explicit consent on registration, a data-export endpoint, and a delete-my-account endpoint — the admin destroy endpoint already exists, just not exposed to students."*

### D. Evaluation & scope

**Q: How did you evaluate that the recommendations are correct?**
> *"Three checks. First, **rule coverage** — I verified every quiz option maps to at least one persona rule. Second, **persona distribution** — I ran the quiz with answer combinations skewed toward each persona and confirmed each persona can win. Third, **face validity** — the program-to-persona mappings (e.g. Cybersecurity → Guardian) were reviewed against UNITEN's published program descriptions. For FYP3 / future work I would do a controlled user test with N=20+ SPM leavers and compare against a counselor's recommendation."*

**Q: What are your scope limitations?**
> *"Three honest limitations. First, only **6 ICT programs** at UNITEN are covered — not engineering, business, or other faculties. Second, the question bank is **8 questions** — a longer instrument would discriminate better but trade off completion rate. Third, recommendations don't yet factor in **SPM grades**: the transcript is uploaded but used as supporting evidence only, not parsed."*

**Q: Future work?**
> *"Four items. (1) **OCR on the SPM transcript** to extract grades and factor them into eligibility filtering. (2) **Outcome tracking** — survey students who enrolled, feed back into rule weights. (3) **Multilingual support** — currently English only. (4) **Migration to ML once data accumulates** — once we have ~500 completions plus enrolment outcomes, a logistic regression or simple decision tree could be A/B tested against the rule engine."*

### E. Demo-day curveballs

**Q: Show me a quiz where you don't get Creator. Can the engine pick another persona?**
> *(Be ready to retake the quiz on the spot with Guardian-leaning answers: pick anything involving "security", "protecting", "investigating". Show the radar shifts.)*

**Q: What happens if I refresh in the middle of the quiz?**
> *"The quiz state lives in React component state, so a mid-quiz refresh restarts the assessment. This is intentional — partial quizzes would produce misleading recommendations. Auto-save was descoped to keep the project focused."*

**Q: What if MySQL goes down during a demo?**
> *(This is the worst-case. The frontend has a fallback — `api.ts` and `recommendationEngine.ts` both gracefully degrade. The admin login also has a hardcoded `admin123` fallback in `AnalyticsDashboard.tsx:115`. Show the radar chart still renders even if backend is down — the recommendation engine runs client-side.)*

---

## 4. Day-of reminders

- **Dress professionally** (per coordinator email).
- **Arrive 1 hour early** — your slot may start ahead of schedule if the previous student finishes early.
- **Recording is mandatory** — start MS Teams recording before you start speaking. Failure to record can deduct marks.
- Keep this file open on a second monitor / phone for the script + Q&A.
- **Don't read the script verbatim** — use it as scaffolding. Examiners reward natural delivery.
- If you blank: pause, breathe, re-anchor to the slide title or the persona on screen, continue.

Good luck.
