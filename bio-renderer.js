(function () {
  function getCurrentBioFile() {
    var params = new URLSearchParams(window.location.search || "");
    var requested = params.get("bio");
    if (requested) return requested;

    var path = window.location.pathname || "";
    return path.split("/").pop() || "";
  }

  function setHtml(targetSelector, html) {
    var target = document.querySelector(targetSelector);
    if (target) {
      target.innerHTML = html || "";
    }
  }

  function renderBioPage(bios) {
    var bioFile = getCurrentBioFile();
    var bio = bios && bios[bioFile];

    if (!bio) {
      setHtml("[data-bio-main]", '<div class="border border-dashed border-slate-300 rounded-lg p-6 text-sm text-slate-500">Bio content not found.</div>');
      return;
    }

    if (bio.title) {
      document.title = bio.title;
    }

    setHtml("[data-bio-header]", bio.headerHtml);
    setHtml("[data-bio-main]", bio.mainHtml);
    setHtml("[data-bio-footer]", bio.footerHtml);

    window.__bioPageReady = true;
    document.dispatchEvent(new CustomEvent("bio:loaded", { detail: { file: bioFile } }));
  }

  function initBioRenderer() {
    var main = document.querySelector("[data-bio-main]");
    if (main) {
      main.innerHTML = '<div class="text-sm text-slate-500">Loading bio...</div>';
    }

    fetch("bios.json?v=20260618a")
      .then(function (response) {
        if (!response.ok) throw new Error("Failed to load bios.json");
        return response.json();
      })
      .then(function (data) {
        renderBioPage(data.bios || {});
      })
      .catch(function () {
        if (main) {
          main.innerHTML = '<div class="border border-dashed border-amber-300 bg-amber-50 text-amber-900 rounded-lg p-4 text-sm">Could not load bio content.</div>';
        }
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBioRenderer);
  } else {
    initBioRenderer();
  }
})();