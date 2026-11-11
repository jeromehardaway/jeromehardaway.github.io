// Theme toggle, mobile nav and copy buttons. The site works without this file.

(function () {
  var root = document.documentElement;

  function storedTheme() {
    try {
      return localStorage.getItem("theme");
    } catch (e) {
      return null;
    }
  }

  function currentTheme() {
    return (
      root.getAttribute("data-theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    );
  }

  var saved = storedTheme();
  if (saved === "light" || saved === "dark") {
    root.setAttribute("data-theme", saved);
  }

  document.addEventListener("DOMContentLoaded", function () {
    var themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
      themeToggle.addEventListener("click", function () {
        var next = currentTheme() === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);
        try {
          localStorage.setItem("theme", next);
        } catch (e) {
          // Private mode: the choice lasts for this page only.
        }
      });
    }

    var navToggle = document.getElementById("nav-toggle");
    var nav = document.getElementById("site-nav");
    if (navToggle && nav) {
      navToggle.addEventListener("click", function () {
        var open = nav.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    document.querySelectorAll("[data-copy]").forEach(function (button) {
      button.addEventListener("click", function () {
        var source = document.getElementById(button.getAttribute("data-copy"));
        if (!source || !navigator.clipboard) return;
        navigator.clipboard.writeText(source.textContent.trim()).then(function () {
          var label = button.textContent;
          button.textContent = "Copied";
          setTimeout(function () {
            button.textContent = label;
          }, 1800);
        });
      });
    });

    document.querySelectorAll("[data-print]").forEach(function (button) {
      button.addEventListener("click", function () {
        window.print();
      });
    });
  });
})();
