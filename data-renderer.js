class DataRenderer {
  constructor(contentUrl = 'content.json') {
    this.content = null;
    this.currentLang = this.getStoredLanguage();
    this.loadContent(contentUrl);
  }

  async loadContent(url) {
    try {
      const response = await fetch(url);
      this.content = await response.json();
      this.render();
    } catch (error) {
      console.error('Failed to load content:', error);
    }
  }

  getStoredLanguage() {
    const stored = localStorage.getItem('ada-site-language');
    return stored === 'de' ? 'de' : 'en';
  }

  setLanguage(lang) {
    this.currentLang = lang;
    localStorage.setItem('ada-site-language', lang);
    document.documentElement.lang = lang;
    document.body.setAttribute('data-lang', lang);
    this.updateAllText();
  }

  t(text) {
    if (!text) return '';
    if (typeof text === 'string') return text;
    return text[this.currentLang] || text.en || '';
  }

  render() {
    this.setupLanguageSwitcher();
    this.updateAllText();
  }

  setupLanguageSwitcher() {
    if (document.getElementById('ada-language-switcher')) return;

    const style = document.createElement('style');
    style.id = 'ada-language-style';
    style.textContent = `
      #ada-language-switcher { 
        position: fixed; 
        top: 0.75rem; 
        right: 1rem; 
        z-index: 70; 
        display: inline-flex; 
        gap: 0.25rem; 
        padding: 0.25rem; 
        background: rgba(255,255,255,0.92); 
        border: 1px solid #cbd5e1; 
        border-radius: 9999px; 
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12); 
        backdrop-filter: blur(10px);
      }
      #ada-language-switcher button { 
        border: 0; 
        background: transparent; 
        color: #475569; 
        font-size: 11px; 
        font-weight: 700; 
        letter-spacing: 0.12em; 
        text-transform: uppercase; 
        padding: 0.45rem 0.7rem; 
        border-radius: 9999px; 
        cursor: pointer;
        transition: all 0.2s ease;
      }
      #ada-language-switcher button:hover { 
        background: #f1f5f9; 
        color: #0f172a; 
      }
      #ada-language-switcher button.is-active { 
        background: #dc2626; 
        color: white; 
      }
      body[data-lang='en'] .more-projects-label::after { content: 'Show More'; }
      body[data-lang='en'] #more-projects-toggle:checked + .more-projects-label::after { content: 'Show Less'; }
      body[data-lang='de'] .more-projects-label::after { content: 'Mehr anzeigen'; }
      body[data-lang='de'] #more-projects-toggle:checked + .more-projects-label::after { content: 'Weniger anzeigen'; }
    `;
    document.head.appendChild(style);

    const switcher = document.createElement('div');
    switcher.id = 'ada-language-switcher';
    switcher.setAttribute('aria-label', 'Language switcher');
    switcher.innerHTML = '<button type="button" data-lang="en">EN</button><button type="button" data-lang="de">DE</button>';
    
    switcher.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-lang]');
      if (btn) {
        this.setLanguage(btn.dataset.lang);
        this.updateSwitcher();
      }
    });

    document.body.appendChild(switcher);
    this.updateSwitcher();
  }

  updateSwitcher() {
    document.querySelectorAll('#ada-language-switcher button').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.lang === this.currentLang);
    });
  }

  updateAllText() {
    // Update page title
    if (this.content.site) {
      document.title = this.t(this.content.site.title);
    }

    // Update navigation
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach((link, index) => {
      const navItem = this.content.navigation[index];
      if (navItem) {
        link.textContent = this.t(navItem.label);
        link.href = navItem.href;
      }
    });

    // Update hero section
    this.updateHeroSection();
    
    // Update research fields
    this.updateResearchFields();
    
    // Update projects
    this.updateProjectCards();
    this.renderProjectsActiveGrid();
    this.renderProjectsArchiveGrid();
    this.renderActiveProjectDetails();

    // Render archive detail pages from JSON on projects page
    this.renderArchiveProjectDetails();
    
    // Update news
    this.updateNews();
    
    // Update footer
    this.updateFooter();
  }

  escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  formatMultilineText(value) {
    return this.escapeHtml(value).replace(/\n/g, '<br>');
  }

  getMetaLabel(key) {
    const labels = {
      contact: { en: 'Contact', de: 'Ansprechperson' },
      duration: { en: 'Duration', de: 'Projektdauer' },
      method: { en: 'Method', de: 'Methode' },
      methods: { en: 'Methods', de: 'Methoden' }
    };
    const fallback = {
      en: key.charAt(0).toUpperCase() + key.slice(1),
      de: key.charAt(0).toUpperCase() + key.slice(1)
    };
    return this.t(labels[key] || fallback);
  }

  renderArchiveProjectDetails() {
    const container = document.getElementById('archive-project-details');
    if (!container || !Array.isArray(this.content?.projects)) return;

    const archiveProjects = this.content.projects.filter(project => project.status === 'archive');
    const backLabel = this.currentLang === 'de' ? 'Zurück zu Projekten' : 'Back to Projects';
    const contributorLabel = this.currentLang === 'de' ? 'Mitwirkende' : 'Contributors';

    container.innerHTML = archiveProjects.map((project) => {
      const details = project.details || {};
      const paragraphs = Array.isArray(details.paragraphs) ? details.paragraphs : [];
      const meta = details.meta && typeof details.meta === 'object' ? details.meta : {};
      const metaRows = Object.entries(meta)
        .map(([key, value]) => {
          const label = this.getMetaLabel(key);
          return `<p class="text-sm text-slate-600"><strong>${this.escapeHtml(label)}:</strong> ${this.formatMultilineText(this.t(value))}</p>`;
        })
        .join('');

      const detailsSubtitle = this.t(details.subtitle || project.subtitle || '');
      const subtitleHtml = detailsSubtitle
        ? `<p class="text-sm text-slate-500 uppercase tracking-widest font-bold mb-4">${this.escapeHtml(detailsSubtitle)}</p>`
        : '';
      const metaHtml = metaRows
        ? `<div class="border-l-4 border-slate-400 pl-6 my-6 py-2 bg-slate-50 rounded-r">${metaRows}</div>`
        : '';
      const creditsHtml = details.credits
        ? `<div class="project-credit"><p class="text-sm text-slate-700 mb-0">${this.escapeHtml(contributorLabel)}: ${this.escapeHtml(details.credits)}.</p></div>`
        : '';

      return `
        <section id="${this.escapeHtml(project.id)}" class="page-section scroll-mt-10 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <a href="projects.html" class="inline-block text-xs font-bold text-blue-600 uppercase border border-blue-600 px-4 py-2 rounded mb-6 hover:bg-blue-50 transition">&larr; ${this.escapeHtml(backLabel)}</a>
          <h2 class="text-4xl font-bold mb-4 uppercase tracking-tight">${this.escapeHtml(this.t(project.title))}</h2>
          <div class="prose-text">
            ${subtitleHtml}
            ${paragraphs.map((paragraph) => `<p>${this.formatMultilineText(this.t(paragraph))}</p>`).join('')}
            ${metaHtml}
            ${creditsHtml}
          </div>
        </section>
      `;
    }).join('');
  }

  renderActiveProjectDetails() {
    const container = document.getElementById('active-project-details');
    if (!container || !Array.isArray(this.content?.projects)) return;

    const activeProjects = this.content.projects.filter(project => project.status === 'active');
    const backLabel = this.currentLang === 'de' ? 'Zurück zu Projekten' : 'Back to Projects';
    const contributorLabel = this.currentLang === 'de' ? 'Mitwirkende' : 'Contributors';

    container.innerHTML = activeProjects.map((project) => {
      const details = project.details || {};
      const paragraphs = Array.isArray(details.paragraphs) ? details.paragraphs : [];
      const meta = details.meta && typeof details.meta === 'object' ? details.meta : {};
      const links = Array.isArray(details.links) ? details.links : [];
      const metaRows = Object.entries(meta)
        .map(([key, value]) => {
          const label = this.getMetaLabel(key);
          return `<p class="text-sm text-slate-600"><strong>${this.escapeHtml(label)}:</strong> ${this.formatMultilineText(this.t(value))}</p>`;
        })
        .join('');
      const linksHtml = links.length
        ? `<div class="flex flex-wrap gap-3 mt-4">${links.map((link) => `<a href="${this.escapeHtml(link.href || '#')}" target="_blank" rel="noopener noreferrer" class="inline-block text-xs font-bold uppercase tracking-widest text-blue-600 border border-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition">${this.escapeHtml(this.t(link.label))}</a>`).join('')}</div>`
        : '';
      const subtitle = this.t(details.subtitle || project.subtitle || '');
      const subtitleHtml = subtitle
        ? `<p class="text-lg text-slate-700 font-medium italic mb-3">${this.escapeHtml(subtitle)}</p>`
        : '';
      const metaHtml = metaRows
        ? `<div class="border-l-4 border-slate-400 pl-6 my-6 py-2 bg-slate-50 rounded-r">${metaRows}</div>`
        : '';
      const creditsHtml = details.credits
        ? `<div class="project-credit"><p class="text-sm text-slate-700 mb-0">${this.escapeHtml(contributorLabel)}: ${this.escapeHtml(details.credits)}.</p></div>`
        : '';

      return `
        <section id="${this.escapeHtml(project.id)}" class="page-section scroll-mt-10 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <a href="projects.html" class="inline-block text-xs font-bold text-blue-600 uppercase border border-blue-600 px-4 py-2 rounded mb-6 hover:bg-blue-50 transition">&larr; ${this.escapeHtml(backLabel)}</a>
          <h2 class="text-3xl font-bold mb-3 uppercase tracking-tight">${this.escapeHtml(this.t(project.title))}</h2>
          <div class="prose-text">
            ${subtitleHtml}
            ${paragraphs.map((paragraph) => `<p>${this.formatMultilineText(this.t(paragraph))}</p>`).join('')}
            ${metaHtml}
            ${linksHtml}
            ${creditsHtml}
          </div>
        </section>
      `;
    }).join('');
  }

  renderProjectsActiveGrid() {
    const grid = document.getElementById('projects-active-grid');
    if (!grid || !Array.isArray(this.content?.projects)) return;

    const activeProjects = this.content.projects.filter(project => project.status === 'active');

    grid.innerHTML = activeProjects.map((project) => {
      const title = this.t(project.shortTitle || project.title);
      const description = this.t(project.description || '');

      return `
        <a href="#${this.escapeHtml(project.id)}" class="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 group hover:shadow-xl transition duration-300 block">
          <div class="h-56 bg-slate-200 overflow-hidden relative">
            <img src="${this.escapeHtml(project.image || '')}" alt="${this.escapeHtml(project.altText || this.t(project.title))}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
            <div class="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase">${this.escapeHtml(this.t(project.badge))}</div>
          </div>
          <div class="p-8">
            <h4 class="text-xl font-bold mb-3">${this.escapeHtml(title)}</h4>
            <p class="text-slate-600 text-sm leading-relaxed">${this.escapeHtml(description)}</p>
          </div>
        </a>
      `;
    }).join('');
  }

  renderProjectsArchiveGrid() {
    const grid = document.getElementById('projects-archive-grid');
    if (!grid || !Array.isArray(this.content?.projects)) return;

    const archiveProjects = this.content.projects.filter(project => project.status === 'archive');
    const placeholderLabel = this.currentLang === 'de' ? 'LWS Archiv' : 'LWS Archive';

    grid.innerHTML = archiveProjects.map((project) => {
      const title = this.t(project.shortTitle || project.title);
      const description = this.t(project.description || '');
      const imageBlock = project.image
        ? `<div class="h-36 bg-slate-200 overflow-hidden border-b border-slate-200"><img src="${this.escapeHtml(project.image)}" alt="${this.escapeHtml(this.t(project.title))}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500"></div>`
        : `<div class="h-36 bg-slate-100 flex items-center justify-center border-b border-slate-200"><span class="text-xs font-bold uppercase tracking-widest text-slate-500">${this.escapeHtml(placeholderLabel)}</span></div>`;

      return `
        <a href="#${this.escapeHtml(project.id)}" class="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 group hover:shadow-xl transition duration-300 block">
          ${imageBlock}
          <div class="p-6">
            <h4 class="text-lg font-bold">${this.escapeHtml(title)}</h4>
            <p class="text-sm text-slate-600 mt-2">${this.escapeHtml(description)}</p>
          </div>
        </a>
      `;
    }).join('');
  }

  updateHeroSection() {
    if (!this.content.hero) return;

    const heroH2 = document.querySelector('header h2.text-red-600');
    if (heroH2) heroH2.textContent = this.t(this.content.hero.tagline);

    const heroH1 = document.querySelector('header h1');
    if (heroH1) heroH1.innerHTML = this.t(this.content.hero.title);

    const heroP = document.querySelector('header p.text-xl');
    if (heroP) heroP.textContent = this.t(this.content.hero.description);

    const heroButtons = document.querySelectorAll('header .flex.flex-wrap.gap-4 a');
    this.content.hero.buttons.forEach((btn, i) => {
      if (heroButtons[i]) {
        heroButtons[i].textContent = this.t(btn.label);
        heroButtons[i].href = btn.href;
      }
    });
  }

  updateResearchFields() {
    const section = document.querySelector('section.py-16.border-t');
    if (!section) return;

    const title = section.querySelector('h2');
    if (title) title.textContent = this.currentLang === 'de' ? 'Forschungsfelder' : 'Research Fields';

    const cards = section.querySelectorAll('.grid > div');
    this.content.researchFields.forEach((field, i) => {
      if (!cards[i]) return;
      
      const h3 = cards[i].querySelector('h3');
      const p1 = cards[i].querySelector('p.text-sm');
      const p2 = cards[i].querySelector('p.text-slate-700');
      const p3 = cards[i].querySelectorAll('p.text-xs')[0];
      const a = cards[i].querySelector('a');

      if (h3) h3.textContent = this.t(field.title);
      if (p1) p1.textContent = this.t(field.subtitle);
      if (p2) p2.textContent = this.t(field.description);
      if (p3) p3.textContent = this.t(field.leadLabel);
      if (a) {
        a.textContent = field.lead + ' →';
        a.href = field.leadHref;
      }
    });
  }

  updateProjectCards() {
    const homeActiveGrid = document.getElementById('home-active-project-grid');
    if (homeActiveGrid && Array.isArray(this.content?.projects)) {
      const activeProjects = this.content.projects.filter(project => project.status === 'active').slice(0, 6);
      homeActiveGrid.innerHTML = activeProjects.map((project) => `
        <a href="projects.html#${this.escapeHtml(project.id)}" class="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 group hover:shadow-xl transition duration-300 block">
          <div class="h-56 bg-slate-200 overflow-hidden relative">
            <img src="${this.escapeHtml(project.image || '')}" alt="${this.escapeHtml(project.altText || this.t(project.title))}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
            <div class="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase">${this.escapeHtml(this.t(project.badge))}</div>
          </div>
          <div class="p-8">
            <h4 class="text-xl font-bold mb-3">${this.escapeHtml(this.t(project.shortTitle || project.title))}</h4>
            <p class="text-slate-600 text-sm mb-4 leading-relaxed">${this.escapeHtml(this.t(project.description || ''))}</p>
            <div class="text-xs text-slate-400 font-mono">${this.escapeHtml(this.t(project.meta || ''))}</div>
          </div>
        </a>
      `).join('');
    }

    const homeArchiveGrid = document.getElementById('home-archive-project-grid');
    if (homeArchiveGrid && Array.isArray(this.content?.projects)) {
      const archiveProjects = this.content.projects.filter(project => project.status === 'archive');
      const placeholderLabel = this.currentLang === 'de' ? 'LWS Archiv' : 'LWS Archive';
      homeArchiveGrid.innerHTML = archiveProjects.map((project) => {
        const imageBlock = project.image
          ? `<div class="h-40 bg-slate-200 overflow-hidden relative border-b border-slate-200"><img src="${this.escapeHtml(project.image)}" alt="${this.escapeHtml(this.t(project.title))}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500"></div>`
          : `<div class="h-40 bg-slate-100 flex items-center justify-center border-b border-slate-200"><span class="text-[11px] font-bold uppercase tracking-widest text-slate-500">${this.escapeHtml(placeholderLabel)}</span></div>`;

        return `
          <a href="projects.html#${this.escapeHtml(project.id)}" class="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 group hover:shadow-xl transition duration-300 block">
            ${imageBlock}
            <div class="p-8"><h4 class="text-xl font-bold mb-2">${this.escapeHtml(this.t(project.shortTitle || project.title))}</h4><p class="text-sm text-slate-600">${this.escapeHtml(this.t(project.description || ''))}</p></div>
          </a>
        `;
      }).join('');
    }
  }

  updateNews() {
    if (!this.content.news || !this.content.news[0]) return;
    const news = this.content.news[0];
    const section = document.querySelector('#news');
    if (!section) return;

    const badge = section.querySelector('.inline-block');
    const title = section.querySelector('h3');
    const desc = section.querySelector('p.text-slate-600');
    const link = section.querySelector('a.text-blue-600');

    if (badge) badge.textContent = this.t(news.badge);
    if (title) title.textContent = this.t(news.title);
    if (desc) desc.textContent = this.t(news.description);
    if (link) {
      link.textContent = this.t(news.linkText);
      link.href = news.link;
    }
  }

  updateFooter() {
    const footer = document.querySelector('footer');
    if (!footer) return;

    const titles = footer.querySelectorAll('h5');
    const descriptions = footer.querySelectorAll('p.text-slate-400.leading-relaxed');

    if (titles[0]) titles[0].textContent = this.currentLang === 'de' ? 'ADA Institut' : 'ADA Institute';
    if (titles[1]) titles[1].textContent = this.currentLang === 'de' ? 'Standort' : 'Location';
    if (titles[2]) titles[2].textContent = this.currentLang === 'de' ? 'Kontakt' : 'Contact';

    if (descriptions[0]) {
      const text = this.currentLang === 'de' 
        ? 'Institut für Angewandte Datenwissenschaft und KI. <br>Teil der Fernfachhochschule Schweiz (FFHS).'
        : 'Institute of Applied Datascience and AI. <br>Part of the Fernfachhochschule Schweiz (FFHS).';
      descriptions[0].innerHTML = text;
    }
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  window.contentRenderer = new DataRenderer('content.json');
});
