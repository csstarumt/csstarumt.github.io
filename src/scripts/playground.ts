import {
  scenes,
  previewDocument,
  validateCss,
  type Scene,
} from "../lib/playground";
const lab = document.querySelector<HTMLElement>(".code-lab");
if (lab) {
  const editor = lab.querySelector<HTMLTextAreaElement>("textarea")!;
  const highlight = lab.querySelector<HTMLElement>(".code-highlight code")!;
  const frame = lab.querySelector<HTMLIFrameElement>("iframe")!;
  const status = lab.querySelector<HTMLElement>("#code-status")!;
  const pause = lab.querySelector<HTMLButtonElement>("[data-pause]")!;
  const media = matchMedia("(prefers-reduced-motion: reduce)");
  let scene: Scene = "shape",
    manualPause = false,
    timer = 0;
  const drafts = Object.fromEntries(
    Object.entries(scenes).map(([id, s]) => [id, s.css]),
  ) as Record<Scene, string>;
  const valid = { ...drafts };
  const effects: Partial<Record<Scene, Record<string, string>>> = {};
  const escape = (s: string) =>
    s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  function colorize() {
    const pattern =
      /(\/\*[\s\S]*?\*\/|#[\da-fA-F]{3,8}\b|\b\d+(?:\.\d+)?(?:px|s|deg|%)?|@[\w-]+|[\w-]+(?=\s*:))/g;
    let html = "",
      last = 0;
    for (const match of editor.value.matchAll(pattern)) {
      html += escape(editor.value.slice(last, match.index));
      const token = match[0];
      const cls = token.startsWith("/*")
        ? "comment"
        : token.startsWith("@")
          ? "at"
          : /^[#\d]/.test(token)
            ? "value"
            : "property";
      html += `<span class="token-${cls}">${escape(token)}</span>`;
      last = match.index! + token.length;
    }
    highlight.innerHTML = html + escape(editor.value.slice(last)) + "\n";
    syncScroll();
  }
  function syncScroll() {
    const pre = highlight.parentElement!;
    pre.scrollTop = editor.scrollTop;
    pre.scrollLeft = editor.scrollLeft;
  }
  function render() {
    const stopped =
      manualPause ||
      media.matches ||
      document.documentElement.dataset.motion === "paused";
    frame.srcdoc = previewDocument(scene, valid[scene], stopped);
    pause.textContent = stopped ? "Resume" : "Pause";
    pause.disabled =
      media.matches || document.documentElement.dataset.motion === "paused";
    pause.title = pause.disabled
      ? "Motion follows your page or device preference"
      : "";
    pause.setAttribute("aria-pressed", String(stopped));
  }
  function apply() {
    clearTimeout(timer);
    drafts[scene] = editor.value;
    const error = validateCss(editor.value);
    editor.setAttribute("aria-invalid", String(!!error));
    status.dataset.error = String(!!error);
    status.textContent = error
      ? `${error} Showing the last valid preview.`
      : "✓ Preview updated";
    if (!error) {
      valid[scene] = editor.value;
      render();
    }
  }
  function load() {
    clearTimeout(timer);
    editor.value = drafts[scene];
    editor.scrollTop = 0;
    editor.scrollLeft = 0;
    colorize();
    lab!.querySelector("[data-filename]")!.textContent = `${scene}.css`;
    lab!.querySelector("#code-hint")!.textContent = scenes[scene].hint;
    lab!
      .querySelectorAll<HTMLElement>("[data-scene]")
      .forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.scene === scene)),
      );
    lab!.querySelector<HTMLButtonElement>(
      '[data-preset="round"]',
    )!.textContent =
      scene === "shape"
        ? "Make it round"
        : scene === "orbit"
          ? "Speed it up"
          : scene === "sculpture" ? "Explode it" : "Outline it";
    render();
    apply();
  }
  editor.addEventListener("scroll", syncScroll);
  lab.querySelectorAll<HTMLButtonElement>("[data-scene]").forEach((b) =>
    b.addEventListener("click", () => {
      drafts[scene] = editor.value;
      scene = b.dataset.scene as Scene;
      load();
    }),
  );
  lab.querySelector("[data-reset-code]")!.addEventListener("click", () => {
    effects[scene] = {};
    drafts[scene] = scenes[scene].css;
    valid[scene] = scenes[scene].css;
    load();
    status.textContent = "Example reset.";
  });
  pause.addEventListener("click", () => {
    manualPause = !manualPause;
    render();
  });
  media.addEventListener("change", render);
  document.addEventListener("css:motion", render);
  lab.querySelectorAll<HTMLButtonElement>("[data-preset]").forEach((b) =>
    b.addEventListener("click", () => {
      const selector =
        scene === "shape" ? ".shape" : scene === "orbit" ? ".orbit" : ".type";
      let extra = "";
      if (b.dataset.preset === "round")
        extra =
          scene === "shape"
            ? ".shape { border-radius: 50%; }"
            : scene === "orbit"
              ? ".orbit { animation-duration: 2s; }"
              : ".type { color: transparent; -webkit-text-stroke: 2px #4f46e5; text-shadow: none; }";
      if (b.dataset.preset === "spin")
        extra = `${selector} { animation: playground-spin 4s linear infinite; }\n@keyframes playground-spin { to { transform: rotate(360deg); } }`;
      if (scene === "sculpture" && b.dataset.preset === "round")
        extra = ".cube { --depth: 95px; }";
      if (scene === "sculpture" && b.dataset.preset === "spin")
        extra = ".cube { animation-duration: 4s; }";
      if (b.dataset.preset === "surprise") {
        const colors = ["#087f73", "#c44421", "#b52c69"];
        const color = colors[Math.floor(Math.random() * colors.length)];
        extra =
          scene === "shape"
            ? `.shape { background: ${color}; border-radius: 65% 35% 25% 75%; }`
            : scene === "orbit"
              ? `.satellite { background: ${color}; width: 40px; height: 40px; }\n.orbit { animation-direction: reverse; }`
              : `.type { color: ${color}; letter-spacing: 4px; text-shadow: -5px 5px 0 #d9ddff; }`;
      }
      if (scene === "sculpture" && b.dataset.preset === "surprise")
        extra = ".cube { --ink: #087f73; --depth: 82px; }\n.face { background: #d2f3e899; border-radius: 20px; }";
      const current = effects[scene] ||= {};
      current[b.dataset.preset!] = extra;
      editor.value = scenes[scene].css + "\n\n" + Object.values(current).join("\n\n");
      colorize();
      apply();
      editor.scrollTop = editor.scrollHeight;
      syncScroll();
    }),
  );
  const expand = lab.querySelector<HTMLButtonElement>("[data-expand]")!;
  const dialog = document.createElement("dialog");
  dialog.className = "code-expanded";
  dialog.setAttribute("aria-label", "Expanded CSS playground");
  document.body.append(dialog);
  const marker = document.createComment("playground position");
  lab.before(marker);
  expand.addEventListener("click", () => {
    if (dialog.open) {
      dialog.close();
      return;
    }
    dialog.append(lab);
    expand.textContent = "Close ×";
    expand.setAttribute("aria-expanded", "true");
    dialog.showModal();
    render();
    editor.focus();
  });
  dialog.addEventListener("close", () => {
    marker.after(lab);
    expand.textContent = "Expand ↗";
    expand.setAttribute("aria-expanded", "false");
    render();
    expand.focus();
  });
  load();
}
