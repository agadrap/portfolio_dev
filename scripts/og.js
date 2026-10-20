const fs = require("node:fs");
const path = require("node:path");
const matter = require("gray-matter");
const satori = require("satori").default;
const { Resvg } = require("@resvg/resvg-js");

const ROOT = path.join(__dirname, "..");
const SITE = path.join(ROOT, "_site");
const FONT_DIR = path.join(
  ROOT,
  "node_modules/@fontsource/jetbrains-mono/files",
);

const WIDTH = 1200;
const HEIGHT = 630;
const BG = "#040806";
const FRAME = "#1e3d2a";
const DIM = "#3a6b52";
const ACCENT = "#4af2a1";
const TEXT = "#d4d4c8";
const MUTED = "#7a8a80";
const HIGHLIGHT = "#d1ae55";

const DOT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"><circle cx="1" cy="1" r="1" fill="rgba(74,242,161,0.09)"/></svg>`;
const DOT_URI = `data:image/svg+xml;base64,${Buffer.from(DOT_SVG).toString("base64")}`;

function loadFont(file) {
  return fs.readFileSync(path.join(FONT_DIR, file));
}

const fonts = [
  {
    name: "JetBrains Mono",
    data: loadFont("jetbrains-mono-latin-300-normal.woff"),
    weight: 300,
    style: "normal",
  },
  {
    name: "JetBrains Mono",
    data: loadFont("jetbrains-mono-latin-400-normal.woff"),
    weight: 400,
    style: "normal",
  },
  {
    name: "JetBrains Mono",
    data: loadFont("jetbrains-mono-latin-500-normal.woff"),
    weight: 500,
    style: "normal",
  },
];

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatDate(d) {
  if (!d) return "";
  const date = d instanceof Date ? d : new Date(d);
  const day = date.getUTCDate();
  const month = MONTHS[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  return `${day} ${month} ${year}`;
}

// Rough measurement of monospace width.
const CHAR_W_RATIO = 0.6;

function fitFontSize(text, maxWidth, maxLines, startSize, minSize) {
  const total = text.length;
  for (let size = startSize; size >= minSize; size -= 2) {
    const charsPerLine = Math.floor(maxWidth / (size * CHAR_W_RATIO));
    if (charsPerLine <= 0) continue;
    const lines = wrapLines(text, charsPerLine);
    if (lines.length <= maxLines) return { size, lines };
  }
  const size = minSize;
  const charsPerLine = Math.max(
    1,
    Math.floor(maxWidth / (size * CHAR_W_RATIO)),
  );
  return { size, lines: wrapLines(text, charsPerLine) };
}

// Word-aware wrap. Falls back to hard-break if a single word is longer than the line.
function wrapLines(text, maxChars) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length <= maxChars) {
      line = candidate;
    } else {
      if (line) lines.push(line);
      if (word.length <= maxChars) {
        line = word;
      } else {
        // Hard break long word
        let rest = word;
        while (rest.length > maxChars) {
          lines.push(rest.slice(0, maxChars));
          rest = rest.slice(maxChars);
        }
        line = rest;
      }
    }
  }
  if (line) lines.push(line);
  return lines;
}

function splitHighlight(line, highlight) {
  if (!highlight) return [{ text: line, color: TEXT }];
  const idx = line.indexOf(highlight);
  if (idx === -1) return [{ text: line, color: TEXT }];
  const parts = [];
  if (idx > 0) parts.push({ text: line.slice(0, idx), color: TEXT });
  parts.push({ text: highlight, color: HIGHLIGHT });
  if (idx + highlight.length < line.length) {
    parts.push({ text: line.slice(idx + highlight.length), color: TEXT });
  }
  return parts;
}

// Replace trailing/leading ASCII spaces with NBSP so span boundaries don't collapse them.
function preserveEdgeSpaces(text) {
  return text.replace(/^ +/, (m) => " ".repeat(m.length)).replace(
    / +$/,
    (m) => " ".repeat(m.length),
  );
}

function titleLineChildren(line, highlight) {
  const parts = splitHighlight(line, highlight);
  return parts.map((p) => ({
    type: "span",
    props: {
      style: {
        color: p.color,
      },
      children: parts.length > 1 ? preserveEdgeSpaces(p.text) : p.text,
    },
  }));
}

function buildTree({ command, argument, title, subtitle, date, ogHighlight }) {
  // Inner content width: 1200 - 2*36 (frame) - 2*1 (border) - 2*48 (padding)
  const INNER_PAD = 48;
  const contentWidth = WIDTH - 2 * 36 - 2 - 2 * INNER_PAD;

  const titleFit = fitFontSize(title, contentWidth, 2, 56, 32);
  const subtitleFit = subtitle
    ? fitFontSize(subtitle, contentWidth, 3, 24, 18)
    : { size: 24, lines: [] };

  const titleEls = titleFit.lines.map((line, i) => ({
    type: "div",
    key: `t${i}`,
    props: {
      style: {
        display: "flex",
        fontFamily: "JetBrains Mono",
        fontWeight: 500,
        fontSize: titleFit.size,
        color: TEXT,
        lineHeight: 1.2,
      },
      children: titleLineChildren(line, ogHighlight),
    },
  }));

  const subtitleEls = subtitleFit.lines.map((line, i) => ({
    type: "div",
    key: `s${i}`,
    props: {
      style: {
        display: "flex",
        fontFamily: "JetBrains Mono",
        fontWeight: 300,
        fontSize: subtitleFit.size,
        color: MUTED,
        lineHeight: 1.4,
      },
      children: line,
    },
  }));

  const windowDots = {
    type: "div",
    props: {
      style: {
        display: "flex",
        gap: 8,
        alignItems: "center",
      },
      children: [0, 1, 2].map((i) => ({
        type: "div",
        key: `d${i}`,
        props: {
          style: {
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: FRAME,
          },
        },
      })),
    },
  };

  const header = {
    type: "div",
    props: {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 14,
        fontFamily: "JetBrains Mono",
        fontWeight: 400,
        fontSize: 18,
        color: DIM,
      },
      children: [
        windowDots,
        {
          type: "div",
          props: {
            style: { display: "flex" },
            children: "~/byaga.dev",
          },
        },
      ],
    },
  };

  const commandLine = {
    type: "div",
    props: {
      style: {
        display: "flex",
        fontFamily: "JetBrains Mono",
        fontWeight: 400,
        fontSize: 22,
        color: DIM,
        marginTop: 32,
      },
      children: [
        {
          type: "span",
          props: { style: { marginRight: 10 }, children: command },
        },
        {
          type: "span",
          props: { style: { color: ACCENT }, children: argument },
        },
      ],
    },
  };

  const titleBlock = {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        marginTop: 28,
        gap: 6,
      },
      children: titleEls,
    },
  };

  const subtitleBlock = subtitleEls.length
    ? {
        type: "div",
        props: {
          style: {
            display: "flex",
            flexDirection: "column",
            marginTop: 24,
            gap: 4,
          },
          children: subtitleEls,
        },
      }
    : null;

  const footerLeft = {
    type: "div",
    props: {
      style: {
        display: "flex",
        fontFamily: "JetBrains Mono",
        fontSize: 18,
      },
      children: [
        {
          type: "span",
          props: {
            style: { color: ACCENT, fontWeight: 500 },
            children: "byaga.dev",
          },
        },
        {
          type: "span",
          props: {
            style: { color: MUTED, fontWeight: 400 },
            children: " · Aga Drapinska-Tonge",
          },
        },
      ],
    },
  };

  const footerRightChildren = [];
  if (date) {
    footerRightChildren.push({
      type: "span",
      props: {
        style: {
          color: MUTED,
          fontFamily: "JetBrains Mono",
          fontSize: 18,
          fontWeight: 400,
          marginRight: 14,
        },
        children: date,
      },
    });
  }
  footerRightChildren.push({
    type: "div",
    props: {
      style: {
        width: 12,
        height: 24,
        backgroundColor: ACCENT,
      },
    },
  });

  const footerRight = {
    type: "div",
    props: {
      style: {
        display: "flex",
        alignItems: "center",
      },
      children: footerRightChildren,
    },
  };

  const footer = {
    type: "div",
    props: {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "auto",
      },
      children: [footerLeft, footerRight],
    },
  };

  const children = [header, commandLine, titleBlock];
  if (subtitleBlock) children.push(subtitleBlock);
  children.push(footer);

  const innerFrame = {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        position: "absolute",
        top: 36,
        left: 36,
        right: 36,
        bottom: 36,
        border: `1px solid ${FRAME}`,
        borderRadius: 6,
        padding: `40px ${INNER_PAD}px 40px ${INNER_PAD}px`,
      },
      children,
    },
  };

  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        width: WIDTH,
        height: HEIGHT,
        backgroundColor: BG,
        backgroundImage: `url("${DOT_URI}")`,
        backgroundRepeat: "repeat",
        position: "relative",
      },
      children: [innerFrame],
    },
  };
}

async function renderPng(tree, outPath) {
  const svg = await satori(tree, { width: WIDTH, height: HEIGHT, fonts });
  const png = new Resvg(svg, {
    fitTo: { mode: "width", value: WIDTH },
  })
    .render()
    .asPng();
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, png);
  return outPath;
}

function readFrontmatter(file) {
  const raw = fs.readFileSync(file, "utf8");
  return matter(raw).data;
}

async function generatePosts() {
  const dir = path.join(ROOT, "src/blog");
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    if (!name.endsWith(".md")) continue;
    const slug = name.replace(/\.md$/, "");
    const data = readFrontmatter(path.join(dir, name));
    if (!data.title) continue;
    const tree = buildTree({
      command: "$ cat",
      argument: `blog/${slug}.md`,
      title: data.title,
      subtitle: data.subtitle || "",
      date: formatDate(data.date),
      ogHighlight: data.ogHighlight,
    });
    const outPath = path.join(SITE, "blog", slug, "og.png");
    await renderPng(tree, outPath);
    out.push(outPath);
  }
  return out;
}

async function generateProjects() {
  const dir = path.join(ROOT, "src/projects");
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    if (!name.endsWith(".md")) continue;
    const slug = name.replace(/\.md$/, "");
    const data = readFrontmatter(path.join(dir, name));
    if (!data.title) continue;
    const tree = buildTree({
      command: "$ cat",
      argument: `projects/${slug}/`,
      title: data.title,
      subtitle: data.tagline || data.description || "",
      ogHighlight: data.ogHighlight,
    });
    const outPath = path.join(SITE, "projects", slug, "og.png");
    await renderPng(tree, outPath);
    out.push(outPath);
  }
  return out;
}

async function generateHome() {
  const tree = buildTree({
    command: "$",
    argument: "whoami",
    title: "Aga Drapinska-Tonge",
    subtitle:
      "Founder of Golden Record Consulting. Data analytics engineer and developer, building in public.",
    ogHighlight: "Golden Record Consulting",
  });
  const outPath = path.join(SITE, "og.png");
  await renderPng(tree, outPath);
  return outPath;
}

async function main() {
  if (!fs.existsSync(SITE)) {
    console.error(`_site/ not found at ${SITE}. Run eleventy first.`);
    process.exit(1);
  }
  const files = [];
  files.push(await generateHome());
  files.push(...(await generatePosts()));
  files.push(...(await generateProjects()));
  console.log(`Wrote ${files.length} OG images.`);
  for (const f of files) console.log(`  ${path.relative(ROOT, f)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
