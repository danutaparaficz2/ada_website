(function () {
  var STORAGE_KEY = "ada-site-language";
  var DEFAULT_LANG = "en";

  function getStoredLanguage() {
    var stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "de" ? "de" : DEFAULT_LANG;
  }

  function setStoredLanguage(lang) {
    window.localStorage.setItem(STORAGE_KEY, lang);
  }

  function injectStyles() {
    if (document.getElementById("ada-language-style")) return;
    var style = document.createElement("style");
    style.id = "ada-language-style";
    style.textContent =
      "#ada-language-switcher{position:fixed;top:.75rem;right:1rem;z-index:70;display:inline-flex;gap:.25rem;padding:.25rem;background:rgba(255,255,255,.92);border:1px solid #cbd5e1;border-radius:9999px;box-shadow:0 10px 30px rgba(15,23,42,.12);backdrop-filter:blur(10px)}" +
      "#ada-language-switcher button{border:0;background:transparent;color:#475569;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;padding:.45rem .7rem;border-radius:9999px;cursor:pointer}" +
      "#ada-language-switcher button:hover{background:#f1f5f9;color:#0f172a}" +
      "#ada-language-switcher button.is-active{background:#dc2626;color:#fff}" +
      ".lang-en{display:none} .lang-de{display:block}" +
      "body[data-lang='en'] .lang-en{display:block}" +
      "body[data-lang='en'] .lang-de{display:none}" +
      "body[data-lang='de'] .lang-en{display:none}" +
      "body[data-lang='de'] .lang-de{display:block}" +
      "@media (max-width:640px){#ada-language-switcher{top:.5rem;right:.5rem}}";
    document.head.appendChild(style);
  }

  function updateSwitcher(lang) {
    document.querySelectorAll("#ada-language-switcher button").forEach(function (button) {
      button.classList.toggle("is-active", button.getAttribute("data-lang") === lang);
    });
  }

  function applyLanguage(lang) {
    document.documentElement.lang = lang;
    if (document.body) document.body.setAttribute("data-lang", lang);
    updateSwitcher(lang);
    setStoredLanguage(lang);
    document.dispatchEvent(new CustomEvent("ada:languagechange", { detail: { lang: lang } }));
  }

  function injectSwitcher(initialLang) {
    if (document.getElementById("ada-language-switcher")) return;
    var switcher = document.createElement("div");
    switcher.id = "ada-language-switcher";
    switcher.setAttribute("aria-label", "Language switcher");
    switcher.innerHTML =
      '<button type="button" data-lang="en">EN</button>' +
      '<button type="button" data-lang="de">DE</button>';

    switcher.addEventListener("click", function (event) {
      var button = event.target.closest("button[data-lang]");
      if (!button) return;
      applyLanguage(button.getAttribute("data-lang"));
    });

    document.body.appendChild(switcher);
    updateSwitcher(initialLang);
  }

  function init() {
    var lang = getStoredLanguage();
    injectStyles();
    injectSwitcher(lang);
    applyLanguage(lang);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
