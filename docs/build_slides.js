/**
 * MyUniPath FYP2 Defense - Slide Generator
 * Produces docs/MyUniPath_Presentation.pptx
 *
 * Run from project root:  node docs/build_slides.js
 */

const path = require("path");
const fs = require("fs");
const PptxGenJS = require("pptxgenjs");

// Load PNG file -> base64 data URI (more portable than file paths across viewers)
function loadImg(absPath) {
  const buf = fs.readFileSync(absPath);
  const ext = absPath.toLowerCase().endsWith(".jpg") || absPath.toLowerCase().endsWith(".jpeg") ? "jpeg" : "png";
  return "data:image/" + ext + ";base64," + buf.toString("base64");
}

// --- Brand palette (no # prefix per pptxgenjs constraint) ---
const NAVY        = "0F3361";   // UNITEN primary
const NAVY_DARK   = "071F3D";   // darker variant for title backgrounds
const CINNABAR    = "E34628";   // UNITEN accent
const CINNABAR_DK = "C93D22";   // hover-state variant
const MUDDY       = "BA7A65";   // tertiary
const CREAM       = "FAF7F2";   // soft background
const WHITE       = "FFFFFF";
const TEXT_DARK   = "1A1F2C";
const TEXT_MUTED  = "6B7280";
const GRID_LIGHT  = "E5E7EB";
const CARD_BG     = "F8FAFC";

// --- Typography ---
const FONT_HEAD = "Calibri";
const FONT_BODY = "Calibri";

// --- Asset paths (absolute, since cwd may differ) ---
const ROOT = path.resolve(__dirname, "..");
const ASSET = (name) => path.join(ROOT, "public", name);

// --- Boilerplate ---
const pres = new PptxGenJS();
pres.layout = "LAYOUT_16x9";   // 10" x 5.625"
pres.author = "MyUniPath FYP2";
pres.title  = "MyUniPath - Rule-Based ICT Career Decision Support System";
pres.company = "College of Computing and Informatics, UNITEN";

const W = 10.0;
const H = 5.625;

// Helper: standard content-slide header
function addHeader(slide, title, subtitle) {
  slide.addShape(pres.shapes.OVAL, {
    x: 0.5, y: 0.42, w: 0.28, h: 0.28,
    fill: { color: CINNABAR }, line: { color: CINNABAR },
  });
  slide.addText(title, {
    x: 0.95, y: 0.28, w: 8.5, h: 0.6,
    fontFace: FONT_HEAD, fontSize: 32, bold: true, color: NAVY,
    margin: 0, valign: "middle",
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.95, y: 0.85, w: 8.5, h: 0.34,
      fontFace: FONT_BODY, fontSize: 14, italic: true, color: TEXT_MUTED,
      margin: 0, valign: "middle",
    });
  }
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: subtitle ? 1.28 : 0.96, w: 9, h: 0.02,
    fill: { color: GRID_LIGHT }, line: { color: GRID_LIGHT },
  });
}

function makeShadow() {
  return { type: "outer", color: "000000", blur: 12, offset: 3, angle: 90, opacity: 0.10 };
}
function makeShadowSoft() {
  return { type: "outer", color: "000000", blur: 6, offset: 2, angle: 90, opacity: 0.08 };
}

const slides = [];

// =====================================================================
// SLIDE 1: TITLE
// =====================================================================
slides.push(() => {
  const s = pres.addSlide();
  s.background = { color: NAVY_DARK };

  for (let i = 0; i < 3; i++) {
    s.addShape(pres.shapes.RECTANGLE, {
      x: 8.0 + i * 0.6, y: 0, w: 0.12, h: H,
      fill: { color: CINNABAR, transparency: i * 25 + 35 },
      line: { color: CINNABAR, transparency: 100 },
    });
  }

  s.addImage({ data: loadImg(ASSET("logo.png")), x: 0.7, y: 0.55, w: 1.1, h: 1.1 });

  s.addText("MyUniPath", {
    x: 0.7, y: 1.75, w: 8.5, h: 1.1,
    fontFace: FONT_HEAD, fontSize: 68, bold: true, color: WHITE, margin: 0,
  });

  s.addText("A Rule-Based ICT Career Decision Support System", {
    x: 0.7, y: 2.85, w: 8.5, h: 0.55,
    fontFace: FONT_BODY, fontSize: 22, color: CINNABAR, margin: 0,
  });

  s.addImage({ data: loadImg(ASSET("robot-jumping.png")), x: 6.8, y: 3.4, w: 1.7, h: 1.7 });

  s.addText("Final Year Project 2  -  Panel Defense", {
    x: 0.7, y: 3.85, w: 7, h: 0.4,
    fontFace: FONT_BODY, fontSize: 18, color: WHITE, margin: 0,
  });
  s.addText("College of Computing and Informatics", {
    x: 0.7, y: 4.30, w: 7, h: 0.35,
    fontFace: FONT_BODY, fontSize: 15, color: WHITE, transparency: 25, margin: 0,
  });
  s.addText("Universiti Tenaga Nasional  -  21 to 22 May 2026", {
    x: 0.7, y: 4.65, w: 7, h: 0.35,
    fontFace: FONT_BODY, fontSize: 13, color: WHITE, transparency: 40, margin: 0,
  });
});

// =====================================================================
// SLIDE 2: PROBLEM BACKGROUND
// =====================================================================
slides.push(() => {
  const s = pres.addSlide();
  s.background = { color: WHITE };
  addHeader(s, "Problem Background", "Why ICT program selection is hard for SPM leavers");

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.55, w: 3.4, h: 3.55,
    fill: { color: NAVY }, line: { color: NAVY }, shadow: makeShadow(),
  });
  s.addText("6", {
    x: 0.5, y: 1.65, w: 3.4, h: 1.6,
    fontFace: FONT_HEAD, fontSize: 130, bold: true, color: CINNABAR,
    align: "center", valign: "middle", margin: 0,
  });
  s.addText("ICT programs offered\nat UNITEN", {
    x: 0.5, y: 3.25, w: 3.4, h: 0.85,
    fontFace: FONT_BODY, fontSize: 18, color: WHITE,
    align: "center", valign: "top", margin: 0,
  });
  s.addText("Software Eng.  /  IT  /  Info Systems\nCybersecurity  /  AI  /  Data Science", {
    x: 0.5, y: 4.15, w: 3.4, h: 0.8,
    fontFace: FONT_BODY, fontSize: 11, italic: true, color: WHITE, transparency: 25,
    align: "center", valign: "top", margin: 0,
  });

  s.addText("Three forces make the choice hard:", {
    x: 4.3, y: 1.55, w: 5.3, h: 0.45,
    fontFace: FONT_HEAD, fontSize: 18, bold: true, color: TEXT_DARK, margin: 0,
  });

  const points = [
    { num: "1", title: "Choice overload",
      body: "Six similar-sounding degrees; brochures use the same buzzwords." },
    { num: "2", title: "No personalization",
      body: "UNITEN's website lists programs but offers no guided matching." },
    { num: "3", title: "Generic career tests miss the link",
      body: "MBTI / Holland Code do not map results to actual UNITEN programs." },
  ];
  let py = 2.10;
  for (const p of points) {
    s.addShape(pres.shapes.OVAL, {
      x: 4.3, y: py + 0.05, w: 0.42, h: 0.42,
      fill: { color: CINNABAR }, line: { color: CINNABAR },
    });
    s.addText(p.num, {
      x: 4.3, y: py + 0.05, w: 0.42, h: 0.42,
      fontFace: FONT_HEAD, fontSize: 16, bold: true, color: WHITE,
      align: "center", valign: "middle", margin: 0,
    });
    s.addText(p.title, {
      x: 4.85, y: py, w: 4.7, h: 0.35,
      fontFace: FONT_HEAD, fontSize: 17, bold: true, color: NAVY, margin: 0,
    });
    s.addText(p.body, {
      x: 4.85, y: py + 0.36, w: 4.7, h: 0.55,
      fontFace: FONT_BODY, fontSize: 14, color: TEXT_DARK, margin: 0,
    });
    py += 1.00;
  }
});

// =====================================================================
// SLIDE 3: PROJECT OBJECTIVE
// =====================================================================
slides.push(() => {
  const s = pres.addSlide();
  s.background = { color: WHITE };
  addHeader(s, "Project Objective", "Three SMART goals for MyUniPath");

  const objs = [
    {
      num: "01", title: "Build the assessment",
      body: "Design and implement an 8-question web-based quiz that captures interests, work style and cognitive preferences of SPM leavers.",
    },
    {
      num: "02", title: "Implement a rule-based engine",
      body: "Map answers to one of four UNITEN-specific tech personas and rank the top three programs using an editable rules table.",
    },
    {
      num: "03", title: "Empower counselors",
      body: "Deliver an admin panel (Analytics, User Management, Persona Rules CRUD) so non-technical staff can update rules and view trends.",
    },
  ];

  const cardW = 2.95, cardH = 3.35, gap = 0.18;
  let cx = 0.5;
  for (let i = 0; i < objs.length; i++) {
    const o = objs[i];
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: 1.55, w: cardW, h: cardH,
      fill: { color: CARD_BG }, line: { color: GRID_LIGHT, width: 1 },
      shadow: makeShadowSoft(),
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: 1.55, w: 0.08, h: cardH,
      fill: { color: CINNABAR }, line: { color: CINNABAR },
    });
    s.addText(o.num, {
      x: cx + 0.25, y: 1.80, w: 1.6, h: 1.0,
      fontFace: FONT_HEAD, fontSize: 72, bold: true, color: CINNABAR,
      align: "left", valign: "middle", margin: 0,
    });
    s.addText(o.title, {
      x: cx + 0.25, y: 2.75, w: cardW - 0.45, h: 0.5,
      fontFace: FONT_HEAD, fontSize: 19, bold: true, color: NAVY, margin: 0,
    });
    s.addText(o.body, {
      x: cx + 0.25, y: 3.30, w: cardW - 0.45, h: 1.65,
      fontFace: FONT_BODY, fontSize: 14, color: TEXT_DARK, margin: 0,
    });
    cx += cardW + gap;
  }
});

// =====================================================================
// SLIDE 4: PROBLEM STATEMENT
// =====================================================================
slides.push(() => {
  const s = pres.addSlide();
  s.background = { color: WHITE };
  addHeader(s, "Problem Statement", "The gap that MyUniPath fills");

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.55, w: 9, h: 1.85,
    fill: { color: NAVY }, line: { color: NAVY }, shadow: makeShadow(),
  });
  s.addText("“", {
    x: 0.7, y: 1.5, w: 0.8, h: 0.9,
    fontFace: "Georgia", fontSize: 90, color: CINNABAR, margin: 0, valign: "top",
  });
  s.addText([
    { text: "There is no UNITEN-specific tool that translates ", options: { color: WHITE } },
    { text: "an SPM leaver's interests and aptitudes", options: { color: CINNABAR, bold: true } },
    { text: " into a concrete recommendation among UNITEN's ICT programs.", options: { color: WHITE } },
  ], {
    x: 1.4, y: 1.65, w: 7.9, h: 1.65,
    fontFace: FONT_HEAD, fontSize: 19, italic: true, margin: 0, valign: "middle",
  });

  const csq = [
    { kpi: "Blind picks", body: "Students choose by name recognition or peer influence" },
    { kpi: "Year-2 switches", body: "Misfit students transfer, losing time and tuition" },
    { kpi: "Counselor bottleneck", body: "1-to-1 sessions can't scale to all SPM leavers" },
  ];
  const boxW = 2.95, boxH = 1.55, gap = 0.18;
  let bx = 0.5;
  for (const c of csq) {
    s.addShape(pres.shapes.RECTANGLE, {
      x: bx, y: 3.65, w: boxW, h: boxH,
      fill: { color: CREAM }, line: { color: MUDDY, width: 1 },
    });
    s.addText(c.kpi, {
      x: bx + 0.15, y: 3.75, w: boxW - 0.3, h: 0.5,
      fontFace: FONT_HEAD, fontSize: 18, bold: true, color: CINNABAR, margin: 0,
    });
    s.addText(c.body, {
      x: bx + 0.15, y: 4.25, w: boxW - 0.3, h: 0.9,
      fontFace: FONT_BODY, fontSize: 13, color: TEXT_DARK, margin: 0,
    });
    bx += boxW + gap;
  }
});

// =====================================================================
// SLIDE 5: PRESENTATION STRUCTURE
// =====================================================================
slides.push(() => {
  const s = pres.addSlide();
  s.background = { color: WHITE };
  addHeader(s, "Presentation Structure", "What we will cover in the next 17 minutes");

  const items = [
    { n: "1", t: "Tech Stack and Architecture" },
    { n: "2", t: "Context Diagram (DFD Level 0)" },
    { n: "3", t: "Registration and Login" },
    { n: "4", t: "8-Question Quiz Assessment" },
    { n: "5", t: "Recommendation Engine (DFD Level 2)" },
    { n: "6", t: "Tech Personas and Result Page" },
    { n: "7", t: "Programs - Browse, Details, Compare" },
    { n: "8", t: "Student Profile" },
    { n: "9", t: "Admin - Analytics, Users, Rules CRUD" },
    { n: "10", t: "Database Schema (ERD)" },
    { n: "11", t: "Scope, Limitations and Future Work" },
    { n: "Q&A", t: "Questions from the panel" },
  ];

  const colW = 4.4, rowH = 0.55, gapX = 0.2;
  items.forEach((it, i) => {
    const col = i < 6 ? 0 : 1;
    const row = i % 6;
    const x = 0.5 + col * (colW + gapX);
    const y = 1.55 + row * rowH;

    s.addShape(pres.shapes.OVAL, {
      x: x, y: y + 0.06, w: 0.40, h: 0.40,
      fill: { color: NAVY }, line: { color: NAVY },
    });
    s.addText(it.n, {
      x: x, y: y + 0.06, w: 0.40, h: 0.40,
      fontFace: FONT_HEAD, fontSize: 12, bold: true, color: WHITE,
      align: "center", valign: "middle", margin: 0,
    });
    s.addText(it.t, {
      x: x + 0.52, y: y + 0.04, w: colW - 0.6, h: 0.45,
      fontFace: FONT_BODY, fontSize: 15, color: TEXT_DARK, margin: 0, valign: "middle",
    });
  });
});

// =====================================================================
// SLIDE 6: TECH STACK AND ARCHITECTURE
// =====================================================================
slides.push(() => {
  const s = pres.addSlide();
  s.background = { color: WHITE };
  addHeader(s, "Tech Stack and Architecture", "Decoupled SPA over REST API over relational store");

  const boxes = [
    { label: "Browser",    sub: "Chrome / Edge",                              color: MUDDY },
    { label: "React 18",   sub: "Vite, TypeScript\nTailwind, shadcn/ui",      color: NAVY },
    { label: "Laravel 11", sub: "PHP 8.3, Eloquent",                          color: CINNABAR },
    { label: "MySQL 8",    sub: "6 tables, phpMyAdmin",                       color: NAVY },
  ];
  const bw = 1.85, bh = 1.3, by = 1.65;
  let bx = 0.65;
  for (let i = 0; i < boxes.length; i++) {
    const b = boxes[i];
    s.addShape(pres.shapes.RECTANGLE, {
      x: bx, y: by, w: bw, h: bh,
      fill: { color: b.color }, line: { color: b.color }, shadow: makeShadow(),
    });
    s.addText(b.label, {
      x: bx, y: by + 0.20, w: bw, h: 0.5,
      fontFace: FONT_HEAD, fontSize: 19, bold: true, color: WHITE,
      align: "center", valign: "middle", margin: 0,
    });
    s.addText(b.sub, {
      x: bx + 0.05, y: by + 0.70, w: bw - 0.1, h: 0.55,
      fontFace: FONT_BODY, fontSize: 11, color: WHITE, transparency: 15,
      align: "center", valign: "top", margin: 0,
    });
    if (i < boxes.length - 1) {
      s.addShape(pres.shapes.LINE, {
        x: bx + bw + 0.04, y: by + bh / 2, w: 0.22, h: 0,
        line: { color: TEXT_MUTED, width: 2.5, endArrowType: "triangle" },
      });
    }
    bx += bw + 0.30;
  }

  s.addText("HTTP / JSON     -     stateless API     -     X-Session-Id auth", {
    x: 0.5, y: 3.10, w: 9, h: 0.4,
    fontFace: FONT_BODY, fontSize: 13, italic: true, color: TEXT_MUTED,
    align: "center", margin: 0,
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 3.65, w: 4.4, h: 1.45,
    fill: { color: CARD_BG }, line: { color: GRID_LIGHT, width: 1 },
  });
  s.addText("Frontend stack", {
    x: 0.7, y: 3.72, w: 4.0, h: 0.35,
    fontFace: FONT_HEAD, fontSize: 14, bold: true, color: NAVY, margin: 0,
  });
  s.addText([
    { text: "React 18 + TypeScript", options: { bullet: { code: "25CF" }, breakLine: true } },
    { text: "Tailwind v4 + shadcn/ui + Radix", options: { bullet: { code: "25CF" }, breakLine: true } },
    { text: "Framer Motion, Recharts", options: { bullet: { code: "25CF" }, breakLine: true } },
    { text: "React Router v6, Context API", options: { bullet: { code: "25CF" } } },
  ], {
    x: 0.75, y: 4.05, w: 4.1, h: 1.0,
    fontFace: FONT_BODY, fontSize: 12, color: TEXT_DARK,
    paraSpaceAfter: 4, margin: 0,
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.10, y: 3.65, w: 4.4, h: 1.45,
    fill: { color: CARD_BG }, line: { color: GRID_LIGHT, width: 1 },
  });
  s.addText("Backend stack", {
    x: 5.30, y: 3.72, w: 4.0, h: 0.35,
    fontFace: FONT_HEAD, fontSize: 14, bold: true, color: CINNABAR, margin: 0,
  });
  s.addText([
    { text: "Laravel 11 + PHP 8.3 + Eloquent ORM", options: { bullet: { code: "25CF" }, breakLine: true } },
    { text: "MySQL 8 (managed via phpMyAdmin)", options: { bullet: { code: "25CF" }, breakLine: true } },
    { text: "Bcrypt password hashing", options: { bullet: { code: "25CF" }, breakLine: true } },
    { text: "Custom admin guard (X-Admin-Password)", options: { bullet: { code: "25CF" } } },
  ], {
    x: 5.35, y: 4.05, w: 4.1, h: 1.0,
    fontFace: FONT_BODY, fontSize: 12, color: TEXT_DARK,
    paraSpaceAfter: 4, margin: 0,
  });
});

// =====================================================================
// SLIDE 7: CONTEXT DIAGRAM (DFD Level 0)
// =====================================================================
slides.push(() => {
  const s = pres.addSlide();
  s.background = { color: WHITE };
  addHeader(s, "Context Diagram", "External actors that exchange data with MyUniPath");

  // 4 entities across the top, system bar in the middle, arrows flow downward.
  const entW = 2.05, entH = 0.75, entY = 1.55, entGap = 0.18;
  const entities = [
    { label: "STUDENT",         x: 0.5,                       color: CINNABAR },
    { label: "ADMIN",           x: 0.5 + entW + entGap,       color: NAVY     },
    { label: "GUEST (Browser)", x: 0.5 + 2 * (entW + entGap), color: CINNABAR },
    { label: "UNITEN WEBSITE",  x: 0.5 + 3 * (entW + entGap), color: MUDDY    },
  ];
  for (const e of entities) {
    s.addShape(pres.shapes.RECTANGLE, {
      x: e.x, y: entY, w: entW, h: entH,
      fill: { color: e.color }, line: { color: e.color, width: 2 }, shadow: makeShadowSoft(),
    });
    s.addText(e.label, {
      x: e.x, y: entY, w: entW, h: entH,
      fontFace: FONT_HEAD, fontSize: 14, bold: true, color: WHITE,
      align: "center", valign: "middle", margin: 0,
    });
  }

  const sysY = 4.10, sysH = 0.95;
  s.addShape(pres.shapes.OVAL, {
    x: 0.5, y: sysY, w: 9.0, h: sysH,
    fill: { color: NAVY }, line: { color: NAVY, width: 2 }, shadow: makeShadow(),
  });
  s.addText("0", {
    x: 0.5, y: sysY, w: 1.2, h: sysH,
    fontFace: FONT_HEAD, fontSize: 32, bold: true, color: CINNABAR,
    align: "center", valign: "middle", margin: 0,
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 1.45, y: sysY + 0.18, w: 0.02, h: 0.60,
    fill: { color: CINNABAR }, line: { color: CINNABAR },
  });
  s.addText("MyUniPath System", {
    x: 1.6, y: sysY, w: 7.8, h: sysH,
    fontFace: FONT_HEAD, fontSize: 22, bold: true, color: WHITE,
    align: "left", valign: "middle", margin: 0,
  });

  const lanes = [
    { inText: "Quiz answers, login, profile",       outText: "Persona, recommendations",   dashed: false },
    { inText: "Login, edit users, rule changes",    outText: "Analytics, user list, rules",dashed: false },
    { inText: "Browse programs, about page",        outText: "Public pages, program data", dashed: false },
    { inText: "",                                    outText: "Program URLs (new tab)",    dashed: true  },
  ];

  for (let i = 0; i < entities.length; i++) {
    const e = entities[i];
    const lane = lanes[i];
    // Push arrows to outer edges so labels fit in the middle without overlap
    const inX  = e.x + 0.15;
    const outX = e.x + entW - 0.15;

    if (!lane.dashed) {
      // Input arrow upper segment (entity -> above label)
      s.addShape(pres.shapes.LINE, {
        x: inX, y: 2.32, w: 0, h: 0.60,
        line: { color: NAVY, width: 2.25 },
      });
      // Input arrow lower segment (below label -> system)
      s.addShape(pres.shapes.LINE, {
        x: inX, y: 3.62, w: 0, h: 0.50,
        line: { color: NAVY, width: 2.25, endArrowType: "triangle" },
      });
    }

    // Output arrow upper segment (entity end, with arrow head at entity)
    s.addShape(pres.shapes.LINE, {
      x: outX, y: 2.32, w: 0, h: 0.60,
      line: lane.dashed
        ? { color: MUDDY, width: 2.25, dashType: "dash", beginArrowType: "triangle" }
        : { color: CINNABAR, width: 2.25, beginArrowType: "triangle" },
    });
    // Output arrow lower segment (below label -> system)
    s.addShape(pres.shapes.LINE, {
      x: outX, y: 3.62, w: 0, h: 0.50,
      line: lane.dashed
        ? { color: MUDDY, width: 2.25, dashType: "dash" }
        : { color: CINNABAR, width: 2.25 },
    });

    // Center labels between the two arrows
    const labelX = e.x + 0.30;
    const labelW = entW - 0.60;
    if (lane.inText) {
      s.addText(lane.inText, {
        x: labelX, y: 2.95, w: labelW, h: 0.32,
        fontFace: FONT_BODY, fontSize: 9, italic: true, color: NAVY,
        align: "center", valign: "middle", margin: 0,
      });
    }
    if (lane.outText) {
      s.addText(lane.outText, {
        x: labelX, y: 3.27, w: labelW, h: 0.32,
        fontFace: FONT_BODY, fontSize: 9, italic: true,
        color: lane.dashed ? MUDDY : CINNABAR,
        align: "center", valign: "middle", margin: 0,
      });
    }
  }

  // Legend below
  s.addShape(pres.shapes.LINE, {
    x: 1.6, y: 5.30, w: 0.30, h: 0,
    line: { color: NAVY, width: 2.25, endArrowType: "triangle" },
  });
  s.addText("Inputs to system", {
    x: 1.95, y: 5.20, w: 1.7, h: 0.22,
    fontFace: FONT_BODY, fontSize: 10, color: TEXT_MUTED, margin: 0,
  });
  s.addShape(pres.shapes.LINE, {
    x: 4.0, y: 5.30, w: 0.30, h: 0,
    line: { color: CINNABAR, width: 2.25, endArrowType: "triangle" },
  });
  s.addText("Outputs from system", {
    x: 4.35, y: 5.20, w: 1.8, h: 0.22,
    fontFace: FONT_BODY, fontSize: 10, color: TEXT_MUTED, margin: 0,
  });
  s.addShape(pres.shapes.LINE, {
    x: 6.5, y: 5.30, w: 0.30, h: 0,
    line: { color: MUDDY, width: 2.25, dashType: "dash" },
  });
  s.addText("External link", {
    x: 6.85, y: 5.20, w: 1.5, h: 0.22,
    fontFace: FONT_BODY, fontSize: 10, color: TEXT_MUTED, margin: 0,
  });
});

// =====================================================================
// SLIDE 8: REGISTRATION AND LOGIN
// =====================================================================
slides.push(() => {
  const s = pres.addSlide();
  s.background = { color: WHITE };
  addHeader(s, "Registration and Login", "Process 1.0  -  Authenticate User");

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.55, w: 4.0, h: 3.55,
    fill: { color: CARD_BG }, line: { color: GRID_LIGHT, width: 1 }, shadow: makeShadowSoft(),
  });
  s.addText("Registration Form", {
    x: 0.65, y: 1.70, w: 3.7, h: 0.35,
    fontFace: FONT_HEAD, fontSize: 14, bold: true, color: NAVY, margin: 0,
  });

  const fields = ["Full name", "Email address", "Password", "Age", "Highest qualification", "Upload SPM transcript (PDF)"];
  let fy = 2.15;
  for (const f of fields) {
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.65, y: fy, w: 3.7, h: 0.32,
      fill: { color: WHITE }, line: { color: GRID_LIGHT, width: 1 },
    });
    s.addText(f, {
      x: 0.80, y: fy, w: 3.5, h: 0.32,
      fontFace: FONT_BODY, fontSize: 11, color: TEXT_MUTED, valign: "middle", margin: 0,
    });
    fy += 0.40;
  }

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.65, y: fy + 0.05, w: 3.7, h: 0.45,
    fill: { color: CINNABAR }, line: { color: CINNABAR },
  });
  s.addText("Create Account", {
    x: 0.65, y: fy + 0.05, w: 3.7, h: 0.45,
    fontFace: FONT_HEAD, fontSize: 13, bold: true, color: WHITE,
    align: "center", valign: "middle", margin: 0,
  });

  s.addText("Key features", {
    x: 4.8, y: 1.55, w: 4.7, h: 0.4,
    fontFace: FONT_HEAD, fontSize: 18, bold: true, color: NAVY, margin: 0,
  });

  const feats = [
    { h: "Bcrypt password hashing", b: "Hash::make() on register; Hash::check() on login. Never plaintext." },
    { h: "Session-id authentication", b: "UUID stored client-side, sent via X-Session-Id header - stateless API." },
    { h: "PDF transcript upload", b: "Stored under storage/app/public/transcripts/ with hashed filenames." },
    { h: "Smart redirect", b: "If user clicked 'Start Assessment', login auto-redirects to /quiz." },
  ];
  let fyr = 2.05;
  for (const f of feats) {
    s.addShape(pres.shapes.OVAL, {
      x: 4.8, y: fyr + 0.05, w: 0.28, h: 0.28,
      fill: { color: NAVY }, line: { color: NAVY },
    });
    s.addText("✓", {
      x: 4.8, y: fyr + 0.05, w: 0.28, h: 0.28,
      fontFace: FONT_HEAD, fontSize: 12, bold: true, color: WHITE,
      align: "center", valign: "middle", margin: 0,
    });
    s.addText(f.h, {
      x: 5.18, y: fyr, w: 4.3, h: 0.32,
      fontFace: FONT_HEAD, fontSize: 14, bold: true, color: TEXT_DARK, margin: 0,
    });
    s.addText(f.b, {
      x: 5.18, y: fyr + 0.34, w: 4.3, h: 0.40,
      fontFace: FONT_BODY, fontSize: 12, color: TEXT_MUTED, margin: 0,
    });
    fyr += 0.78;
  }
});

// =====================================================================
// SLIDE 9: QUIZ ASSESSMENT
// =====================================================================
slides.push(() => {
  const s = pres.addSlide();
  s.background = { color: WHITE };
  addHeader(s, "8-Question Quiz Assessment", "Process 2.0  -  Capture two parallel signals");

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.55, w: 4.0, h: 3.55,
    fill: { color: CARD_BG }, line: { color: GRID_LIGHT, width: 1 }, shadow: makeShadowSoft(),
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.65, y: 1.70, w: 3.7, h: 0.10,
    fill: { color: GRID_LIGHT }, line: { color: GRID_LIGHT },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.65, y: 1.70, w: 1.85, h: 0.10,
    fill: { color: CINNABAR }, line: { color: CINNABAR },
  });
  s.addText("Question 4 of 8", {
    x: 0.65, y: 1.85, w: 3.7, h: 0.30,
    fontFace: FONT_BODY, fontSize: 10, color: TEXT_MUTED, margin: 0,
  });
  s.addText("What excites you most about technology?", {
    x: 0.65, y: 2.15, w: 3.7, h: 0.7,
    fontFace: FONT_HEAD, fontSize: 14, bold: true, color: TEXT_DARK, margin: 0,
  });

  const opts = [
    "Building apps and websites",
    "Investigating security threats",
    "Finding patterns in data",
    "Designing automated systems",
  ];
  let oy = 2.95;
  for (let i = 0; i < opts.length; i++) {
    const selected = i === 0;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.65, y: oy, w: 3.7, h: 0.42,
      fill: { color: selected ? "FCE7DF" : WHITE },
      line: { color: selected ? CINNABAR : GRID_LIGHT, width: selected ? 2 : 1 },
    });
    s.addText(opts[i], {
      x: 0.80, y: oy, w: 3.4, h: 0.42,
      fontFace: FONT_BODY, fontSize: 11, color: selected ? TEXT_DARK : TEXT_MUTED,
      bold: selected, valign: "middle", margin: 0,
    });
    oy += 0.48;
  }

  s.addImage({ data: loadImg(ASSET("robot-thinking.png")), x: 3.30, y: 4.55, w: 0.85, h: 0.85 });

  s.addText("Each answer feeds two signals:", {
    x: 4.85, y: 1.55, w: 4.65, h: 0.4,
    fontFace: FONT_HEAD, fontSize: 17, bold: true, color: TEXT_DARK, margin: 0,
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 4.85, y: 2.05, w: 4.65, h: 1.20,
    fill: { color: NAVY }, line: { color: NAVY },
  });
  s.addText("LOGIC", {
    x: 5.0, y: 2.10, w: 1.2, h: 0.4,
    fontFace: FONT_HEAD, fontSize: 13, bold: true, color: CINNABAR, charSpacing: 4, margin: 0,
  });
  s.addText("Score 0 to 4 per answer  ->  capped at 32", {
    x: 5.0, y: 2.50, w: 4.4, h: 0.35,
    fontFace: FONT_BODY, fontSize: 13, color: WHITE, margin: 0,
  });
  s.addText("Drives: Solver, Guardian, Analyst personas", {
    x: 5.0, y: 2.85, w: 4.4, h: 0.30,
    fontFace: FONT_BODY, fontSize: 11, italic: true, color: WHITE, transparency: 25, margin: 0,
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 4.85, y: 3.35, w: 4.65, h: 1.20,
    fill: { color: CINNABAR }, line: { color: CINNABAR },
  });
  s.addText("CREATIVE", {
    x: 5.0, y: 3.40, w: 1.5, h: 0.4,
    fontFace: FONT_HEAD, fontSize: 13, bold: true, color: NAVY, charSpacing: 4, margin: 0,
  });
  s.addText("Score 0 to 4 per answer  ->  capped at 32", {
    x: 5.0, y: 3.80, w: 4.4, h: 0.35,
    fontFace: FONT_BODY, fontSize: 13, color: WHITE, margin: 0,
  });
  s.addText("Drives: Creator persona", {
    x: 5.0, y: 4.15, w: 4.4, h: 0.30,
    fontFace: FONT_BODY, fontSize: 11, italic: true, color: WHITE, transparency: 25, margin: 0,
  });

  s.addText("Plus a persona tag on each option, fed into the rule-based engine.", {
    x: 4.85, y: 4.65, w: 4.65, h: 0.4,
    fontFace: FONT_BODY, fontSize: 12, italic: true, color: TEXT_MUTED, margin: 0,
  });
});

// =====================================================================
// SLIDE 10: RECOMMENDATION ENGINE (DFD Level 2)
// =====================================================================
slides.push(() => {
  const s = pres.addSlide();
  s.background = { color: WHITE };
  addHeader(s, "Recommendation Engine", "Process 3.0 - DFD Level 2 decomposition");

  const steps = [
    { n: "3.1", t: "Lookup\nRule Points",        c: NAVY },
    { n: "3.2", t: "Tally Score\nper Persona",   c: NAVY },
    { n: "3.3", t: "Pick Top\nPersona",          c: CINNABAR },
    { n: "3.4", t: "Map Persona\nto Programs",   c: CINNABAR },
    { n: "3.5", t: "Persist\nCompletion",        c: NAVY },
    { n: "3.6", t: "Build Result\nResponse",     c: CINNABAR },
  ];
  const sw = 1.40, sh = 1.15, sy = 1.85, gap = 0.13;
  let sx = 0.5;
  for (let i = 0; i < steps.length; i++) {
    const st = steps[i];
    s.addShape(pres.shapes.RECTANGLE, {
      x: sx, y: sy, w: sw, h: sh,
      fill: { color: st.c }, line: { color: st.c }, shadow: makeShadow(),
    });
    s.addText(st.n, {
      x: sx, y: sy + 0.12, w: sw, h: 0.30,
      fontFace: FONT_HEAD, fontSize: 11, bold: true, color: WHITE, transparency: 25,
      align: "center", valign: "middle", margin: 0,
    });
    s.addText(st.t, {
      x: sx, y: sy + 0.42, w: sw, h: 0.65,
      fontFace: FONT_HEAD, fontSize: 13, bold: true, color: WHITE,
      align: "center", valign: "middle", margin: 0,
    });
    if (i < steps.length - 1) {
      s.addShape(pres.shapes.LINE, {
        x: sx + sw + 0.01, y: sy + sh / 2, w: 0.11, h: 0,
        line: { color: TEXT_MUTED, width: 2.5, endArrowType: "triangle" },
      });
    }
    sx += sw + gap;
  }

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 3.30, w: 9, h: 0.05,
    fill: { color: GRID_LIGHT }, line: { color: GRID_LIGHT },
  });

  s.addText("Data stores touched", {
    x: 0.5, y: 3.45, w: 9, h: 0.35,
    fontFace: FONT_HEAD, fontSize: 14, bold: true, color: TEXT_DARK, margin: 0,
  });

  const stores = [
    { n: "D4", t: "persona_rules",    s: "33 rows: answer_text to persona to points" },
    { n: "D5", t: "programs",         s: "6 rows: slug, name, careers, fees" },
    { n: "D3", t: "quiz_completions", s: "Append-only audit: JSON answers + scores" },
    { n: "D1", t: "students",         s: "Persona + quiz_completed flag updated" },
  ];
  const dw = 2.2, dh = 1.20, dgap = 0.13;
  let dx = 0.5;
  for (const d of stores) {
    s.addShape(pres.shapes.RECTANGLE, {
      x: dx, y: 3.85, w: dw, h: dh,
      fill: { color: CREAM }, line: { color: MUDDY, width: 1 },
    });
    s.addText(d.n, {
      x: dx + 0.1, y: 3.92, w: 0.5, h: 0.30,
      fontFace: FONT_HEAD, fontSize: 11, bold: true, color: CINNABAR, margin: 0,
    });
    s.addText(d.t, {
      x: dx + 0.1, y: 4.18, w: dw - 0.2, h: 0.35,
      fontFace: FONT_HEAD, fontSize: 14, bold: true, color: NAVY, margin: 0,
    });
    s.addText(d.s, {
      x: dx + 0.1, y: 4.50, w: dw - 0.2, h: 0.50,
      fontFace: FONT_BODY, fontSize: 10, color: TEXT_DARK, margin: 0,
    });
    dx += dw + dgap;
  }
});

// =====================================================================
// SLIDE 11: 4 TECH PERSONAS AND RESULT
// =====================================================================
slides.push(() => {
  const s = pres.addSlide();
  s.background = { color: WHITE };
  addHeader(s, "Tech Personas and Result Page", "Engine output to personalized career match");

  const personas = [
    { name: "The Creator",  sub: "(Software Eng. + UI/UX)",        img: "mascot-creator.png",  color: CINNABAR },
    { name: "The Solver",   sub: "(Backend + AI Systems)",         img: "mascot-solver.png",   color: NAVY },
    { name: "The Guardian", sub: "(Cybersecurity)",                img: "mascot-guardian.png", color: MUDDY },
    { name: "The Analyst",  sub: "(Data Science + Info Systems)",  img: "mascot-analyst.png",  color: NAVY },
  ];

  const pw = 2.15, ph = 2.55, pgap = 0.18, py = 1.55;
  let px = 0.5;
  for (const p of personas) {
    s.addShape(pres.shapes.RECTANGLE, {
      x: px, y: py, w: pw, h: ph,
      fill: { color: CARD_BG }, line: { color: GRID_LIGHT, width: 1 }, shadow: makeShadowSoft(),
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: px, y: py, w: pw, h: 0.10,
      fill: { color: p.color }, line: { color: p.color },
    });
    s.addImage({ data: loadImg(ASSET(p.img)), x: px + (pw - 1.1) / 2, y: py + 0.30, w: 1.1, h: 1.1 });
    s.addText(p.name, {
      x: px + 0.1, y: py + 1.50, w: pw - 0.2, h: 0.40,
      fontFace: FONT_HEAD, fontSize: 16, bold: true, color: NAVY,
      align: "center", valign: "middle", margin: 0,
    });
    s.addText(p.sub, {
      x: px + 0.1, y: py + 1.90, w: pw - 0.2, h: 0.55,
      fontFace: FONT_BODY, fontSize: 11, italic: true, color: TEXT_MUTED,
      align: "center", valign: "top", margin: 0,
    });
    px += pw + pgap;
  }

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 4.30, w: 9, h: 0.85,
    fill: { color: NAVY }, line: { color: NAVY },
  });
  s.addText("Result page delivers:", {
    x: 0.7, y: 4.42, w: 2.6, h: 0.65,
    fontFace: FONT_HEAD, fontSize: 13, bold: true, color: CINNABAR, valign: "middle", margin: 0,
  });
  s.addText("Radar chart score breakdown   |   Persona reveal with traits   |   Top 3 ranked ICT programs", {
    x: 3.20, y: 4.42, w: 6.2, h: 0.65,
    fontFace: FONT_BODY, fontSize: 13, color: WHITE, valign: "middle", margin: 0,
  });
});

// =====================================================================
// SLIDE 12: PROGRAMS (Browse / Detail / Compare)
// =====================================================================
slides.push(() => {
  const s = pres.addSlide();
  s.background = { color: WHITE };
  addHeader(s, "Programs: Browse, Detail, Compare", "Three lenses on the same six UNITEN ICT programs");

  const lenses = [
    {
      title: "Browse all",
      sub: "/programs",
      lines: [
        "Card grid with icon, name, short description",
        "Search and filter by area of interest",
        "One-click 'View Details' on each card",
      ],
      color: NAVY,
    },
    {
      title: "Program details",
      sub: "/program/:slug",
      lines: [
        "Duration, fees (RM), intake months, campus",
        "SPM entry requirements (credits, subjects)",
        "Career outcomes + external UNITEN link",
      ],
      color: CINNABAR,
    },
    {
      title: "Side-by-side compare",
      sub: "/compare",
      lines: [
        "Pick any 2-3 programs from a dropdown",
        "Comparison table: fees, intake, careers",
        "Helps indecisive students decide",
      ],
      color: MUDDY,
    },
  ];

  const lw = 2.95, lh = 3.55, lgap = 0.18, ly = 1.55;
  let lx = 0.5;
  for (const ln of lenses) {
    s.addShape(pres.shapes.RECTANGLE, {
      x: lx, y: ly, w: lw, h: lh,
      fill: { color: WHITE }, line: { color: ln.color, width: 2 }, shadow: makeShadowSoft(),
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: lx, y: ly, w: lw, h: 0.95,
      fill: { color: ln.color }, line: { color: ln.color },
    });
    s.addText(ln.title, {
      x: lx + 0.20, y: ly + 0.15, w: lw - 0.4, h: 0.40,
      fontFace: FONT_HEAD, fontSize: 18, bold: true, color: WHITE, margin: 0,
    });
    s.addText(ln.sub, {
      x: lx + 0.20, y: ly + 0.55, w: lw - 0.4, h: 0.30,
      fontFace: "Consolas", fontSize: 11, color: WHITE, transparency: 25, margin: 0,
    });
    s.addText(
      ln.lines.map((t, i) => ({
        text: t,
        options: { bullet: { code: "25CF" }, breakLine: i !== ln.lines.length - 1 },
      })),
      {
        x: lx + 0.20, y: ly + 1.10, w: lw - 0.4, h: lh - 1.25,
        fontFace: FONT_BODY, fontSize: 12.5, color: TEXT_DARK,
        paraSpaceAfter: 8, margin: 0,
      }
    );
    lx += lw + lgap;
  }
});

// =====================================================================
// SLIDE 13: STUDENT PROFILE
// =====================================================================
slides.push(() => {
  const s = pres.addSlide();
  s.background = { color: WHITE };
  addHeader(s, "Student Profile", "Process 4.0 - Manage Profile");

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.55, w: 4.0, h: 3.55,
    fill: { color: CARD_BG }, line: { color: GRID_LIGHT, width: 1 }, shadow: makeShadowSoft(),
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.55, w: 4.0, h: 0.95,
    fill: { color: CINNABAR }, line: { color: CINNABAR },
  });
  s.addImage({ data: loadImg(ASSET("mascot-creator.png")), x: 0.65, y: 1.65, w: 0.75, h: 0.75 });
  s.addText("Demo Student", {
    x: 1.50, y: 1.65, w: 2.9, h: 0.35,
    fontFace: FONT_HEAD, fontSize: 15, bold: true, color: WHITE, margin: 0,
  });
  s.addText("Persona: The Creator", {
    x: 1.50, y: 2.00, w: 2.9, h: 0.30,
    fontFace: FONT_BODY, fontSize: 11, color: WHITE, transparency: 15, italic: true, margin: 0,
  });

  const profLines = [
    ["Email",          "demo@uniten.edu.my"],
    ["Age",            "19"],
    ["Qualification",  "SPM"],
    ["Quiz completed", "Yes - Creator (16 logic, 24 creative)"],
    ["Transcript",     "transcripts/AbC123.pdf"],
  ];
  let pfy = 2.70;
  for (const [k, v] of profLines) {
    s.addText(k, {
      x: 0.65, y: pfy, w: 1.30, h: 0.32,
      fontFace: FONT_BODY, fontSize: 11, color: TEXT_MUTED, valign: "middle", margin: 0,
    });
    s.addText(v, {
      x: 1.95, y: pfy, w: 2.45, h: 0.32,
      fontFace: FONT_HEAD, fontSize: 11, bold: true, color: TEXT_DARK, valign: "middle", margin: 0,
    });
    pfy += 0.42;
  }

  s.addText("What the student can do", {
    x: 4.85, y: 1.55, w: 4.65, h: 0.4,
    fontFace: FONT_HEAD, fontSize: 17, bold: true, color: NAVY, margin: 0,
  });

  const caps = [
    { h: "Edit profile",     b: "Reuses the StudentInfoForm component - single source of validation truth." },
    { h: "Retake the quiz",  b: "Each completion saved to quiz_completions with timestamp." },
    { h: "View past results",b: "Persona, score breakdown and recommended programs persisted in students table." },
    { h: "Replace transcript", b: "Re-upload SPM PDF if the original was corrupted or outdated." },
    { h: "Logout",           b: "Clears the X-Session-Id from localStorage and returns to Welcome page." },
  ];
  let cy = 2.05;
  for (const c of caps) {
    s.addShape(pres.shapes.OVAL, {
      x: 4.85, y: cy + 0.03, w: 0.24, h: 0.24,
      fill: { color: CINNABAR }, line: { color: CINNABAR },
    });
    s.addText(c.h, {
      x: 5.18, y: cy - 0.02, w: 4.3, h: 0.30,
      fontFace: FONT_HEAD, fontSize: 13, bold: true, color: TEXT_DARK, margin: 0,
    });
    s.addText(c.b, {
      x: 5.18, y: cy + 0.27, w: 4.3, h: 0.35,
      fontFace: FONT_BODY, fontSize: 11, color: TEXT_MUTED, margin: 0,
    });
    cy += 0.62;
  }
});

// =====================================================================
// SLIDE 14: ADMIN DASHBOARD
// =====================================================================
slides.push(() => {
  const s = pres.addSlide();
  s.background = { color: WHITE };
  addHeader(s, "Admin Dashboard", "Process 5.0 - Three tabs guarded by X-Admin-Password");

  const tabs = [
    {
      title: "Analytics",
      tag: "01",
      lines: [
        "Total participants metric",
        "Bar chart - program views",
        "Pie chart - persona distribution",
      ],
      color: NAVY,
    },
    {
      title: "User Management",
      tag: "02",
      lines: [
        "List of all registered students",
        "Edit or delete a student record",
        "PATCH / DELETE /api/admin/students/{id}",
      ],
      color: CINNABAR,
    },
    {
      title: "Persona Rules CRUD",
      tag: "03",
      lines: [
        "Add / edit / disable personas",
        "Map programs, adjust trait list",
        "Set logic / creative weight per persona",
      ],
      color: MUDDY,
    },
  ];

  const tw = 2.95, th = 3.55, tgap = 0.18, ty = 1.55;
  let tx = 0.5;
  for (const t of tabs) {
    s.addShape(pres.shapes.RECTANGLE, {
      x: tx, y: ty, w: tw, h: th,
      fill: { color: WHITE }, line: { color: t.color, width: 2 }, shadow: makeShadowSoft(),
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: tx, y: ty, w: tw, h: 1.1,
      fill: { color: t.color }, line: { color: t.color },
    });
    s.addText(t.tag, {
      x: tx, y: ty + 0.10, w: tw, h: 0.90,
      fontFace: FONT_HEAD, fontSize: 56, bold: true, color: WHITE,
      align: "center", valign: "middle", margin: 0,
    });
    s.addText(t.title, {
      x: tx + 0.20, y: ty + 1.25, w: tw - 0.4, h: 0.5,
      fontFace: FONT_HEAD, fontSize: 19, bold: true, color: NAVY, margin: 0,
    });
    s.addText(
      t.lines.map((line, i) => ({
        text: line,
        options: { bullet: { code: "25CF" }, breakLine: i !== t.lines.length - 1 },
      })),
      {
        x: tx + 0.20, y: ty + 1.85, w: tw - 0.4, h: th - 2.0,
        fontFace: FONT_BODY, fontSize: 13, color: TEXT_DARK,
        paraSpaceAfter: 8, margin: 0,
      }
    );
    tx += tw + tgap;
  }
});

// =====================================================================
// SLIDE 15: DATABASE SCHEMA
// =====================================================================
slides.push(() => {
  const s = pres.addSlide();
  s.background = { color: WHITE };
  addHeader(s, "Database Schema", "Six MySQL tables - logical relationships");

  const tables = [
    { name: "students",         fields: ["id (PK)", "session_id", "name", "email", "password (hashed)", "persona", "transcript_path"], color: NAVY },
    { name: "quiz_questions",   fields: ["id (PK)", "question", "options (JSON)", "order"], color: NAVY },
    { name: "quiz_completions", fields: ["id (PK)", "session_id", "persona", "logic_score", "creative_score", "answers (JSON)", "recommended_program_ids (JSON)"], color: CINNABAR },
    { name: "persona_rules",    fields: ["id (PK)", "answer_text", "persona", "points"], color: CINNABAR },
    { name: "programs",         fields: ["id (PK)", "slug (unique)", "name", "duration", "fees", "requirements (JSON)", "careers (JSON)"], color: MUDDY },
    { name: "admin_settings",   fields: ["id (PK)", "key (unique)", "value"], color: MUDDY },
  ];
  const tw = 2.9, th = 1.65, tgapX = 0.18, tgapY = 0.20;
  for (let i = 0; i < tables.length; i++) {
    const col = i % 3, row = Math.floor(i / 3);
    const x = 0.5 + col * (tw + tgapX);
    const y = 1.55 + row * (th + tgapY);
    const t = tables[i];

    s.addShape(pres.shapes.RECTANGLE, {
      x: x, y: y, w: tw, h: th,
      fill: { color: CARD_BG }, line: { color: GRID_LIGHT, width: 1 }, shadow: makeShadowSoft(),
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: x, y: y, w: tw, h: 0.38,
      fill: { color: t.color }, line: { color: t.color },
    });
    s.addText(t.name, {
      x: x, y: y, w: tw, h: 0.38,
      fontFace: "Consolas", fontSize: 13, bold: true, color: WHITE,
      align: "center", valign: "middle", margin: 0,
    });
    s.addText(
      t.fields.map((f, idx) => ({
        text: f,
        options: { breakLine: idx !== t.fields.length - 1 },
      })),
      {
        x: x + 0.10, y: y + 0.42, w: tw - 0.2, h: th - 0.5,
        fontFace: "Consolas", fontSize: 9.5, color: TEXT_DARK, margin: 0,
      }
    );
  }

  s.addText(
    "Note: relationships are logical (no hard FK), coupled via session_id and slug for append-only history.",
    {
      x: 0.5, y: 5.00, w: 9, h: 0.25,
      fontFace: FONT_BODY, fontSize: 11, italic: true, color: TEXT_MUTED, margin: 0,
    }
  );
});

// =====================================================================
// SLIDE 16: SCOPE, LIMITATIONS AND FUTURE WORK
// =====================================================================
slides.push(() => {
  const s = pres.addSlide();
  s.background = { color: WHITE };
  addHeader(s, "Scope, Limitations and Future Work", "Honest delivery against the original objectives");

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.55, w: 4.4, h: 3.55,
    fill: { color: CARD_BG }, line: { color: GRID_LIGHT, width: 1 }, shadow: makeShadowSoft(),
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.55, w: 4.4, h: 0.55,
    fill: { color: NAVY }, line: { color: NAVY },
  });
  s.addText("Scope and Limitations", {
    x: 0.65, y: 1.55, w: 4.1, h: 0.55,
    fontFace: FONT_HEAD, fontSize: 17, bold: true, color: WHITE, valign: "middle", margin: 0,
  });
  const lims = [
    "Covers 6 UNITEN ICT programs only - not engineering or business",
    "8-question instrument - longer would discriminate better but hurt completion",
    "Recommendations do not yet factor in SPM grades (transcript is supporting evidence only)",
    "Single-admin authentication (shared X-Admin-Password header)",
    "Rule weights are heuristic, not learned from outcome data",
  ];
  s.addText(
    lims.map((t, i) => ({
      text: t,
      options: { bullet: { code: "25CF" }, breakLine: i !== lims.length - 1 },
    })),
    {
      x: 0.65, y: 2.20, w: 4.1, h: 2.80,
      fontFace: FONT_BODY, fontSize: 13.5, color: TEXT_DARK,
      paraSpaceAfter: 10, margin: 0,
    }
  );

  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.10, y: 1.55, w: 4.4, h: 3.55,
    fill: { color: CARD_BG }, line: { color: GRID_LIGHT, width: 1 }, shadow: makeShadowSoft(),
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.10, y: 1.55, w: 4.4, h: 0.55,
    fill: { color: CINNABAR }, line: { color: CINNABAR },
  });
  s.addText("Future Work", {
    x: 5.25, y: 1.55, w: 4.1, h: 0.55,
    fontFace: FONT_HEAD, fontSize: 17, bold: true, color: WHITE, valign: "middle", margin: 0,
  });
  const future = [
    "OCR on SPM transcript to extract and factor grades into eligibility",
    "Outcome tracking - follow-up survey for enrolled students",
    "Migrate to ML once 500+ completions accumulate (logistic regression baseline)",
    "Multi-language support (Bahasa Melayu, Mandarin) for accessibility",
    "Replace X-Admin-Password with Laravel Sanctum for multi-admin",
  ];
  s.addText(
    future.map((t, i) => ({
      text: t,
      options: { bullet: { code: "25CF" }, breakLine: i !== future.length - 1 },
    })),
    {
      x: 5.25, y: 2.20, w: 4.1, h: 2.80,
      fontFace: FONT_BODY, fontSize: 13.5, color: TEXT_DARK,
      paraSpaceAfter: 10, margin: 0,
    }
  );
});

// =====================================================================
// SLIDE 17: Q&A / THANK YOU
// =====================================================================
slides.push(() => {
  const s = pres.addSlide();
  s.background = { color: NAVY_DARK };

  for (let i = 0; i < 3; i++) {
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 0.0 + i * 0.18, w: 1.8 - i * 0.4, h: 0.06,
      fill: { color: CINNABAR, transparency: i * 25 },
      line: { color: CINNABAR, transparency: 100 },
    });
  }
  for (let i = 0; i < 3; i++) {
    s.addShape(pres.shapes.RECTANGLE, {
      x: W - (1.8 - i * 0.4), y: H - 0.36 + i * 0.10, w: 1.8 - i * 0.4, h: 0.06,
      fill: { color: CINNABAR, transparency: i * 25 },
      line: { color: CINNABAR, transparency: 100 },
    });
  }

  s.addImage({ data: loadImg(ASSET("robot-idle.png")), x: 1.0, y: 1.8, w: 2.0, h: 2.0 });

  s.addText("Thank you", {
    x: 3.2, y: 1.6, w: 6.5, h: 1.4,
    fontFace: FONT_HEAD, fontSize: 80, bold: true, color: WHITE, margin: 0,
  });
  s.addText("Questions from the panel?", {
    x: 3.2, y: 2.85, w: 6.5, h: 0.8,
    fontFace: FONT_HEAD, fontSize: 32, color: CINNABAR, margin: 0,
  });
  s.addText("MyUniPath  -  A Rule-Based ICT Career Decision Support System", {
    x: 3.2, y: 3.80, w: 6.5, h: 0.4,
    fontFace: FONT_BODY, fontSize: 14, italic: true, color: WHITE, transparency: 30, margin: 0,
  });

  s.addImage({ data: loadImg(ASSET("logo.png")), x: 3.2, y: 4.40, w: 0.55, h: 0.55 });
  s.addText("College of Computing and Informatics  -  UNITEN  -  FYP2  -  21 to 22 May 2026", {
    x: 3.85, y: 4.48, w: 6.0, h: 0.4,
    fontFace: FONT_BODY, fontSize: 12, color: WHITE, transparency: 35, valign: "middle", margin: 0,
  });
});

// ============================================================
// EXECUTE
// ============================================================
slides.forEach((build) => build());

const out = path.join(__dirname, "MyUniPath_Presentation.pptx");
pres.writeFile({ fileName: out }).then((fn) => {
  console.log("OK - wrote " + fn);
});
