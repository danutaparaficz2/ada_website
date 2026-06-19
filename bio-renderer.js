(function () {
  function getCurrentBioFile() {
    var params = new URLSearchParams(window.location.search || "");
    var requested = params.get("bio");
    if (requested) return requested;

    var path = window.location.pathname || "";
    return path.split("/").pop() || "";
  }

  function clearTarget(targetSelector) {
    var target = document.querySelector(targetSelector);
    if (!target) return null;
    target.replaceChildren();
    return target;
  }

  function setStatus(targetSelector, html) {
    var target = document.querySelector(targetSelector);
    if (target) target.innerHTML = html;
  }

  function createElement(tagName, className, text) {
    var element = document.createElement(tagName);
    if (className) element.className = className;
    if (text != null) element.textContent = text;
    return element;
  }

  function createLink(link, className) {
    var anchor = createElement("a", className, link.label || link.href || "");
    anchor.href = link.href || "#";
    if (/^https?:\/\//.test(anchor.href)) {
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
    }
    return anchor;
  }

  function createLangBlock(tagName, className, enText, deText) {
    var wrapper = createElement(tagName, className);
    var enNode = createElement("span", "lang-en", enText || "");
    var deNode = createElement("span", "lang-de", deText || enText || "");
    wrapper.appendChild(enNode);
    wrapper.appendChild(deNode);
    return wrapper;
  }

  function appendParagraphs(host, paragraphs, langClass) {
    var wrapper = createElement("div", langClass);
    var items = Array.isArray(paragraphs) ? paragraphs : [];
    for (var index = 0; index < items.length; index += 1) {
      wrapper.appendChild(createElement("p", index === items.length - 1 ? "" : "mb-5", items[index]));
    }
    host.appendChild(wrapper);
  }

  function renderHeader(bio) {
    var header = createElement("div", "max-w-6xl mx-auto px-6 py-10 border-b border-gray-100");
    var row = createElement("div", "flex flex-col md:flex-row justify-between items-start md:items-center gap-4");
    var brand = createElement("a", "hover:opacity-70 transition flex items-center gap-4");
    brand.href = "ada_better.html";

    var logo = document.createElement("img");
    logo.src = "images/logo.png";
    logo.alt = "ADA Institute logo";
    logo.className = "h-14 w-auto object-contain";
    brand.appendChild(logo);

    var titleWrap = createElement("div");
    titleWrap.appendChild(createElement("h1", "text-2xl font-bold tracking-tight", bio.name || ""));
    titleWrap.appendChild(createElement("p", "text-xs text-gray-400 font-medium uppercase tracking-widest", bio.role || ""));
    brand.appendChild(titleWrap);
    row.appendChild(brand);

    var nav = createElement("nav", "flex gap-6 text-[11px] font-bold uppercase tracking-widest text-gray-500");
    var headerLinks = Array.isArray(bio.headerLinks) ? bio.headerLinks : [];
    for (var index = 0; index < headerLinks.length; index += 1) {
      nav.appendChild(createLink(headerLinks[index], "hover:text-red-600 transition"));
    }
    if (bio.contact && bio.contact.email) {
      nav.appendChild(createLink({ label: "Email", href: "mailto:" + bio.contact.email }, "text-red-600 underline"));
    }
    row.appendChild(nav);
    header.appendChild(row);
    return header;
  }

  function renderInfoCard(bio) {
    var aside = createElement("aside", "space-y-8");

    var officeCard = createElement("section", "border border-slate-200 rounded-2xl p-6");
    officeCard.appendChild(createLangBlock("h3", "text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mb-4 italic", "Office", "Standort"));
    officeCard.appendChild(createElement("p", "text-sm font-semibold text-slate-900 mb-2", bio.office && bio.office.organization ? bio.office.organization : ""));
    var officeDetails = bio.office && Array.isArray(bio.office.details) ? bio.office.details : [];
    for (var officeIndex = 0; officeIndex < officeDetails.length; officeIndex += 1) {
      officeCard.appendChild(createElement("p", officeIndex === 0 ? "text-sm text-slate-600" : "text-sm text-slate-600 mt-1", officeDetails[officeIndex]));
    }
    aside.appendChild(officeCard);

    var contactCard = createElement("section", "border border-slate-200 rounded-2xl p-6");
    contactCard.appendChild(createLangBlock("h3", "text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mb-4 italic", "Contact", "Kontakt"));
    contactCard.appendChild(createElement("p", "text-sm font-semibold text-slate-900", bio.contact && bio.contact.name ? bio.contact.name : bio.name || ""));
    if (bio.contact && bio.contact.email) {
      contactCard.appendChild(createLink({ label: bio.contact.email, href: "mailto:" + bio.contact.email }, "mt-2 block text-sm text-red-600 hover:underline"));
    }
    if (bio.contact && bio.contact.phone) {
      contactCard.appendChild(createElement("p", "mt-2 text-sm text-slate-600", bio.contact.phone));
    }
    var contactLinks = bio.contact && Array.isArray(bio.contact.links) ? bio.contact.links : [];
    for (var linkIndex = 0; linkIndex < contactLinks.length; linkIndex += 1) {
      contactCard.appendChild(createLink(contactLinks[linkIndex], "mt-2 block text-sm text-red-600 hover:underline"));
    }
    aside.appendChild(contactCard);

    return aside;
  }

  function renderMain(bio) {
    var wrapper = createElement("div");
    wrapper.id = "home-view";

    var bioSection = createElement("section", "grid md:grid-cols-3 gap-12 mb-24 pb-12 border-b");
    var prose = createElement("div", "md:col-span-2 prose-text text-lg");
    prose.appendChild(createLangBlock("h2", "text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mb-6 italic", "Professional Bio", "Professionelle Biografie"));
    appendParagraphs(prose, bio.bio && bio.bio.en, "lang-en");
    appendParagraphs(prose, bio.bio && bio.bio.de, "lang-de");
    bioSection.appendChild(prose);
    bioSection.appendChild(renderInfoCard(bio));
    wrapper.appendChild(bioSection);

    var relatedSection = createElement("section", "mt-16");
    relatedSection.appendChild(createLangBlock("h2", "text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mb-10 italic", "Related Projects", "Verknuepfte Projekte"));
    relatedSection.appendChild(createElement("div"));
    relatedSection.lastChild.setAttribute("data-bio-projects", "");
    wrapper.appendChild(relatedSection);

    return wrapper;
  }

  function renderFooter(bio) {
    var footer = createElement("div", "max-w-6xl mx-auto border-t py-12 px-6 text-[10px] text-gray-400 font-bold uppercase tracking-widest");
    var row = createElement("div", "grid md:grid-cols-2 gap-12");

    var office = createElement("div");
    office.appendChild(createElement("p", "text-black mb-2", bio.office && bio.office.organization ? bio.office.organization : "ADA Institute (FFHS)"));
    var officeDetails = bio.office && Array.isArray(bio.office.details) ? bio.office.details : [];
    for (var officeIndex = 0; officeIndex < officeDetails.length; officeIndex += 1) {
      office.appendChild(createElement("p", "", officeDetails[officeIndex]));
    }
    row.appendChild(office);

    var contact = createElement("div", "md:text-right");
    contact.appendChild(createLangBlock("p", "text-black mb-2", "Contact", "Kontakt"));
    contact.appendChild(createElement("p", "", bio.contact && bio.contact.name ? bio.contact.name : bio.name || ""));
    if (bio.contact && bio.contact.email) {
      contact.appendChild(createLink({ label: bio.contact.email, href: "mailto:" + bio.contact.email }, "text-red-600 hover:underline"));
    }
    if (bio.contact && bio.contact.phone) {
      contact.appendChild(createElement("p", "", bio.contact.phone));
    }
    row.appendChild(contact);

    footer.appendChild(row);
    return footer;
  }

  function renderBioPage(bios) {
    var bioFile = getCurrentBioFile();
    var bio = bios && bios[bioFile];

    if (!bio) {
      setStatus("[data-bio-main]", '<div class="border border-dashed border-slate-300 rounded-lg p-6 text-sm text-slate-500">Bio content not found.</div>');
      return;
    }

    if (bio.pageTitle) {
      document.title = bio.pageTitle;
    }

    var headerTarget = clearTarget("[data-bio-header]");
    var mainTarget = clearTarget("[data-bio-main]");
    var footerTarget = clearTarget("[data-bio-footer]");

    if (headerTarget) headerTarget.appendChild(renderHeader(bio));
    if (mainTarget) mainTarget.appendChild(renderMain(bio));
    if (footerTarget) footerTarget.appendChild(renderFooter(bio));

    window.__bioPageReady = true;
    var event = new CustomEvent("bio:loaded", { detail: { file: bioFile } });
    document.dispatchEvent(event);
    window.dispatchEvent(event);
  }

  function initBioRenderer() {
    var main = document.querySelector("[data-bio-main]");
    if (main) {
      main.innerHTML = '<div class="text-sm text-slate-500">Loading bio...</div>';
    }

    fetch("data/bios.json?v=20260619a")
      .then(function (response) {
        if (!response.ok) throw new Error("Failed to load data/bios.json");
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