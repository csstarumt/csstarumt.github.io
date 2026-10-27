import { test } from "node:test";
import assert from "node:assert/strict";
import { scenes, validateCss, previewDocument } from "../src/lib/playground";
test("all starter scenes and shortcut CSS validate", () => {
  for (const scene of Object.values(scenes))
    assert.equal(validateCss(scene.css), null);
  assert.equal(
    validateCss(
      ".type { color: transparent; -webkit-text-stroke: 2px #4f46e5; }",
    ),
    null,
  );
});
test("unfinished and invalid CSS is rejected without rejecting strings or comments", () => {
  for (const css of [
    ".shape { color: red;",
    ".shape { width: banana; }",
    ".shape { color red; }",
    '.shape { content: "open; }',
  ])
    assert.ok(validateCss(css));
  assert.equal(
    validateCss('.shape { content: "}"; /* { */ color: red; }'),
    null,
  );
});
test("preview keeps external resources and markup out", () => {
  assert.ok(validateCss('@import "https://example.com/a.css";'));
  assert.ok(validateCss(".shape { background: url(https://example.com/a); }"));
  const html = previewDocument(
    "shape",
    "</style><script>alert(1)</script>",
    true,
  );
  assert.ok(!html.includes("<script>"));
  assert.ok(html.includes("default-src 'none'"));
  assert.ok(html.includes("animation-play-state:paused!important"));
});
