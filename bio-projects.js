(function () {
  function t(value, lang) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      if (value[lang] != null) return value[lang];
      if (value.en != null) return value.en;
      var keys = Object.keys(value);
      return keys.length ? value[keys[0]] : "";
    }
    return value || "";
  }

  function getCurrentLang() {
    var bodyLang = document.body ? document.body.getAttribute("data-lang") : null;
    return bodyLang === "de" ? "de" : "en";
  }

  function getCurrentBioFile() {
    var params = new URLSearchParams(window.location.search || "");
    var requested = params.get("bio");
    if (requested) return requested;

    var path = window.location.pathname || "";
    return path.split("/").pop() || "";
  }

  function collectHtmlByLang(details, lang) {
    if (!details || !details.html) return "";
    var blocks = details.html[lang];
    if (!Array.isArray(blocks)) return "";
    return blocks.join(" ");
  }

  function projectMatchesPerson(project, bioFile, personName) {
    if (!project || typeof project !== "object") return false;

    if (Array.isArray(project.people)) {
      for (var i = 0; i < project.people.length; i += 1) {
        if (project.people[i] === bioFile) return true;
      }
    }

    var details = project.details || {};
    var creditHtmlEn = collectHtmlByLang(details, "en");
    var creditHtmlDe = collectHtmlByLang(details, "de");
    var legacyHrefSingle = "href='" + bioFile + "'";
    var legacyHrefDouble = 'href="' + bioFile + '"';
    var templateHrefSingle = "href='bio_template.html?bio=" + bioFile + "'";
    var templateHrefDouble = 'href="bio_template.html?bio=' + bioFile + '"';
    if (
      creditHtmlEn.indexOf(legacyHrefSingle) !== -1 ||
      creditHtmlEn.indexOf(legacyHrefDouble) !== -1 ||
      creditHtmlEn.indexOf(templateHrefSingle) !== -1 ||
      creditHtmlEn.indexOf(templateHrefDouble) !== -1 ||
      creditHtmlDe.indexOf(legacyHrefSingle) !== -1 ||
      creditHtmlDe.indexOf(legacyHrefDouble) !== -1 ||
      creditHtmlDe.indexOf(templateHrefSingle) !== -1 ||
      creditHtmlDe.indexOf(templateHrefDouble) !== -1
    ) {
      return true;
    }

    var credits = details.credits;
    if (typeof credits === "string" && personName) {
      return credits.toLowerCase().indexOf(personName.toLowerCase()) !== -1;
    }

    return false;
  }

  function renderProjects(projects, bioFile) {
    var host = document.querySelector("[data-bio-projects]");
    if (!host) return;

    var personNamesByFile = {
      "bio-beatrice.html": "Beatrice Paoli",
      "bio-joachim.html": "Joachim Steinwendner",
      "bio-danka.html": "Danuta Paraficz",
      "bio-natasa.html": "Natasa Sarafijanovic-Djukic",
      "bio-aris.html": "Aris Marcolongo",
      "bio-ralf.html": "Ralf Jandl",
      "bio-ann-karin.html": "Ann-Karin Sanchez"
    };

    var personName = personNamesByFile[bioFile] || "";

    var related = [];
    for (var i = 0; i < projects.length; i += 1) {
      var project = projects[i];
      if (projectMatchesPerson(project, bioFile, personName)) {
        related.push(project);
      }
    }

    related.sort(function (a, b) {
      var rankA = a.status === "active" ? 0 : 1;
      var rankB = b.status === "active" ? 0 : 1;
      if (rankA !== rankB) return rankA - rankB;
      return String(t(a.shortTitle || a.title, "en")).localeCompare(String(t(b.shortTitle || b.title, "en")));
    });

    if (!related.length) {
      host.innerHTML =
        '<div class="border border-dashed border-slate-300 rounded-lg p-6 text-sm text-slate-500">' +
        '<div class="lang-en">No linked projects yet. Add this bio page filename in project metadata (e.g. <code>people: [\'' + bioFile + '\']</code>) and it will appear automatically.</div>' +
        '<div class="lang-de">Noch keine verknuepften Projekte. Fuegen Sie den Dateinamen dieser Bio-Seite in den Projekt-Metadaten hinzu (z. B. <code>people: [\'' + bioFile + '\']</code>), dann erscheint es automatisch.</div>' +
        '</div>';
      return;
    }

    var cards = [];
    for (var j = 0; j < related.length; j += 1) {
      var item = related[j];
      var titleEn = t(item.shortTitle || item.title, "en");
      var titleDe = t(item.shortTitle || item.title, "de");
      var badgeEn = t(item.badge, "en");
      var badgeDe = t(item.badge, "de");
      var descEn = t(item.description, "en");
      var descDe = t(item.description, "de");
      var metaEn = t(item.meta, "en");
      var metaDe = t(item.meta, "de");
      var href = item.id ? ("projects.html#" + item.id) : "projects.html";
      var img = item.image || "images/logo.png";
      var alt = item.altText || titleEn || "Project image";
      var statusEn = item.status === "archive" ? "Archive" : "Active";
      var statusDe = item.status === "archive" ? "Archiv" : "Aktiv";

      cards.push(
        '<a href="' + href + '" class="group border border-gray-200 rounded-xl p-6 hover:border-red-600 transition block">' +
          '<div class="h-36 rounded-md overflow-hidden border border-gray-200 mb-4">' +
            '<img src="' + img + '" alt="' + alt + '" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">' +
          '</div>' +
          '<h4 class="font-bold text-lg mb-2 leading-tight">' +
            '<span class="lang-en">' + titleEn + '</span>' +
            '<span class="lang-de">' + titleDe + '</span>' +
          '</h4>' +
          '<p class="text-[10px] text-red-600 font-bold uppercase tracking-widest mb-3">' +
            '<span class="lang-en">' + (badgeEn || statusEn) + '</span>' +
            '<span class="lang-de">' + (badgeDe || statusDe) + '</span>' +
          '</p>' +
          '<p class="text-sm text-gray-600 leading-relaxed mb-3">' +
            '<span class="lang-en">' + (descEn || "") + '</span>' +
            '<span class="lang-de">' + (descDe || "") + '</span>' +
          '</p>' +
          '<p class="text-xs text-slate-400">' +
            '<span class="lang-en">' + (metaEn || "") + '</span>' +
            '<span class="lang-de">' + (metaDe || "") + '</span>' +
          '</p>' +
        '</a>'
      );
    }

    host.innerHTML = '<div class="grid grid-cols-1 md:grid-cols-2 gap-8">' + cards.join("") + "</div>";
  }

  var cachedProjects = null;
  var bioReady = !!window.__bioPageReady;

  function maybeRenderProjects() {
    var host = document.querySelector("[data-bio-projects]");
    if (!host || !cachedProjects || !bioReady) return;

    renderProjects(cachedProjects, getCurrentBioFile());
  }

  function initBioProjects() {
    var host = document.querySelector("[data-bio-projects]");
    if (!host) return;

    var bioFile = getCurrentBioFile();
    host.innerHTML = '<div class="text-sm text-slate-500">Loading related projects...</div>';

    window.addEventListener("bio:loaded", function () {
      bioReady = true;
      maybeRenderProjects();
    });

    fetch("content.json?v=20260511c")
      .then(function (response) {
        if (!response.ok) throw new Error("Failed to load content.json");
        return response.json();
      })
      .then(function (content) {
        cachedProjects = Array.isArray(content.projects) ? content.projects : [];
        bioReady = !!window.__bioPageReady;
        maybeRenderProjects();
      })
      .catch(function () {
        host.innerHTML =
          '<div class="border border-dashed border-amber-300 bg-amber-50 text-amber-900 rounded-lg p-4 text-sm">' +
          '<span class="lang-en">Could not load related projects.</span>' +
          '<span class="lang-de">Verknuepfte Projekte konnten nicht geladen werden.</span>' +
          '</div>';
      });

    document.addEventListener("ada:languagechange", function () {
      if (!host) return;
      var lang = getCurrentLang();
      host.setAttribute("data-lang", lang);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBioProjects);
  } else {
    initBioProjects();
  }
})();
