// jerome.codes: small enhancements. Every page works without JS.

// Footer year
document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = new Date().getFullYear();
});

// Chip groups: single-select aria-pressed buttons.
// data-chips="<selector>" filters matching items by data-cat; a hidden input inside the group gets the value.
document.querySelectorAll("[data-chips]").forEach((group) => {
  const chips = group.querySelectorAll("button[aria-pressed]");
  const input = group.querySelector('input[type="hidden"]');
  const items = group.dataset.chips ? document.querySelectorAll(group.dataset.chips) : [];
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
      if (input) input.value = chip.value;
      items.forEach((item) => {
        item.hidden = chip.value !== "all" && item.dataset.cat !== chip.value;
      });
    });
  });
});

// Counts: <span data-count="<selector>">06</span>
document.querySelectorAll("[data-count]").forEach((el) => {
  el.textContent = String(document.querySelectorAll(el.dataset.count).length).padStart(2, "0");
});

// Code block copy
document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", () => {
    const code = button.closest("[data-code]").querySelector("code");
    Promise.resolve()
      .then(() => navigator.clipboard.writeText(code.textContent))
      .then(() => {
        button.textContent = "Copied";
        clearTimeout(button.timer);
        button.timer = setTimeout(() => { button.textContent = "Copy"; }, 2000);
      })
      .catch(() => getSelection().selectAllChildren(code)); // no clipboard access: select the code for a manual copy
  });
});

// Article reading progress + active TOC link
const article = document.querySelector("[data-article]");
if (article) {
  const bar = document.querySelector("[data-progress]");
  const label = document.querySelector("[data-progress-label]");
  const links = [...document.querySelectorAll("[data-toc] a")];
  const sections = links.map((a) => document.getElementById(a.hash.slice(1)));
  const update = () => {
    const { top, height } = article.getBoundingClientRect();
    const read = Math.min(1, Math.max(0, -top / Math.max(1, height - innerHeight)));
    bar.style.transform = `scaleX(${read})`;
    label.textContent = `${Math.round(read * 100)}% read`;
    let active = 0;
    sections.forEach((s, i) => { if (s.getBoundingClientRect().top < innerHeight / 3) active = i; });
    links.forEach((a, i) => {
      if (i === active) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  };
  addEventListener("scroll", update, { passive: true });
  addEventListener("resize", update);
  update();
}
