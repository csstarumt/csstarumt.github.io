import { parse, walk, lexer } from "css-tree";
export const scenes = {
  shape: {
    name: "Shape",
    hint: "Try Make it round to turn the shape into a circle.",
    html: '<div class="shape"></div>',
    css: `.shape {
  width: 150px;
  height: 150px;
  background: #4f46e5;
  border-radius: 30% 70% 65% 35%;
  transform: rotate(-15deg);
  box-shadow: 18px 18px 0 #d9ddff;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  50% { transform: translateY(-16px) rotate(15deg); }
}`,
  },
  orbit: {
    name: "Orbit",
    hint: "Try Speed it up to see the orbit move faster.",
    html: '<div class="orbit"><div class="planet"></div><div class="satellite"></div></div>',
    css: `.orbit {
  width: 180px;
  height: 180px;
  border: 1px dashed #a5add9;
  border-radius: 50%;
  position: relative;
  animation: spin 6s linear infinite;
}
.planet {
  position: absolute;
  inset: 55px;
  background: #4f46e5;
  border-radius: 50%;
  box-shadow: 0 0 0 12px #e3e5ff;
}
.satellite {
  width: 28px;
  height: 28px;
  background: #e56c42;
  border-radius: 50%;
  position: absolute;
  top: -14px;
  left: 76px;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}`,
  },
  type: {
    name: "Type",
    hint: "Try Outline it to reveal a different typographic style.",
    html: '<div class="type">CSS<span>MAKE SOMETHING MATTER.</span></div>',
    css: `.type {
  color: #4f46e5;
  font: 900 76px/1 sans-serif;
  letter-spacing: -6px;
  text-shadow: 5px 5px 0 #cdd3ff;
  animation: stretch 3s ease-in-out infinite;
}
.type span {
  display: block;
  font: 10px/2 monospace;
  letter-spacing: 2px;
  text-shadow: none;
  margin-top: 18px;
}
@keyframes stretch {
  50% { transform: scaleX(1.12); }
}`,
  },
  sculpture: {
    name: "Sculpture",
    hint: "Try Explode it to separate the six faces.",
    html: '<div class="sculpture"><div class="cube"><div class="face front">CSS</div><div class="face back">BUILD</div><div class="face right">+</div><div class="face left">{ }</div><div class="face top">*</div><div class="face bottom">CREATE</div></div></div>',
    css: `/* Six faces. Pure CSS. */
.sculpture {
  perspective: 700px;
}
.cube {
  --depth: 62px;
  --ink: #4f46e5;
  width: 124px;
  height: 124px;
  position: relative;
  transform-style: preserve-3d;
  transform: rotateX(-24deg) rotateY(32deg);
  animation: turn 14s linear infinite;
}
.face {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  border: 2px solid var(--ink);
  background: #e2e5ffaa;
  color: var(--ink);
  font: 700 25px monospace;
  backface-visibility: hidden;
}
.front { transform: translateZ(var(--depth)); }
.back { transform: rotateY(180deg) translateZ(var(--depth)); }
.right { transform: rotateY(90deg) translateZ(var(--depth)); }
.left { transform: rotateY(-90deg) translateZ(var(--depth)); }
.top { transform: rotateX(90deg) translateZ(var(--depth)); }
.bottom { transform: rotateX(-90deg) translateZ(var(--depth)); }

@keyframes turn {
  from { transform: rotateX(-24deg) rotateY(32deg); }
  to { transform: rotateX(-24deg) rotateY(392deg); }
}`,
  },
};
export type Scene = keyof typeof scenes;
export function validateCss(css: string): string | null {
  if (css.length > 12000)
    return "Keep this experiment under 12,000 characters.";
  // This is a local CSS exercise: no markup or external resources are needed.
  if (/<\/?(?:style|script|iframe)|@import|url\s*\(|@font-face/i.test(css))
    return "Use local CSS only; external URLs, fonts and HTML are not supported.";
  // CSS parsers recover unfinished blocks; the editor should keep the last valid frame.
  const stack: string[] = [];
  let quote = "",
    comment = false;
  for (let i = 0; i < css.length; i++) {
    const c = css[i],
      next = css[i + 1];
    if (comment) {
      if (c === "*" && next === "/") {
        comment = false;
        i++;
      }
      continue;
    }
    if (quote) {
      if (c === "\\") i++;
      else if (c === quote) quote = "";
      continue;
    }
    if (c === "/" && next === "*") {
      comment = true;
      i++;
      continue;
    }
    if (c === '"' || c === "'") {
      quote = c;
      continue;
    }
    if (c === "\\") {
      i++;
      continue;
    }
    if ("{([".includes(c)) stack.push(c);
    if (
      "})]".includes(c) &&
      stack.pop() !==
        ({ "}": "{", ")": "(", "]": "[" } as Record<string, string>)[c]
    )
      return "Check your closing brackets.";
  }
  if (quote || comment || stack.length)
    return "Finish the open bracket, string or comment.";
  try {
    let problem: string | null = null;
    const ast = parse(css, {
      positions: true,
      onParseError(error) {
        throw error;
      },
    });
    walk(ast, (node) => {
      if (
        problem ||
        node.type !== "Declaration" ||
        node.property.startsWith("--")
      )
        return;
      const match = lexer.matchProperty(node.property, node.value);
      if (match.error && !match.error.message.includes("var()"))
        problem = `Line ${node.loc?.start.line || 1}: check “${node.property}” and its value.`;
    });
    return problem;
  } catch (error) {
    const e = error as { message: string; line?: number };
    return `${e.line ? `Line ${e.line}: ` : ""}${e.message}`;
  }
}
export function previewDocument(scene: Scene, css: string, paused: boolean) {
  // Scripts and navigation are sandboxed; CSP blocks outbound loads.
  const safeCss = css.replaceAll("<", "\\3c ");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src 'none'; font-src 'none'; connect-src 'none'; base-uri 'none'; form-action 'none'"><style>html,body{margin:0;width:100%;height:100%;overflow:hidden}body{display:grid;place-items:center;background:transparent}*{box-sizing:border-box}</style><style>${safeCss}</style><style>${paused ? "*,*::before,*::after{animation-play-state:paused!important;transition:none!important}" : ""}@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important}}</style></head><body>${scenes[scene].html}</body></html>`;
}
