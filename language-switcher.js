(function () {
    var STORAGE_KEY = "ada-site-language";
    var DEFAULT_LANG = "en";

    function getCurrentPage() {
        var path = window.location.pathname.split("/").pop();
        return path || "ada_better.html";
    }

    function getStoredLanguage() {
        var stored = window.localStorage.getItem(STORAGE_KEY);
        return stored === "de" ? "de" : DEFAULT_LANG;
    }

    function setStoredLanguage(lang) {
        window.localStorage.setItem(STORAGE_KEY, lang);
    }

    function setText(selector, value) {
        document.querySelectorAll(selector).forEach(function (node) {
            node.textContent = value;
        });
    }

    function setHTML(selector, value) {
        document.querySelectorAll(selector).forEach(function (node) {
            node.innerHTML = value;
        });
    }

    function setAttr(selector, attribute, value) {
        document.querySelectorAll(selector).forEach(function (node) {
            node.setAttribute(attribute, value);
        });
    }

    function setNodeText(node, value) {
        if (node) {
            node.textContent = value;
        }
    }

    function setNodeHTML(node, value) {
        if (node) {
            node.innerHTML = value;
        }
    }

    function pick(texts, lang) {
        return lang === "de" ? texts.de : texts.en;
    }

    function injectStyles() {
        if (document.getElementById("ada-language-style")) {
            return;
        }

        var style = document.createElement("style");
        style.id = "ada-language-style";
        style.textContent = ""
            + "#ada-language-switcher { position: fixed; top: 0.75rem; right: 1rem; z-index: 70; display: inline-flex; gap: 0.25rem; padding: 0.25rem; background: rgba(255,255,255,0.92); border: 1px solid #cbd5e1; border-radius: 9999px; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12); backdrop-filter: blur(10px); }"
            + "#ada-language-switcher button { border: 0; background: transparent; color: #475569; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; padding: 0.45rem 0.7rem; border-radius: 9999px; cursor: pointer; }"
            + "#ada-language-switcher button:hover { background: #f1f5f9; color: #0f172a; }"
            + "#ada-language-switcher button.is-active { background: #dc2626; color: white; }"
            + "body[data-lang='en'] .more-projects-label::after { content: 'Show More'; }"
            + "body[data-lang='en'] #more-projects-toggle:checked + .more-projects-label::after { content: 'Show Less'; }"
            + "body[data-lang='de'] .more-projects-label::after { content: 'Mehr anzeigen'; }"
            + "body[data-lang='de'] #more-projects-toggle:checked + .more-projects-label::after { content: 'Weniger anzeigen'; }"
            + "@media (max-width: 640px) { #ada-language-switcher { top: 0.5rem; right: 0.5rem; } }";
        document.head.appendChild(style);
    }

    function injectSwitcher(currentLang) {
        if (document.getElementById("ada-language-switcher")) {
            return;
        }

        var switcher = document.createElement("div");
        switcher.id = "ada-language-switcher";
        switcher.setAttribute("aria-label", "Language switcher");
        switcher.innerHTML = ""
            + '<button type="button" data-lang="en">EN</button>'
            + '<button type="button" data-lang="de">DE</button>';

        switcher.addEventListener("click", function (event) {
            var button = event.target.closest("button[data-lang]");
            if (!button) {
                return;
            }
            var lang = button.getAttribute("data-lang");
            setStoredLanguage(lang);
            applyLanguage(lang);
        });

        document.body.appendChild(switcher);
        updateSwitcher(currentLang);
    }

    function updateSwitcher(lang) {
        document.querySelectorAll("#ada-language-switcher button").forEach(function (button) {
            button.classList.toggle("is-active", button.getAttribute("data-lang") === lang);
        });
    }

    function applyCommonTranslations(lang) {
        document.documentElement.lang = lang;
        document.body.setAttribute("data-lang", lang);

        var labels = {
            about: pick({ en: "About", de: "Über uns" }, lang),
            projects: pick({ en: "Projects", de: "Projekte" }, lang),
            team: pick({ en: "Team", de: "Team" }, lang),
            publications: pick({ en: "Publications", de: "Publikationen" }, lang),
            news: pick({ en: "News", de: "Aktuelles" }, lang),
            contact: pick({ en: "Contact", de: "Kontakt" }, lang)
        };

        setText('nav a[href="ada_better.html#home-view"]', labels.about);
        setText('nav a[href="projects.html"]', labels.projects);
        setText('nav a[href="team.html"]', labels.team);
        setText('nav a[href="publications.html"]', labels.publications);
        setText('nav a[href="ada_better.html#news"]', labels.news);
        setText('nav a[href="ada_better.html#contact"]', labels.contact);

        setText('.page-section > a.inline-block', pick({ en: '← Back to Projects', de: '← Zurück zu den Projekten' }, lang));
    }

    function applyAdaBetterTranslations(lang) {
        document.title = pick({
            en: "ADA Institute | Applied Data Science and AI",
            de: "ADA Institut | Angewandte Datenwissenschaft und KI"
        }, lang);

        setText('header h2.text-red-600', pick({ en: 'Formerly LWS', de: 'Ehemals LWS' }, lang));
        setHTML('header h1.text-5xl', pick({
            en: 'Institute of <span class="gradient-text">Applied Data Science &amp; AI</span>',
            de: 'Institut für <span class="gradient-text">Angewandte Datenwissenschaft &amp; KI</span>'
        }, lang));
        setText('header p.text-xl', pick({
            en: 'Bridging the gap between academic research and industry application. We transform complex data into actionable intelligence.',
            de: 'Wir überbrücken die Lücke zwischen akademischer Forschung und industrieller Anwendung. Wir verwandeln komplexe Daten in umsetzbare Erkenntnisse für Energiesysteme, wissenschaftliche Arbeitsabläufe und nachhaltige Innovation.'
        }, lang));

        var heroButtons = document.querySelectorAll('header .flex.flex-wrap.gap-4 a');
        setNodeText(heroButtons[0], pick({ en: 'Our Research', de: 'Unsere Forschung' }, lang));
        setNodeText(heroButtons[1], pick({ en: 'News', de: 'Aktuelles' }, lang));
        setNodeText(heroButtons[2], pick({ en: 'Our Team', de: 'Unser Team' }, lang));

        setText('section.py-16.border-t.border-slate-200 > div > h2', pick({ en: 'Research Fields', de: 'Forschungsfelder' }, lang));

        var fieldCards = document.querySelectorAll('section.py-16.border-t.border-slate-200 .grid > div');
        if (fieldCards[0]) {
            setNodeText(fieldCards[0].querySelector('h3'), 'GeoHealth Analytics');
            setNodeText(fieldCards[0].querySelector('p.text-sm'), pick({ en: 'Research Field', de: 'Forschungsfeld' }, lang));
            setNodeHTML(fieldCards[0].querySelector('p.text-slate-700'), pick({
                en: 'Focus on geospatial analysis and health data integration, combining geographic information systems with advanced data science methods to address health-related challenges.',
                de: 'Fokus auf Geodatenanalyse und die Integration von Gesundheitsdaten, wobei geografische Informationssysteme mit fortgeschrittenen Data-Science-Methoden kombiniert werden, um gesundheitsbezogene Herausforderungen zu bearbeiten.'
            }, lang));
            setNodeText(fieldCards[0].querySelector('p.text-xs'), pick({ en: 'Field Lead', de: 'Leitung' }, lang));
        }
        if (fieldCards[1]) {
            setNodeText(fieldCards[1].querySelector('h3'), pick({ en: 'Energy, Environment & Materials', de: 'Energie, Umwelt & Materialien' }, lang));
            setNodeText(fieldCards[1].querySelector('p.text-sm'), pick({ en: 'Research Field', de: 'Forschungsfeld' }, lang));
            setNodeHTML(fieldCards[1].querySelector('p.text-slate-700'), pick({
                en: 'Dedicated to research on energy systems, environmental sustainability, and material science. Applications of AI and data science support resource optimization and technical innovation.',
                de: 'Fokussiert auf Forschung zu Energiesystemen, ökologischer Nachhaltigkeit und Materialwissenschaft. Anwendungen von KI und Datenwissenschaft unterstützen Ressourcenoptimierung und technische Innovation.'
            }, lang));
            setNodeText(fieldCards[1].querySelector('p.text-xs'), pick({ en: 'Field Lead', de: 'Leitung' }, lang));
        }
        if (fieldCards[2]) {
            setNodeText(fieldCards[2].querySelector('h3'), pick({ en: 'Others', de: 'Weitere' }, lang));
            setNodeText(fieldCards[2].querySelector('p.text-sm'), pick({ en: 'Exploratory Research', de: 'Explorative Forschung' }, lang));
            setNodeHTML(fieldCards[2].querySelector('p.text-slate-700'), pick({
                en: 'AI and data science increasingly shape work far beyond our core research fields. We explore applications in scientific discovery, environmental monitoring, robotics, RAG systems, and other emerging technologies wherever innovative solutions are needed.',
                de: 'KI und Datenwissenschaft prägen zunehmend Arbeitsfelder weit über unsere Kernforschungsbereiche hinaus. Wir untersuchen Anwendungen in wissenschaftlicher Entdeckung, Umweltmonitoring, Robotik, RAG-Systemen und weiteren aufkommenden Technologien, überall dort, wo innovative Lösungen gefragt sind.'
            }, lang));
        }

        setText('#projects h2.text-4xl', pick({ en: 'Current Research & Projects', de: 'Aktuelle Forschung & Projekte' }, lang));
        setText('#projects p.text-slate-500.mt-2', pick({
            en: 'Pioneering solutions in Deep Learning and Retrieval-Augmented Generation.',
            de: 'Wegweisende Lösungen in Deep Learning und Retrieval-Augmented Generation.'
        }, lang));

        var projectCards = document.querySelectorAll('#projects .grid > a');
        var cardTranslations = [
            { badge: { en: 'Renewable Energy', de: 'Erneuerbare Energien' }, desc: { en: 'Deep Learning approach to photovoltaics reliability. Utilizing multispectral imaging (UV, IR, Visible) and Vision Transformers to detect cell-level failures automatically.', de: 'Deep-Learning-Ansatz für die Zuverlässigkeit von Photovoltaik. Multispektrale Bildgebung (UV, IR, sichtbar) und Vision Transformer erkennen Zellfehler automatisch.' }, meta: { en: 'Partner: SUPSI / SFOE', de: 'Partner: SUPSI / SFOE' } },
            { badge: { en: 'Smart Agrotech', de: 'Smarte Agrartechnik' }, desc: { en: 'Predicting potato sprouting to optimize tuber storage. Analyzing electrophysiological plant signals with ML to reduce chemical use and food waste.', de: 'Vorhersage der Kartoffelkeimung zur Optimierung der Lagerung. Analyse elektrophysiologischer Pflanzensignale mit ML zur Reduktion von Chemikalieneinsatz und Food Waste.' }, meta: { en: 'Partner: Agroscope / Vivent', de: 'Partner: Agroscope / Vivent' } },
            { badge: { en: 'Civil Engineering', de: 'Bauingenieurwesen' }, desc: { en: 'Implementing computer vision for quality control and structural health monitoring in timber construction, ensuring the sustainability of modern wood-based architecture.', de: 'Einsatz von Computer Vision für Qualitätskontrolle und Structural-Health-Monitoring im Holzbau zur Unterstützung nachhaltiger moderner Architektur.' }, meta: { en: 'Domain: Industrial Vision', de: 'Bereich: Industrielle Bildverarbeitung' } },
            { badge: { en: 'Astronomy AI', de: 'KI für wissenschaftliche Systeme' }, desc: { en: 'Implementing a Retrieval-Augmented Generation (RAG) system to allow experts to query complex observatory documentation and technical logs using natural language.', de: 'Implementierung eines Retrieval-Augmented-Generation-Systems (RAG), damit Fachpersonen komplexe Dokumentation und technische Protokolle in natürlicher Sprache abfragen können.' }, meta: { en: 'Lead: Dr. Danuta Paraficz', de: 'Leitung: Dr. Danuta Paraficz' } },
            { badge: { en: 'Bio-Acoustics', de: 'Bioakustik' }, desc: { en: 'Advanced acoustic monitoring system using CNNs to identify bird species in Swiss alpine regions, supporting biodiversity conservation through automated data analysis.', de: 'Fortgeschrittenes akustisches Monitoringsystem mit CNNs zur Identifikation von Vogelarten in Schweizer Alpenregionen und zur Unterstützung des Biodiversitätsschutzes.' }, meta: { en: 'Domain: Environmental Data Science', de: 'Bereich: Umwelt-Datenwissenschaft' } },
            { badge: { en: 'Talent AI', de: 'KI für Talente' }, desc: { en: 'New platform for automatic skills extraction and profile validation to identify talents and support recruitment workflows.', de: 'Neue Plattform zur automatischen Extraktion von Kompetenzen und zur Profilvalidierung, um Talente zu identifizieren und Recruiting-Prozesse zu unterstützen.' }, meta: { en: 'Domain: Talent Intelligence', de: 'Bereich: Talent Intelligence' } }
        ];
        projectCards.forEach(function (card, index) {
            var config = cardTranslations[index];
            if (!config) {
                return;
            }
            setNodeText(card.querySelector('.absolute'), pick(config.badge, lang));
            setNodeText(card.querySelector('p.text-slate-600'), pick(config.desc, lang));
            setNodeText(card.querySelector('.text-xs.text-slate-400'), pick(config.meta, lang));
        });

        setText('#news .inline-block', pick({ en: 'Winner: Hackathon 2024', de: 'Gewinner: Hackathon 2024' }, lang));
        setText('#news h3.text-3xl', pick({ en: 'ADA Team Wins Big for Milano-Cortina 2026', de: 'ADA-Team gewinnt beim Milano-Cortina-2026-Hackathon' }, lang));
        setText('#news p.text-slate-600', pick({
            en: 'Under the leadership of Dr. Danuta Paraficz, our team of students developed a strong application concept presented for the Olympic Winter Games. The project highlights our commitment to real-world AI impact on an international stage.',
            de: 'Unter der Leitung von Dr. Danuta Paraficz entwickelte unser Studierendenteam ein starkes Anwendungskonzept für die Olympischen Winterspiele. Das Projekt zeigt unser Engagement für reale KI-Wirkung auf internationaler Bühne.'
        }, lang));
        setText('#news a.text-blue-600', pick({ en: 'Read the full story →', de: 'Zur ganzen Meldung →' }, lang));

        setText('footer h5.text-xl', pick({ en: 'ADA Institute', de: 'ADA Institut' }, lang));
        var footerLabels = document.querySelectorAll('footer h5.text-sm');
        setNodeText(footerLabels[0], pick({ en: 'Location', de: 'Standort' }, lang));
        setNodeText(footerLabels[1], pick({ en: 'Contact', de: 'Kontakt' }, lang));
        setText('footer p.text-slate-400.leading-relaxed', pick({ en: 'Institute of Applied Datascience and AI. <br>Part of the Fernfachhochschule Schweiz (FFHS).', de: 'Institut für Angewandte Datenwissenschaft und KI. <br>Teil der Fernfachhochschule Schweiz (FFHS).' }, lang));
    }

    function applyProjectsTranslations(lang) {
        document.title = pick({ en: 'ADA Shared Projects', de: 'ADA Gemeinsame Projekte' }, lang);
        setText('header h1.text-3xl', pick({ en: 'Shared ADA Projects', de: 'Gemeinsame ADA-Projekte' }, lang));
        setAttr('header a[aria-label="ADA Projects"]', 'aria-label', pick({ en: 'ADA Projects', de: 'ADA-Projekte' }, lang));
        setText('#projects-home h2.text-4xl', pick({ en: 'Current Research & Projects', de: 'Aktuelle Forschung & Projekte' }, lang));
        setText('#projects-home p.text-slate-500', pick({ en: 'Pioneering solutions in Deep Learning, Computer Vision, and Retrieval-Augmented Generation.', de: 'Wegweisende Lösungen in Deep Learning, Computer Vision und Retrieval-Augmented Generation.' }, lang));
        setText('#projects-home > div:last-child h3.text-2xl', pick({ en: 'Archive Projects', de: 'Archivprojekte' }, lang));

        var homeCards = document.querySelectorAll('#projects-home .grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3.gap-10 > a');
        var homeCardTranslations = [
            { badge: { en: 'Renewable Energy', de: 'Erneuerbare Energien' }, title: { en: 'Project EAGLE', de: 'Projekt EAGLE' }, desc: { en: 'Deep Learning approach to photovoltaics reliability.', de: 'Deep-Learning-Ansatz für die Zuverlässigkeit von Photovoltaik.' } },
            { badge: { en: 'Smart Agrotech', de: 'Smarte Agrartechnik' }, title: { en: 'Project PRONTO', de: 'Projekt PRONTO' }, desc: { en: 'ML forecasting of potato sprouting for sustainable storage.', de: 'ML-gestützte Prognose der Kartoffelkeimung für nachhaltige Lagerung.' } },
            { badge: { en: 'Civil Engineering', de: 'Bauingenieurwesen' }, title: { en: 'Holzbau AI', de: 'Holzbau KI' }, desc: { en: 'Computer vision for quality control in timber construction.', de: 'Computer Vision für Qualitätskontrolle im Holzbau.' } },
            { badge: { en: 'Astronomy AI', de: 'KI für wissenschaftliche Systeme' }, title: { en: 'RAG for Nordic Optical Telescope', de: 'RAG für das Nordic Optical Telescope' }, desc: { en: 'Retrieval-augmented answers over observatory knowledge.', de: 'Retrieval-gestützte Antworten über Observatoriumswissen.' } },
            { badge: { en: 'Bio-Acoustics', de: 'Bioakustik' }, title: { en: 'Soundscapes / BirdNET', de: 'Soundscapes / BirdNET' }, desc: { en: 'Automated biodiversity analytics from audio data.', de: 'Automatisierte Biodiversitätsanalyse aus Audiodaten.' } }
        ];
        homeCards.forEach(function (card, index) {
            var config = homeCardTranslations[index];
            if (!config) {
                return;
            }
            setNodeText(card.querySelector('.absolute'), pick(config.badge, lang));
            setNodeText(card.querySelector('h4'), pick(config.title, lang));
            setNodeText(card.querySelector('p.text-slate-600'), pick(config.desc, lang));
        });

        document.querySelectorAll('#projects-home span').forEach(function (node) {
            if (node.textContent.trim() === 'LWS Archive' || node.textContent.trim() === 'LWS-Archiv') {
                node.textContent = pick({ en: 'LWS Archive', de: 'LWS-Archiv' }, lang);
            }
        });

        var sectionTitles = {
            eagle: { en: 'Project EAGLE', de: 'Projekt EAGLE' },
            pronto: { en: 'Project PRONTO', de: 'Projekt PRONTO' },
            rag: { en: 'RAG for Nordic Optical Telescope', de: 'RAG für das Nordic Optical Telescope' },
            birdnet: { en: 'BirdNet Classification', de: 'BirdNet-Klassifikation' },
            holzbau: { en: 'Holzbau AI', de: 'Holzbau KI' },
            stack4ffhs: { en: 'STACK4FFHS', de: 'STACK4FFHS' },
            'graph-measure': { en: 'Measure Based on Graph Automorphism', de: 'Maß auf Basis von Graphautomorphismen' },
            suva2: { en: 'SUVA 2 (Service Project)', de: 'SUVA 2 (Dienstleistungsprojekt)' },
            'ded-in718': { en: 'Multi-physics Platform for DED', de: 'Multiphysik-Plattform für DED' },
            'trigger-homecare': { en: 'Trigger Tools & Algorithms in Homecare', de: 'Trigger-Tools & Algorithmen in der ambulanten Pflege' },
            'eisen-snf': { en: 'Optimization of Oral Iron Supplementation', de: 'Optimierung der oralen Eisen-Supplementierung' },
            skillsfinder: { en: 'SkillsFinder', de: 'SkillsFinder' },
            rasplan: { en: 'IP-EE: RASPLAN', de: 'IP-EE: RASPLAN' },
            'customs-engine': { en: 'INNO-SBM: Customs Clearance Engine', de: 'INNO-SBM: Zollabfertigungs-Engine' },
            trends: { en: 'TrEndS: Trend Discovery & Students@Risk', de: 'TrEndS: Trendsentdecker & Students@Risk' },
            'nn-pdes': { en: 'Neural Networks as FEA Alternative', de: 'Neuronale Netze als FEA-Alternative' },
            'e-assessment': { en: 'E-Assessment: AI-Proctored Exams', de: 'E-Assessment: KI-gestützte Prüfungen' },
            'smar-ti': { en: 'SMAR-TI: Smart City Platform', de: 'SMAR-TI: Smart-City-Plattform' }
        };

        Object.keys(sectionTitles).forEach(function (id) {
            setText('#' + id + ' h2', pick(sectionTitles[id], lang));
        });

        setText('#stack4ffhs p.text-sm', pick({ en: 'LWS Archive Project', de: 'LWS-Archivprojekt' }, lang));
        setText('#graph-measure p.text-sm', pick({ en: 'LWS Archive Project', de: 'LWS-Archivprojekt' }, lang));
        setText('#suva2 p.text-sm', pick({ en: 'Deep Learning for Fraud Detection', de: 'Deep Learning zur Betrugserkennung' }, lang));
        setText('#ded-in718 p.text-sm', pick({ en: 'Additive Manufacturing Simulation', de: 'Simulation additiver Fertigung' }, lang));
        setText('#trigger-homecare p.text-sm', pick({ en: 'Chronically Ill Patient Management', de: 'Management chronisch kranker Patientinnen und Patienten' }, lang));
        setText('#eisen-snf p.text-sm', pick({ en: 'SNF Project - Pregnancy Medicine', de: 'SNF-Projekt - Schwangerschaftsmedizin' }, lang));
        setText('#skillsfinder p.text-sm', pick({ en: 'Talent Identification & Recruitment', de: 'Talentidentifikation & Rekrutierung' }, lang));
        setText('#rasplan p.text-sm', pick({ en: 'Landslide Risk Assessment', de: 'Bewertung des Erdrutschrisikos' }, lang));
        setText('#customs-engine p.text-sm', pick({ en: 'Innocheque 2020 - Customs Automation', de: 'Innocheque 2020 - Zollautomatisierung' }, lang));
        setText('#trends p.text-sm', pick({ en: 'Learning Analytics & Student Success', de: 'Learning Analytics & Studienerfolg' }, lang));
        setText('#nn-pdes p.text-sm', pick({ en: 'Hasler Foundation - Scientific Computing', de: 'Hasler Stiftung - Scientific Computing' }, lang));
        setText('#e-assessment p.text-sm', pick({ en: 'Intel Research - Home-Based Examination', de: 'Intel Research - Home-Based Examination' }, lang));
        setText('#smar-ti p.text-sm', pick({ en: 'Ticino Smart Region Development', de: 'Ticino Smart Region Development' }, lang));

        applyProjectDetailLongForm(lang);
    }

    function setSectionProse(sectionId, htmlByLang, lang) {
        var node = document.querySelector('#' + sectionId + ' .prose-text');
        if (node) {
            if (!node.dataset.originalHtml) {
                node.dataset.originalHtml = node.innerHTML;
            }
            if (lang === 'en' && typeof htmlByLang.en === 'undefined') {
                node.innerHTML = node.dataset.originalHtml;
                return;
            }
            node.innerHTML = pick(htmlByLang, lang);
        }
    }

    function applyProjectDetailLongForm(lang) {
        setSectionProse('eagle', {
            de: '<p class="text-lg text-slate-700 font-medium italic mb-4">Ein Deep-Learning-Ansatz für die Zuverlässigkeit von Photovoltaik</p>'
                + '<p>Mit dem weltweiten Ausbau von Solaranlagen zur Erreichung der Klimaziele wird die Langzeitzuverlässigkeit von Photovoltaik-(PV-)Systemen zu einem entscheidenden wirtschaftlichen und ökologischen Faktor. Projekt EAGLE, eine Zusammenarbeit zwischen FFHS und SUPSI, adressiert dies, indem traditionelle Handprüfungen durch ein automatisiertes, KI-gestütztes Diagnosesystem ersetzt werden.</p>'
                + '<div class="border-l-4 border-blue-600 pl-6 my-6 py-2 bg-blue-50 rounded-r">'
                + '<h4 class="font-bold mb-2 text-xs uppercase tracking-widest text-blue-700">Die Herausforderung: Versteckte Defekte</h4>'
                + '<p class="text-sm text-slate-600">Solarmodule sind über Jahrzehnte rauen Umgebungsbedingungen ausgesetzt. Mit der Zeit entstehen versteckte Defekte wie Mikrorisse, Feuchtigkeitseindringung oder Hotspots – für das bloße Auge unsichtbar, aber mit erheblicher Auswirkung auf den Energieertrag. Das Aufspüren dieser Defekte in großen Solarparks ist traditionell langsam, kostspielig und fehleranfällig.</p>'
                + '</div>'
                + '<div class="border-l-4 border-blue-600 pl-6 my-6 py-2 bg-blue-50 rounded-r">'
                + '<h4 class="font-bold mb-2 text-xs uppercase tracking-widest text-blue-700">Die Innovation: Multispektrale KI-Analytik</h4>'
                + '<p class="text-sm text-slate-600">Das EAGLE-Projekt entwickelte eine Methodik, die Computer Vision und Deep Learning einsetzt, um Modulbilder aus drei Spektralbereichen zu analysieren:</p>'
                + '<ul class="text-sm space-y-2 text-slate-600 mt-3">'
                + '<li>&bull; <strong>Elektrolumineszenz (EL):</strong> «Röntgenaufnahmen» der Zellen zur Erkennung innerer Risse.</li>'
                + '<li>&bull; <strong>UV-Fluoreszenz (UVf):</strong> Nachweis von Alterung und chemischen Veränderungen im Einbettmaterial.</li>'
                + '<li>&bull; <strong>Sichtbares Spektrum (VI):</strong> Erfassung äußerer Schäden wie Verschmutzung oder Glasbruch.</li>'
                + '</ul>'
                + '<p class="text-sm text-slate-600 mt-3">Zur automatisierten Diagnose im großen Maßstab entwickelte das Team spezialisierte Convolutional Neural Networks (CNNs) und Vision Transformers (ViTs) für eine hochpräzise Defektklassifikation.</p>'
                + '</div>'
                + '<div class="border-l-4 border-blue-600 pl-6 my-6 py-2 bg-blue-50 rounded-r">'
                + '<h4 class="font-bold mb-2 text-xs uppercase tracking-widest text-blue-700">Technische Highlights</h4>'
                + '<ul class="text-sm space-y-2 text-slate-600">'
                + '<li>&bull; <strong>Multimodale Fusion:</strong> Korrelation von Defektsignaturen über Modalitäten hinweg mit elektrischen Leistungsverlusten.</li>'
                + '<li>&bull; <strong>State-of-the-Art-Architektur:</strong> Einsatz von Modellen wie EfficientNet und Segment Anything (SAM) zur Isolierung und Diagnose einzelner Solarzellen in Modulen.</li>'
                + '<li>&bull; <strong>Predictive Maintenance:</strong> Quantifizierung der Degradation zur Optimierung von Reinigung, Reparatur und Austausch für besseren ROI.</li>'
                + '</ul>'
                + '</div>'
                + '<div class="border-l-4 border-blue-600 pl-6 my-6 py-2 bg-blue-50 rounded-r">'
                + '<h4 class="font-bold mb-2 text-xs uppercase tracking-widest text-blue-700">Reale Wirkung</h4>'
                + '<p class="text-sm text-slate-600">Die Ergebnisse von Projekt EAGLE, präsentiert auf der EU PVSEC-Konferenz in Bilbao, liefern einen skalierbaren Rahmen für intelligenten Betrieb und Wartung (Smart O&amp;M). Durch die Automatisierung von Solardiagnosen trägt EAGLE dazu bei, dass die grüne Energiewende auf dauerhafter, leistungsstarker Infrastruktur aufbaut.</p>'
                + '</div>'
                + '<div class="flex flex-wrap gap-3 mt-4">'
                + '<a href="https://www.aramis.admin.ch/Texte/?ProjectID=51667" target="_blank" rel="noopener noreferrer" class="inline-block text-xs font-bold uppercase tracking-widest text-blue-600 border border-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition">Auf ARAMIS ansehen</a>'
                + '<a href="https://www.eupvsec.org/images/2025/conference/EUPVSEC2025_ConferenceProgram_web_v6.pdf" target="_blank" rel="noopener noreferrer" class="inline-block text-xs font-bold uppercase tracking-widest text-blue-600 border border-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition">EU PVSEC Programm (PDF)</a>'
                + '</div>'
                + '<div class="project-credit"><p class="text-sm text-slate-700 mb-0">Mitwirkende: <a href="ralf.html">Ralf Jandl</a>, <a href="danka.html">Danuta Paraficz</a> und <a href="natasa.html">Natasa Sarafijanovic-Djukic</a>.</p></div>'
        }, lang);

        setSectionProse('pronto', {
            de: '<p class="text-lg text-slate-700 font-medium italic mb-2">Vorhersage der Kartoffelkeimung zur Optimierung der Lagerung und Reduktion von Lebensmittelverschwendung.</p>'
                + '<p>Projekt PRONTO befasst sich mit einer zentralen Herausforderung in landwirtschaftlichen Lieferketten: der Vorhersage und Kontrolle der Keimung gelagerter Kartoffeln. Durch die Analyse <strong>elektrophysiologischer Pflanzensignale</strong> mit maschinellem Lernen kann das Projekt das Keimen Wochen im Voraus prognostizieren.</p>'
                + '<p>Dieser Ansatz reduziert die Abhängigkeit von chemischen Keimhemmern und minimiert Lebensmittelverschwendung – ein Beitrag zu nachhaltigeren und kosteneffizienteren Lagerprozessen in der Schweizer Landwirtschaft.</p>'
                + '<div class="border-l-4 border-blue-600 pl-6 my-6 py-2 bg-blue-50 rounded-r">'
                + '<h4 class="font-bold mb-2 text-xs uppercase tracking-widest text-blue-700">Partner</h4>'
                + '<p class="text-sm text-slate-600">Agroscope &amp; Vivent SA</p>'
                + '</div>'
                + '<div class="flex flex-wrap gap-3 mt-4">'
                + '<a href="https://www.ffhs.ch/de/ffhs/news/artikel/2024-02-12-kuenstliche-intelligenz-hilft-kartoffeln-nachhaltiger-zu-lagern" target="_blank" rel="noopener noreferrer" class="inline-block text-xs font-bold uppercase tracking-widest text-blue-600 border border-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition">FFHS-Newsartikel lesen</a>'
                + '<a href="https://www.watson.ch/blogs/work-in-progress/647696168-wie-ki-bauern-hilft-kartoffeln-nachhaltiger-zu-lagern" target="_blank" rel="noopener noreferrer" class="inline-block text-xs font-bold uppercase tracking-widest text-blue-600 border border-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition">Watson-Artikel lesen</a>'
                + '</div>'
                + '<div class="project-credit mt-4"><p class="text-sm text-slate-700 mb-0">Mitwirkende: <a href="aris.html">Aris Marcolongo</a> und <a href="natasa.html">Natasa Sarafijanovic-Djukic</a>.</p></div>'
        }, lang);

        setSectionProse('rag', {
            de: '<p class="text-lg text-slate-700 font-medium italic mb-2">Retrieval-gestützte KI für den Zugriff auf Observatoriumswissen</p>'
                + '<p>In Zusammenarbeit mit dem <strong>Nordic Optical Telescope (NOT)</strong> auf La Palma entwickelt ADA ein domänenspezifisches <strong>Retrieval-Augmented Generation (RAG)</strong>-System, das Astronominnen, Astronomen und technische Teams in ihrer täglichen Arbeit unterstützt.</p>'
                + '<p>Ziel ist es, komplexe Observatoriumsdokumentationen, Betriebsabläufe und wissenschaftliche Protokolle über natürlichsprachliche Suchanfragen zugänglich zu machen – bei vollständiger Nachvollziehbarkeit und sachlicher Verlässlichkeit.</p>'
                + '<div class="border-l-4 border-blue-600 pl-6 my-6 py-2 bg-blue-50 rounded-r">'
                + '<h4 class="font-bold mb-2 text-xs uppercase tracking-widest text-blue-700">Kernherausforderung</h4>'
                + '<p class="text-sm text-slate-600">Kritisches Observatoriumswissen ist über technische Handbücher, Instrumentenbeschreibungen und historische Protokolle verteilt. Traditionelle Suchabläufe sind zeitaufwendig und erschweren die schnelle Kontextermittlung während des Betriebs.</p>'
                + '</div>'
                + '<div class="border-l-4 border-blue-600 pl-6 my-6 py-2 bg-blue-50 rounded-r">'
                + '<h4 class="font-bold mb-2 text-xs uppercase tracking-widest text-blue-700">Technischer Ansatz</h4>'
                + '<ul class="text-sm space-y-2 text-slate-600">'
                + '<li>&bull; <strong>Dokumenten-Retrievalschicht:</strong> Indexierung vertrauenswürdiger Observatoriumsquellen zur Auswahl relevanter Kontexte.</li>'
                + '<li>&bull; <strong>Quellenbasierte Generierung:</strong> Antworterzeugung auf Basis abgerufener Evidenz – nicht allein aus dem Modellgedächtnis.</li>'
                + '<li>&bull; <strong>Zitierbarkeit und Nachvollziehbarkeit:</strong> Rückgabe quellenverknüpfter Antworten zur Unterstützung transparenter Entscheidungsprozesse.</li>'
                + '</ul>'
                + '</div>'
                + '<div class="border-l-4 border-blue-600 pl-6 my-6 py-2 bg-blue-50 rounded-r">'
                + '<h4 class="font-bold mb-2 text-xs uppercase tracking-widest text-blue-700">Erwartete Wirkung</h4>'
                + '<p class="text-sm text-slate-600">Die Plattform reduziert Suchaufwand, beschleunigt Expertenworkflows und verringert das Risiko unbegründeter Antworten, indem Ausgaben in vertrauenswürdigen Quellen verankert werden. So entsteht ein praxistauglicher KI-Assistent, der auf wissenschaftliche Infrastrukturumgebungen zugeschnitten ist.</p>'
                + '</div>'
                + '<div class="project-credit mt-4"><p class="text-sm text-slate-700 mb-0">Mitwirkende: <a href="danka.html">Danuta Paraficz</a> und <a href="natasa.html">Natasa Sarafijanovic-Djukic</a>.</p></div>'
        }, lang);

        setSectionProse('birdnet', {
            de: '<p>Das <strong>Soundscapes-Projekt</strong> (auch bekannt als Cambrian Soundscapes Initiative) wurde im Januar 2024 von der Cambrian Mountains Society ins Leben gerufen, um Daten zur Biodiversität der Region systematisch zu erfassen und auszuwerten. Hintergrund war die Erkenntnis, dass bestehende Biodiversitätsaufzeichnungen für die Cambrian Mountains lückenhaft und inkonsistent waren, was verlässliche Aussagen über Populationstrends erschwerte.</p>'
                + '<h3 class="text-xl font-bold mt-8 mb-3 text-slate-900">Technologie &amp; Methodik</h3>'
                + '<p>Das Projekt setzt <strong>AudioMoths</strong> ein – kostengünstige biakustische Aufzeichnungsgeräte, die bis zu 189 Stunden aufnehmen können und über Monate im Gelände verbleiben. Die Society stationierte 25 dieser Recorder in verschiedenen Lebensräumen, eingestellt auf einen 24-Stunden-Rhythmus mit einer Aufzeichnungsminute pro 10 Minuten.</p>'
                + '<h3 class="text-xl font-bold mt-8 mb-3 text-slate-900">Entstehung</h3>'
                + '<p>Die Idee stammte vom Mitglied Guy Bennett nach einer erfolgreichen Pilotstudie auf dem Land seiner Familie in Cilycwm, bei der seltene, unerwartete Vögel wie die Schafstelze und der Gelbbrauenlaubsänger nachgewiesen wurden.</p>'
                + '<h3 class="text-xl font-bold mt-8 mb-3 text-slate-900">FFHS-Partnerschaft &amp; Datenverarbeitung</h3>'
                + '<p>Anfänglich verwendete die Society die BirdNET-Software zur Artenidentifikation aus den Aufnahmen. Das schiere Datenvolumen führte jedoch zu einer strategischen Partnerschaft mit dem <strong>Big-Data-Team der Fernfachhochschule Schweiz (FFHS) in Zürich</strong>, darunter <strong>Professor Joachim Steinwendner</strong> und <strong>Dr. Danuta Paraficz</strong>. Dieses Team stellt die notwendige Rechenleistung zur Verarbeitung enormer Datensätze bereit und zeigt, wie akademische Institutionen reale Naturschutzbemühungen unterstützen können.</p>'
                + '<div class="border-l-4 border-blue-600 pl-6 my-6 py-2 bg-blue-50 rounded-r">'
                + '<h4 class="font-bold mb-2 text-xs uppercase tracking-widest text-blue-700">Wissenschaftliche Bedeutung</h4>'
                + '<p class="text-sm text-slate-600">Die Zusammenarbeit mit einem hochrangigen akademischen Team verleiht der Forschung des Projekts erhebliche wissenschaftliche Glaubwürdigkeit – von großer Bedeutung, wenn eine kleine, ehrenamtlich geführte Organisation ihre Ergebnisse der breiteren Wissenschaftsgemeinschaft präsentiert.</p>'
                + '</div>'
                + '<h3 class="text-xl font-bold mt-8 mb-3 text-slate-900">Zukunftsvision</h3>'
                + '<p>Derzeit liegt der Fokus auf Vogelpopulationen und Zugmustern. Die Society möchte das Projekt künftig auf weitere Tiergruppen wie Fledermäuse und Kleinsäuger ausweiten. Auch die Nutzung von Vogeldaten zur Ableitung von Aussagen über Fischpopulationen wird erwogen.</p>'
                + '<div class="project-credit"><p class="text-sm text-slate-700 mb-0">Mitwirkende: <a href="joachim.html">Joachim Steinwendner</a> und <a href="danka.html">Danuta Paraficz</a></p></div>'
        }, lang);

        setSectionProse('holzbau', {
            de: '<p>Moderner Holzbau erfordert hochpräzise Qualitätskontrolle. Dieses Projekt nutzt <strong>Computer Vision</strong>, um das strukturelle Gesundheitsmonitoring und die Inspektion von Holzarchitektur zu automatisieren.</p>'
                + '<p>Unsere Forschung entwickelt On-Premise-KI-Modelle, die strukturelle Anomalien während der Bauphase erkennen und damit die digitale Transformation der nachhaltigen Schweizer Holzindustrie (Industrie 4.0) unterstützen.</p>'
                + '<div class="project-credit mt-4"><p class="text-sm text-slate-700 mb-0">Mitwirkende: <a href="danka.html">Danuta Paraficz</a> und <a href="natasa.html">Natasa Sarafijanovic-Djukic</a>.</p></div>'
        }, lang);

        setSectionProse('skillsfinder', {
            de: '<p class="text-sm text-slate-500 uppercase tracking-widest font-bold mb-4">Neue Plattform zur automatischen Kompetenzextraktion &amp; Profilvalidierung zur Talentidentifikation</p>'
                + '<p>Dieses Gemeinschaftsprojekt mit dem Start-up Skills Finder AG wird von Innosuisse gefördert. Ziel ist der Aufbau einer Plattform zur Verarbeitung von Bewerbungsunterlagen, die relevante Informationen aus Lebensläufen automatisch extrahiert und gegen Referenzen und Zeugnisse der Kandidatinnen und Kandidaten validiert. Die Verarbeitungspipeline nutzt aktuelle Fortschritte in der Dokumentenbildverarbeitung und im Natural Language Processing (NLP).</p>'
                + '<p>Der erste Schritt besteht darin, den Text unter Berücksichtigung der korrekten Lesereihenfolge zu extrahieren. Da Lebensläufe sehr unterschiedliche Layouts aufweisen, konnte kein bestehendes Tool den Text zuverlässig extrahieren. Zur Erkennung dieser komplexen Layouts wird ein CV-Layout-Modell mit Deep Layout Parser trainiert – einem Framework für Deep-Learning-basierte Dokumentenbildanalyse.</p>'
                + '<p>Im nächsten Schritt kommt eine NLP-Komponente zur Informationsextraktion zum Einsatz. Wir verwenden Named Entity Recognition (NER) mit einem vortrainierten mehrsprachigen BERT-Modell, das wir mit eigenen Labels auf unserem Datensatz feinabstimmen.</p>'
                + '<p>Der letzte Schritt in der Pipeline ist die Informationsvalidierung. Dabei berechnen wir semantische Ähnlichkeit zwischen Wortphrasen mithilfe von BERT-Ausgabevektoren und Mean Pooling.</p>'
                + '<div class="border-l-4 border-slate-400 pl-6 my-6 py-2 bg-slate-50 rounded-r">'
                + '<p class="text-sm text-slate-600"><strong>Konferenz:</strong> Swiss Text Analytics Conference (SwissText) 2022</p>'
                + '<p class="text-sm text-slate-600"><strong>Präsentation:</strong> <a href="https://www.youtube.com/watch?v=i7viysHUwcA">SwissText 2022</a></p>'
                + '</div>'
                + '<div class="project-credit"><p class="text-sm text-slate-700 mb-0">Mitwirkende: <a href="natasa.html">Natasa Sarafijanovic-Djukic</a> und <a href="beatrice.html">Beatrice Paoli</a>.</p></div>'
        }, lang);

        setSectionProse('stack4ffhs', {
            en: '<p class="text-sm text-slate-500 uppercase tracking-widest font-bold mb-4">LWS Archive Project</p>'
                + '<p>STACK4FFHS is an internal teaching-development project. <strong>STACK</strong> is a Moodle plugin that allows students to submit mathematical expressions and formulas as answers.</p>'
                + '<p>Because formulas can be represented in multiple equivalent ways, answers cannot be validated as plain text. Inputs are parsed with the Maxima computer algebra system and evaluated automatically to provide targeted feedback.</p>'
                + '<p>As part of the project, Moodle question banks are developed for mathematics foundations, calculus, discrete mathematics, and linear algebra.</p>'
                + '<div class="border-l-4 border-slate-400 pl-6 my-6 py-2 bg-slate-50 rounded-r">'
                + '<p class="text-sm text-slate-600"><strong>Project duration:</strong> Modular setup across multiple semesters (depending on resources)</p>'
                + '<p class="text-sm text-slate-600"><strong>Contact:</strong> Urs-Martin Künzi</p>'
                + '</div>',
            de: '<p class="text-sm text-slate-500 uppercase tracking-widest font-bold mb-4">LWS-Archivprojekt</p>'
                + '<p>STACK4FFHS ist ein internes Lehrentwicklungsprojekt. <strong>STACK</strong> ist ein Moodle-Plugin, das es erlaubt, Aufgaben zu stellen, in denen Studierende mathematische Ausdrücke und Formeln als Antwort eingeben.</p>'
                + '<p>Da die Darstellung einer Formel in der Regel nicht eindeutig ist, kann die Eingabe nicht einfach als Text überprüft werden. Stattdessen wird sie mit dem Computeralgebrasystem Maxima geparst und automatisch bewertet, damit passgenaues Feedback gegeben werden kann.</p>'
                + '<p>Im Rahmen des Projekts werden in Moodle Fragesammlungen zu Mathematikgrundlagen, Analysis, diskreter Mathematik und linearer Algebra aufgebaut.</p>'
                + '<div class="border-l-4 border-slate-400 pl-6 my-6 py-2 bg-slate-50 rounded-r">'
                + '<p class="text-sm text-slate-600"><strong>Projektdauer:</strong> Modular aufgebaut über mehrere Semester (ressourcenabhängig)</p>'
                + '<p class="text-sm text-slate-600"><strong>Ansprechperson:</strong> Urs-Martin Künzi</p>'
                + '</div>'
        }, lang);

        setSectionProse('graph-measure', {
            en: '<p class="text-sm text-slate-500 uppercase tracking-widest font-bold mb-4">LWS Archive Project</p>'
                + '<p>LWS participates as a project partner in “Measure Based on Graph Automorphism” led by Matthias Dehmer at FH Steyr.</p>'
                + '<p>The project investigates graph invariants, especially those defined via automorphisms. It analyzes relations among different invariants and studies how well they can uniquely classify graphs within selected graph classes.</p>'
                + '<div class="border-l-4 border-slate-400 pl-6 my-6 py-2 bg-slate-50 rounded-r">'
                + '<p class="text-sm text-slate-600"><strong>Contact:</strong> Urs-Martin Künzi</p>'
                + '<p class="text-sm text-slate-600"><strong>Project duration:</strong> 1.2.19 - 30.9.2020</p>'
                + '</div>',
            de: '<p class="text-sm text-slate-500 uppercase tracking-widest font-bold mb-4">LWS-Archivprojekt</p>'
                + '<p>Das LWS ist Projektpartner im Projekt „Measure Based on Graph Automorphism“ von Matthias Dehmer (FH Steyr).</p>'
                + '<p>Ziel des Projekts ist die Untersuchung von Invarianten auf Graphen, insbesondere solcher, die durch Automorphismen definiert sind. Es wird analysiert, welche Beziehungen zwischen verschiedenen Invarianten bestehen und inwiefern sie Graphen innerhalb bestimmter Klassen eindeutig klassifizieren können.</p>'
                + '<div class="border-l-4 border-slate-400 pl-6 my-6 py-2 bg-slate-50 rounded-r">'
                + '<p class="text-sm text-slate-600"><strong>Kontakt:</strong> Urs-Martin Künzi</p>'
                + '<p class="text-sm text-slate-600"><strong>Projektdauer:</strong> 1.2.19 - 30.9.2020</p>'
                + '</div>'
        }, lang);

        setSectionProse('suva2', {
            en: '<p class="text-sm text-slate-500 uppercase tracking-widest font-bold mb-4">Deep Learning for Fraud Detection</p>'
                + '<p>The Swiss National Accident Insurance Fund (SUVA) increasingly uses machine learning to optimize processes in insurance operations. This project focuses on <strong>fraud detection in personal insurance using deep learning</strong>.</p>'
                + '<p>The task is a statistical outlier-detection problem with high-dimensional data (up to 1,500 features) and extreme class imbalance (fraud cases in the per-mille range). Building on statistical and traditional ML baselines, the project evaluates supervised methods (Deep Neural Networks, Generative Adversarial Networks) and unsupervised methods (autoencoder variants and Boltzmann machines).</p>'
                + '<div class="border-l-4 border-slate-400 pl-6 my-6 py-2 bg-slate-50 rounded-r">'
                + '<p class="text-sm text-slate-600"><strong>Contact:</strong> Joachim Steinwendner</p>'
                + '<p class="text-sm text-slate-600"><strong>Project duration:</strong> 3 months</p>'
                + '</div>'
                + '<div class="project-credit"><p class="text-sm text-slate-700 mb-0">Contributors: <a href="joachim.html">Joachim Steinwendner</a>.</p></div>',
            de: '<p class="text-sm text-slate-500 uppercase tracking-widest font-bold mb-4">Deep Learning zur Betrugserkennung</p>'
                + '<p>Die Schweizerische Unfallversicherungsanstalt (SUVA) setzt vermehrt Methoden des Machine Learning zur Optimierung von Aufgaben in den Versicherungsabteilungen ein. Im Zentrum dieses Projekts steht die <strong>Betrugserkennung im Personenversicherungswesen mit Deep Learning</strong>.</p>'
                + '<p>Es handelt sich um eine Form der Erkennung statistischer Ausreißer. Die Daten sind hochdimensional (bis zu 1.500 Merkmale) und stark klassenasymmetrisch (Betrugsfälle im Promillebereich). Aufbauend auf statistischen und klassischen ML-Vorarbeiten analysiert das Projekt überwachte Verfahren (Deep Neural Nets, Generative Adversarial Networks) und unüberwachte Verfahren (Autoencoder-Varianten und Boltzmann-Maschinen).</p>'
                + '<div class="border-l-4 border-slate-400 pl-6 my-6 py-2 bg-slate-50 rounded-r">'
                + '<p class="text-sm text-slate-600"><strong>Kontakt:</strong> Joachim Steinwendner</p>'
                + '<p class="text-sm text-slate-600"><strong>Projektdauer:</strong> 3 Monate</p>'
                + '</div>'
                + '<div class="project-credit"><p class="text-sm text-slate-700 mb-0">Dieses Projekt wurde von <a href="joachim.html">Joachim Steinwendner</a> durchgeführt.</p></div>'
        }, lang);

        setSectionProse('ded-in718', {
            en: '<p class="text-sm text-slate-500 uppercase tracking-widest font-bold mb-4">Additive Manufacturing Simulation</p>'
                + '<p>DED-In718 develops a simulation and control platform for <strong>Additive Manufacturing (AM)</strong>, specifically <strong>Direct Energy Deposition (DED)</strong> with the alloy Inconel 718.</p>'
                + '<p>The system improves DED robustness, reduces cost and time-to-market, and supports process planning/control by predicting resulting part geometry from integrated experimental data.</p>'
                + '<div class="border-l-4 border-slate-400 pl-6 my-6 py-2 bg-slate-50 rounded-r">'
                + '<p class="text-sm text-slate-600"><strong>Methods:</strong> Artificial Intelligence, CNNs, End-to-End Learning</p>'
                + '<p class="text-sm text-slate-600"><strong>Project duration:</strong> 1 year</p>'
                + '<p class="text-sm text-slate-600"><strong>Contact:</strong> Martina Perani</p>'
                + '</div>'
                + '<div class="project-credit"><p class="text-sm text-slate-700 mb-0">Contributors: <a href="beatrice.html">Beatrice Paoli</a> and <a href="ralf.html">Ralf Jandl</a>.</p></div>',
            de: '<p class="text-sm text-slate-500 uppercase tracking-widest font-bold mb-4">Simulation additiver Fertigung</p>'
                + '<p>DED-In718 zielt auf die Realisierung einer Simulations- und Steuerungsplattform für die <strong>Additive-Manufacturing-Technologie</strong> <strong>Direct Energy Deposition (DED)</strong> mit der Legierung Inconel 718.</p>'
                + '<p>Die Plattform verbessert die Robustheit von DED, reduziert Kosten und Time-to-Market und unterstützt Prozessplanung und -steuerung durch die Vorhersage der Bauteilgeometrie auf Basis integrierter experimenteller Daten.</p>'
                + '<div class="border-l-4 border-slate-400 pl-6 my-6 py-2 bg-slate-50 rounded-r">'
                + '<p class="text-sm text-slate-600"><strong>Methoden:</strong> Künstliche Intelligenz, CNNs, End-to-End Learning</p>'
                + '<p class="text-sm text-slate-600"><strong>Projektdauer:</strong> 1 Jahr</p>'
                + '<p class="text-sm text-slate-600"><strong>Kontakt:</strong> Martina Perani</p>'
                + '</div>'
                + '<div class="project-credit"><p class="text-sm text-slate-700 mb-0">Dieses Projekt wurde von <a href="beatrice.html">Beatrice Paoli</a> und <a href="ralf.html">Ralf Jandl</a> durchgeführt.</p></div>'
        }, lang);

        setSectionProse('trigger-homecare', {
            en: '<p class="text-sm text-slate-500 uppercase tracking-widest font-bold mb-4">Chronically Ill Patient Management</p>'
                + '<p>This internal project is carried out in collaboration with Axis 6 (social systems and public health) and focuses on optimizing care pathways for chronically ill patients receiving home care.</p>',
            de: '<p class="text-sm text-slate-500 uppercase tracking-widest font-bold mb-4">Management chronisch kranker Patientinnen und Patienten</p>'
                + '<p>Das interne Projekt wird in Zusammenarbeit mit der Achse 6 (soziale Systeme und Public Health) durchgeführt und zielt auf die Optimierung der Versorgung von chronisch kranken Patientinnen und Patienten im Heimbereich ab.</p>'
        }, lang);

        setSectionProse('eisen-snf', {
            en: '<p class="text-sm text-slate-500 uppercase tracking-widest font-bold mb-4">SNF Project - Pregnancy Medicine</p>'
                + '<p>The project aims to define a dosage scheme with maximum absorption and minimal gastrointestinal side effects.</p>'
                + '<p>It studies side effects of oral iron supplementation during pregnancy. LWS contributes through a <strong>project app</strong> that allows participants to record side effects.</p>'
                + '<div class="border-l-4 border-slate-400 pl-6 my-6 py-2 bg-slate-50 rounded-r">'
                + '<p class="text-sm text-slate-600"><strong>Contact:</strong> Joachim Steinwendner, Diego Moretti</p>'
                + '<p class="text-sm text-slate-600"><strong>Duration:</strong> April 2019 - March 2022</p>'
                + '</div>'
                + '<div class="project-credit"><p class="text-sm text-slate-700 mb-0">Contributors: <a href="joachim.html">Joachim Steinwendner</a>.</p></div>',
            de: '<p class="text-sm text-slate-500 uppercase tracking-widest font-bold mb-4">SNF-Projekt - Schwangerschaftsmedizin</p>'
                + '<p>Im Projekt geht es um die Definition eines Dosierungsschemas mit maximaler Absorption und minimalen gastrointestinalen Nebenwirkungen.</p>'
                + '<p>Ziel ist das Studium von Nebenwirkungen bei der oralen Eisen-Supplementierung in der Schwangerschaft. Das LWS trägt mit einer <strong>Projekt-App</strong> bei, mit der Teilnehmende Nebenwirkungen erfassen können.</p>'
                + '<div class="border-l-4 border-slate-400 pl-6 my-6 py-2 bg-slate-50 rounded-r">'
                + '<p class="text-sm text-slate-600"><strong>Kontakt:</strong> Joachim Steinwendner, Diego Moretti</p>'
                + '<p class="text-sm text-slate-600"><strong>Dauer:</strong> April 2019 - März 2022</p>'
                + '</div>'
                + '<div class="project-credit"><p class="text-sm text-slate-700 mb-0">Dieses Projekt wurde von <a href="joachim.html">Joachim Steinwendner</a> durchgeführt.</p></div>'
        }, lang);

        setSectionProse('rasplan', {
            en: '<p class="text-sm text-slate-500 uppercase tracking-widest font-bold mb-4">Landslide Risk Assessment</p>'
                + '<p>The project develops technology to estimate the <strong>risk of shallow landslides</strong> using numerical soil models and water-saturation maps.</p>'
                + '<p>Saturation maps are derived from sparse networks of automated soil-moisture sensors and spatial extrapolation using <strong>machine learning techniques</strong>.</p>'
                + '<div class="border-l-4 border-slate-400 pl-6 my-6 py-2 bg-slate-50 rounded-r">'
                + '<p class="text-sm text-slate-600"><strong>Method:</strong> Machine Learning, Artificial Intelligence, Neural Networks</p>'
                + '<p class="text-sm text-slate-600"><strong>Project duration:</strong> 24 months</p>'
                + '<p class="text-sm text-slate-600"><strong>Contact:</strong> Martina Perani</p>'
                + '</div>'
                + '<div class="project-credit"><p class="text-sm text-slate-700 mb-0">Contributors: <a href="beatrice.html">Beatrice Paoli</a> and <a href="ralf.html">Ralf Jandl</a>.</p></div>',
            de: '<p class="text-sm text-slate-500 uppercase tracking-widest font-bold mb-4">Bewertung des Erdrutschrisikos</p>'
                + '<p>Ziel des Projekts ist die Entwicklung einer Technologie, die das <strong>Risiko flacher Erdrutsche</strong> auf Basis numerischer Bodenmodelle und Wassersättigungskarten abschätzen kann.</p>'
                + '<p>Letztere werden aus einem spärlichen Netz automatisierter Sensoren für Bodenfeuchtigkeitsprofile und durch Datenverräumlichung mit <strong>Techniken des maschinellen Lernens</strong> gewonnen.</p>'
                + '<div class="border-l-4 border-slate-400 pl-6 my-6 py-2 bg-slate-50 rounded-r">'
                + '<p class="text-sm text-slate-600"><strong>Methode:</strong> Machine Learning, Künstliche Intelligenz, Neuronale Netze</p>'
                + '<p class="text-sm text-slate-600"><strong>Projektdauer:</strong> 24 Monate</p>'
                + '<p class="text-sm text-slate-600"><strong>Ansprechperson:</strong> Martina Perani</p>'
                + '</div>'
                + '<div class="project-credit"><p class="text-sm text-slate-700 mb-0">Dieses Projekt wurde von <a href="beatrice.html">Beatrice Paoli</a> und <a href="ralf.html">Ralf Jandl</a> durchgeführt.</p></div>'
        }, lang);

        setSectionProse('customs-engine', {
            en: '<p class="text-sm text-slate-500 uppercase tracking-widest font-bold mb-4">Innocheque 2020 - Customs Automation</p>'
                + '<p>A machine-learning solution that can:</p>'
                + '<ul class="text-sm text-slate-600 space-y-2 ml-4 my-4">'
                + '<li>&bull; Predict and evaluate the plausibility of Swiss customs clearance numbers</li>'
                + '<li>&bull; Provide all relevant information connected to those customs numbers</li>'
                + '<li>&bull; Use high-quality textual descriptions for classification</li>'
                + '</ul>'
                + '<div class="border-l-4 border-slate-400 pl-6 my-6 py-2 bg-slate-50 rounded-r">'
                + '<p class="text-sm text-slate-600"><strong>Project duration:</strong> 6 months</p>'
                + '<p class="text-sm text-slate-600"><strong>Contact:</strong> Beatrice Paoli</p>'
                + '</div>',
            de: '<p class="text-sm text-slate-500 uppercase tracking-widest font-bold mb-4">Innocheque 2020 - Zollautomatisierung</p>'
                + '<p>Eine Machine-Learning-Lösung, die in der Lage ist:</p>'
                + '<ul class="text-sm text-slate-600 space-y-2 ml-4 my-4">'
                + '<li>&bull; Die Plausibilität Schweizer Zollabfertigungsnummern vorherzusagen und zu bewerten</li>'
                + '<li>&bull; Alle relevanten Informationen zu diesen Zollnummern bereitzustellen</li>'
                + '<li>&bull; Hochwertige Beschreibungen zur Klassifikation zu nutzen</li>'
                + '</ul>'
                + '<div class="border-l-4 border-slate-400 pl-6 my-6 py-2 bg-slate-50 rounded-r">'
                + '<p class="text-sm text-slate-600"><strong>Projektdauer:</strong> 6 Monate</p>'
                + '<p class="text-sm text-slate-600"><strong>Ansprechperson:</strong> Beatrice Paoli</p>'
                + '</div>'
        }, lang);

        setSectionProse('trends', {
            en: '<p class="text-sm text-slate-500 uppercase tracking-widest font-bold mb-4">Learning Analytics & Student Success</p>'
                + '<p>The TrEndS project is a collaboration between the Laboratory for Web Science (LWS) and the MSc program leadership.</p>'
                + '<p>It enables systematic data collection and analysis to better identify program potential and derive targeted measures. The project is based on existing data sources such as CAS Campus and Evento.</p>'
                + '<p><strong>Machine learning and deep learning methods</strong> are used to generate insights automatically. The analytics tool includes:</p>'
                + '<ul class="text-sm text-slate-600 space-y-2 ml-4 my-4">'
                + '<li>&bull; <strong>Trend Discovery</strong> - analyzing program trends</li>'
                + '<li>&bull; <strong>Students@Risk</strong> - early identification of at-risk students</li>'
                + '</ul>'
                + '<div class="border-l-4 border-slate-400 pl-6 my-6 py-2 bg-slate-50 rounded-r">'
                + '<p class="text-sm text-slate-600"><strong>Contact:</strong> Martina Perani</p>'
                + '<p class="text-sm text-slate-600"><strong>Duration:</strong> 1.12.2018 - 29.2.2020</p>'
                + '</div>',
            de: '<p class="text-sm text-slate-500 uppercase tracking-widest font-bold mb-4">Learning Analytics & Studienerfolg</p>'
                + '<p>Das TrEndS-Projekt ist eine Kooperation zwischen dem Laboratory for Web Science (LWS) und der MSc-Studiengangsleitung.</p>'
                + '<p>Es ermöglicht eine systematische Datenerfassung und -analyse, um Potenziale des Studiengangs besser zu erkennen und gezielte Maßnahmen abzuleiten. Das Projekt basiert auf vorhandenen Datenquellen wie CAS Campus und Evento.</p>'
                + '<p><strong>Machine-Learning- und Deep-Learning-Verfahren</strong> werden eingesetzt, um Informationen automatisch aus Daten zu generieren. Das Analyse-Tool umfasst:</p>'
                + '<ul class="text-sm text-slate-600 space-y-2 ml-4 my-4">'
                + '<li>&bull; <strong>Trendsentdecker</strong> - Analyse von Studiengangtrends</li>'
                + '<li>&bull; <strong>Students@Risk</strong> - Früherkennung gefährdeter Studierender</li>'
                + '</ul>'
                + '<div class="border-l-4 border-slate-400 pl-6 my-6 py-2 bg-slate-50 rounded-r">'
                + '<p class="text-sm text-slate-600"><strong>Kontakt:</strong> Martina Perani</p>'
                + '<p class="text-sm text-slate-600"><strong>Dauer:</strong> 1.12.2018 - 29.2.2020</p>'
                + '</div>'
        }, lang);

        setSectionProse('nn-pdes', {
            en: '<p class="text-sm text-slate-500 uppercase tracking-widest font-bold mb-4">Hasler Foundation - Scientific Computing</p>'
                + '<p>This project proposes a novel approach to <strong>solving partial differential equations (PDEs) with neural networks</strong> for industrial simulation workflows.</p>'
                + '<p>The recent revival of these methods in scientific literature has produced multiple results, indicating that the technique is mature enough for transfer to applied research as an alternative to classical Finite Element Analysis (FEA).</p>'
                + '<div class="border-l-4 border-slate-400 pl-6 my-6 py-2 bg-slate-50 rounded-r">'
                + '<p class="text-sm text-slate-600"><strong>Project duration:</strong> 9 months</p>'
                + '<p class="text-sm text-slate-600"><strong>Contact:</strong> Urs-Martin Künzi</p>'
                + '</div>',
            de: '<p class="text-sm text-slate-500 uppercase tracking-widest font-bold mb-4">Hasler Stiftung - Scientific Computing</p>'
                + '<p>Dieses Vorhaben zielt darauf ab, mit einer neuartigen Technik zur <strong>Lösung partieller Differentialgleichungen (PDEs) auf Basis neuronaler Netze</strong> industrielle Simulationen zu ermöglichen.</p>'
                + '<p>Die jüngste Wiederbelebung dieser Methode in der wissenschaftlichen Literatur führte zu mehreren Veröffentlichungen. Damit ist die Technik reif für den Transfer in die angewandte Forschung als Alternative zur klassischen Finite-Elemente-Analyse (FEA).</p>'
                + '<div class="border-l-4 border-slate-400 pl-6 my-6 py-2 bg-slate-50 rounded-r">'
                + '<p class="text-sm text-slate-600"><strong>Projektdauer:</strong> 9 Monate</p>'
                + '<p class="text-sm text-slate-600"><strong>Ansprechperson:</strong> Urs-Martin Künzi</p>'
                + '</div>'
        }, lang);

        setSectionProse('e-assessment', {
            en: '<p class="text-sm text-slate-500 uppercase tracking-widest font-bold mb-4">Intel Research - Home-Based Examination</p>'
                + '<p>During the coronavirus period, FFHS had to move all teaching online and ensure that examinations could still be conducted reliably.</p>'
                + '<p>A <strong>home-based exam system</strong> was therefore tested to enable online exams without live proctoring. After a successful pilot, FFHS rolled it out more broadly and evaluated the <strong>integration of artificial intelligence</strong> into exam monitoring.</p>'
                + '<p>The system evaluates screen and candidate video streams to support fraud prevention, in collaboration with the DACH distance-learning university community.</p>'
                + '<div class="border-l-4 border-slate-400 pl-6 my-6 py-2 bg-slate-50 rounded-r">'
                + '<p class="text-sm text-slate-600"><strong>Contact:</strong> Joachim Steinwendner</p>'
                + '<p class="text-sm text-slate-600"><strong>Project duration:</strong> 1 year</p>'
                + '</div>',
            de: '<p class="text-sm text-slate-500 uppercase tracking-widest font-bold mb-4">Intel Research - Home-Based Examination</p>'
                + '<p>Während der Coronavirus-Zeit war die FFHS gezwungen, alle Lehrveranstaltungen online durchzuführen und den Prüfungsbetrieb sicherzustellen.</p>'
                + '<p>Dazu wurde ein <strong>Home-Based-Prüfungssystem</strong> getestet, um Online-Prüfungen ohne Live-Proctoring zu ermöglichen. Nach einem erfolgreichen Piloten wurde die <strong>Integration künstlicher Intelligenz</strong> in die Prüfungsüberwachung ausgebaut.</p>'
                + '<p>Das System analysiert Videoaufnahmen von Bildschirm und Prüfungskandidatinnen bzw. -kandidaten zur Betrugsprävention in Zusammenarbeit mit der DACH-Community der Fernuniversitäten.</p>'
                + '<div class="border-l-4 border-slate-400 pl-6 my-6 py-2 bg-slate-50 rounded-r">'
                + '<p class="text-sm text-slate-600"><strong>Ansprechperson:</strong> Joachim Steinwendner</p>'
                + '<p class="text-sm text-slate-600"><strong>Projektdauer:</strong> 1 Jahr</p>'
                + '</div>'
        }, lang);

        setSectionProse('smar-ti', {
            en: '<p class="text-sm text-slate-500 uppercase tracking-widest font-bold mb-4">Ticino Smart Region Development</p>'
                + '<p>SMAR-TI aims to build and test an integrated Smart City platform for Ticino, coordinating activities around <strong>Smart City and Smart Region</strong> topics across SUPSI and affiliated schools.</p>'
                + '<p>The platform creates a unified interface toward external stakeholders while coordinating internal competencies to address the topic in an integrated, efficient, and effective way.</p>'
                + '<div class="border-l-4 border-slate-400 pl-6 my-6 py-2 bg-slate-50 rounded-r">'
                + '<p class="text-sm text-slate-600"><strong>Project duration:</strong> 1 year</p>'
                + '<p class="text-sm text-slate-600"><strong>Contact:</strong> Martina Perani / Beatrice Paoli</p>'
                + '</div>',
            de: '<p class="text-sm text-slate-500 uppercase tracking-widest font-bold mb-4">Ticino Smart Region Development</p>'
                + '<p>SMAR-TI zielt darauf ab, eine integrierte Smart-City-Plattform für den Kanton Tessin zu entwickeln und zu testen. Dabei werden Aktivitäten rund um <strong>Smart City und Smart Region</strong> innerhalb der SUPSI und ihrer affiliierten Schulen koordiniert.</p>'
                + '<p>Die Plattform schafft eine einheitliche Schnittstelle zu externen Akteuren und bündelt interne Kompetenzen, um das Thema integriert, effizient und wirksam zu bearbeiten.</p>'
                + '<div class="border-l-4 border-slate-400 pl-6 my-6 py-2 bg-slate-50 rounded-r">'
                + '<p class="text-sm text-slate-600"><strong>Projektdauer:</strong> 1 Jahr</p>'
                + '<p class="text-sm text-slate-600"><strong>Ansprechperson:</strong> Martina Perani / Beatrice Paoli</p>'
                + '</div>'
        }, lang);
    }

    function applyTeamTranslations(lang) {
        document.title = pick({ en: 'ADA Team', de: 'ADA-Team' }, lang);
        setText('header h1.text-2xl', pick({ en: 'ADA / LWS TEAM', de: 'ADA / LWS TEAM' }, lang));
        setText('header p.text-xs', pick({ en: 'Applied Data Science and AI', de: 'Angewandte Datenwissenschaft und KI' }, lang));
        setText('main section.mb-12 h2', pick({ en: 'Team Overview', de: 'Teamüberblick' }, lang));
        setText('main section.mb-12 p', pick({ en: 'This page combines the existing ADA profile pages with the broader LWS research team listed on FFHS. Internal profile pages are linked where available.', de: 'Diese Seite verbindet die bestehenden ADA-Profilseiten mit dem erweiterten LWS-Forschungsteam der FFHS. Interne Profilseiten sind verlinkt, wo verfügbar.' }, lang));
        setText('main section h3.text-3xl', pick({ en: 'Research Team', de: 'Forschungsteam' }, lang));

        var roleTexts = [
            { en: 'Institutsleiterin LWS / LWS Director', de: 'Institutsleiterin LWS / LWS Director' },
            { en: 'Forschungsfeldleiter GeoHealth Analytics / Research Field Lead GeoHealth Analytics', de: 'Forschungsfeldleiter GeoHealth Analytics / Research Field Lead GeoHealth Analytics' },
            { en: 'Senior Researcher', de: 'Senior Researcher' },
            { en: 'Associate Researcher', de: 'Associate Researcher' },
            { en: 'Associate Researcher', de: 'Associate Researcher' },
            { en: 'Forschungsfeldleiter Energie, Umwelt, Materialien / Research Field Lead Energy, Environment, Materials', de: 'Forschungsfeldleiter Energie, Umwelt, Materialien / Research Field Lead Energy, Environment, Materials' },
            { en: 'Expert Researcher', de: 'Expert Researcher' }
        ];
        var roleNodes = document.querySelectorAll('article p.text-xs');
        roleNodes.forEach(function (node, index) {
            if (roleTexts[index]) {
                setNodeText(node, pick(roleTexts[index], lang));
            }
        });

        var bioNodes = document.querySelectorAll('article p.text-sm');
        if (bioNodes[0]) {
            setNodeText(bioNodes[0], pick({ en: 'Head of the Data Science department.', de: 'Fachbereichsleiterin Data Science.' }, lang));
        }

        var footerNodes = document.querySelectorAll('footer .text-black');
        setNodeText(footerNodes[0], pick({ en: 'ADA Institute (FFHS)', de: 'ADA Institut (FFHS)' }, lang));
        setNodeText(footerNodes[1], pick({ en: 'Source', de: 'Quelle' }, lang));
    }

    function applyPublicationsTranslations(lang) {
        document.title = pick({ en: 'ADA Publications', de: 'ADA Publikationen' }, lang);
        setText('main h1.text-3xl', pick({ en: 'Publications', de: 'Publikationen' }, lang));
        setText('main p.text-slate-600', pick({ en: 'This page is ready for ADA publication entries. Add journal papers, conference papers, and reports here.', de: 'Diese Seite ist für ADA-Publikationen vorbereitet. Fügen Sie hier Zeitschriftenartikel, Konferenzbeiträge und Berichte hinzu.' }, lang));
    }

    function applyProfileTranslations(page, lang) {
        var configs = {
            'danka.html': {
                title: { en: 'Dr. Danuta Paraficz | Senior AI Scientist', de: 'Dr. Danuta Paraficz | Senior KI-Wissenschaftlerin' },
                subtitle: { en: 'Senior AI Scientist | ADA Institute', de: 'Senior KI-Wissenschaftlerin | ADA Institut' },
                sections: [
                    { selector: '#home-view h2.text-xs', text: { en: 'Professional Bio', de: 'Berufliches Profil' } },
                    { selector: 'section.mb-20 h2.text-lg', text: { en: 'Latest Achievement', de: 'Neuester Erfolg' } },
                    { selector: 'section.mb-20 h3.text-3xl', text: { en: 'Milano-Cortina 2026 Olympic Hackathon Winner', de: 'Gewinnerin des Olympia-Hackathons Milano-Cortina 2026' } },
                    { selector: 'section.mb-20 p.text-gray-600', text: { en: 'Dr. Paraficz led an elite team of FFHS students to victory in the official Olympic App Challenge. The team developed a groundbreaking AI solution for the 2026 Winter Olympics in Milano.', de: 'Dr. Paraficz führte ein Team von FFHS-Studierenden zum Sieg bei der offiziellen Olympic App Challenge. Das Team entwickelte eine wegweisende KI-Lösung für die Olympischen Winterspiele 2026 in Mailand.' } },
                    { selector: 'main section:last-of-type h2.text-xs', text: { en: 'Research Portfolio', de: 'Forschungsportfolio' } }
                ]
            },
            'ann-karin.html': {
                title: { en: 'Dr. Ann-Karin Sanchez | Expert Researcher', de: 'Dr. Ann-Karin Sanchez | Expert Researcher' },
                subtitle: { en: 'Expert Researcher | ADA Institute', de: 'Expert Researcher | ADA Institut' },
                sections: [
                    { selector: '#home-view h2.text-xs', text: { en: 'Professional Bio', de: 'Berufliches Profil' } }
                ]
            },
            'aris.html': {
                title: { en: 'Dr. Aris Marcolongo | Associate Researcher', de: 'Dr. Aris Marcolongo | Associate Researcher' },
                subtitle: { en: 'Associate Researcher | ADA Institute', de: 'Associate Researcher | ADA Institut' },
                sections: [
                    { selector: '#home-view h2.text-xs', text: { en: 'Professional Bio', de: 'Berufliches Profil' } },
                    { selector: 'main section:last-of-type h2.text-xs', text: { en: 'Research Portfolio', de: 'Forschungsportfolio' } }
                ]
            },
            'beatrice.html': {
                title: { en: 'Prof. Dr. Beatrice Paoli | Institutsleiterin LWS / LWS Director', de: 'Prof. Dr. Beatrice Paoli | Institutsleiterin LWS / LWS Director' },
                subtitle: { en: 'Institutsleiterin LWS / LWS Director | Fachbereichsleiterin Data Science / Head of Data Science', de: 'Institutsleiterin LWS / LWS Director | Fachbereichsleiterin Data Science / Head of Data Science' },
                sections: [
                    { selector: '#home-view h2.text-xs', text: { en: 'Professional Bio', de: 'Berufliches Profil' } },
                    { selector: 'main section.mt-16 h2.text-xs', text: { en: 'Archive Project Icons', de: 'Projekt-Icons aus dem Archiv' } }
                ]
            },
            'joachim.html': {
                title: { en: 'Prof. Dr. Joachim Steinwendner | Forschungsfeldleiter GeoHealth Analytics / Research Field Lead GeoHealth Analytics', de: 'Prof. Dr. Joachim Steinwendner | Forschungsfeldleiter GeoHealth Analytics / Research Field Lead GeoHealth Analytics' },
                subtitle: { en: 'Forschungsfeldleiter GeoHealth Analytics / Research Field Lead GeoHealth Analytics | ADA Institute', de: 'Forschungsfeldleiter GeoHealth Analytics / Research Field Lead GeoHealth Analytics | ADA Institut' },
                sections: [
                    { selector: '#home-view h2.text-xs', text: { en: 'Professional Bio', de: 'Berufliches Profil' } },
                    { selector: 'main h2.text-xs:nth-of-type(2)', text: { en: 'Research Interests', de: 'Forschungsinteressen' } },
                    { selector: 'main h2.text-xs:nth-of-type(3)', text: { en: 'Academic Degrees', de: 'Akademische Abschlüsse' } },
                    { selector: 'main h2.text-xs:nth-of-type(4)', text: { en: 'Teaching Areas', de: 'Lehrgebiete' } },
                    { selector: 'main h2.text-xs:nth-of-type(5)', text: { en: 'Publications & Professional Networks', de: 'Publikationen & Fachnetzwerke' } },
                    { selector: 'main h2.text-xs:nth-of-type(6)', text: { en: 'Featured Book', de: 'Ausgewähltes Buch' } },
                    { selector: 'main h2.text-xs:nth-of-type(7)', text: { en: 'Project Portfolio', de: 'Projektportfolio' } }
                ]
            },
            'natasa.html': {
                title: { en: 'Dr. Natasa Sarafijanovic-Djukic | Associate Researcher', de: 'Dr. Natasa Sarafijanovic-Djukic | Associate Researcher' },
                subtitle: { en: 'Associate Researcher | ADA Institute', de: 'Associate Researcher | ADA Institut' },
                sections: [
                    { selector: '#home-view h2.text-xs', text: { en: 'Professional Bio', de: 'Berufliches Profil' } },
                    { selector: 'main section:last-of-type h2.text-xs', text: { en: 'Research Portfolio', de: 'Forschungsportfolio' } }
                ]
            },
            'ralf.html': {
                title: { en: 'Ralf Jandl | Forschungsfeldleiter Energie, Umwelt, Materialien / Research Field Lead Energy, Environment, Materials', de: 'Ralf Jandl | Forschungsfeldleiter Energie, Umwelt, Materialien / Research Field Lead Energy, Environment, Materials' },
                subtitle: { en: 'Forschungsfeldleiter Energie, Umwelt, Materialien / Research Field Lead Energy, Environment, Materials | Laboratory for Web Science', de: 'Forschungsfeldleiter Energie, Umwelt, Materialien / Research Field Lead Energy, Environment, Materials | Laboratory for Web Science' },
                sections: [
                    { selector: '#home-view h2.text-xs', text: { en: 'Professional Bio', de: 'Berufliches Profil' } },
                    { selector: 'main section.mt-16 h2.text-xs', text: { en: 'Archive Project Icons', de: 'Projekt-Icons aus dem Archiv' } }
                ]
            }
        };

        var config = configs[page];
        if (!config) {
            return;
        }

        document.title = pick(config.title, lang);
        setText('header p.text-xs', pick(config.subtitle, lang));
        config.sections.forEach(function (item) {
            setText(item.selector, pick(item.text, lang));
        });

        var sideLabels = document.querySelectorAll('.text-xs.text-gray-600 span.font-bold');
        var labelMap = [
            { en: 'Phone', de: 'Telefon' },
            { en: 'Email', de: 'E-Mail' },
            { en: 'Workplace', de: 'Arbeitsort' },
            { en: 'Workdays', de: 'Arbeitstage' },
            { en: 'LinkedIn', de: 'LinkedIn' },
            { en: 'FFHS Profile', de: 'FFHS Profil' }
        ];
        sideLabels.forEach(function (node, index) {
            if (labelMap[index]) {
                setNodeText(node, pick(labelMap[index], lang));
            }
        });

        setText('header nav a[href^="https://www.linkedin.com"]', pick({ en: 'LinkedIn', de: 'LinkedIn' }, lang));
        setText('header nav a[href^="mailto:"]', pick({ en: 'Email', de: 'E-Mail' }, lang));
        setText('footer .text-black:last-child', pick({ en: 'Contact', de: 'Kontakt' }, lang));

        applyProfileLongForm(page, lang);
    }

    function applyProfileLongForm(page, lang) {
        if (page === 'ann-karin.html') {
            var annKarinBio = document.querySelector('#home-view .prose-text.text-lg');
            if (annKarinBio && !annKarinBio.dataset.originalHtml) {
                annKarinBio.dataset.originalHtml = annKarinBio.innerHTML;
            }
            if (annKarinBio && lang === 'de') {
                annKarinBio.innerHTML = '<h2 class="text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mb-6 italic">Berufliches Profil</h2>'
                    + '<p>Dr. Ann-Karin Sanchez ist Expert Researcher am Laboratory for Web Science (LWS) der Fernfachhochschule Schweiz (FFHS) in Zurich.</p>';
            } else if (annKarinBio && annKarinBio.dataset.originalHtml) {
                annKarinBio.innerHTML = annKarinBio.dataset.originalHtml;
            }
        }

        if (page === 'aris.html') {
            var arisBio = document.querySelector('#home-view .prose-text.text-lg');
            if (arisBio && !arisBio.dataset.originalHtml) {
                arisBio.dataset.originalHtml = arisBio.innerHTML;
            }
            if (arisBio && lang === 'de') {
                arisBio.innerHTML = '<h2 class="text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mb-6 italic">Berufliches Profil</h2>'
                    + '<p>Dr. Aris Marcolongo ist Senior Researcher und Data Scientist mit Spezialisierung auf angewandtes Machine Learning an der Fernfachhochschule Schweiz (FFHS).</p>';
            } else if (arisBio && arisBio.dataset.originalHtml) {
                arisBio.innerHTML = arisBio.dataset.originalHtml;
            }
        }

        if (page === 'beatrice.html') {
            var beatriceBio = document.querySelector('#home-view .prose-text.text-lg');
            if (beatriceBio && !beatriceBio.dataset.originalHtml) {
                beatriceBio.dataset.originalHtml = beatriceBio.innerHTML;
            }
            if (beatriceBio && lang === 'de') {
                beatriceBio.innerHTML = '<h2 class="text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mb-6 italic">Berufliches Profil</h2>'
                    + '<p>Prof. Dr. Beatrice Paoli ist Institutsleiterin LWS / LWS Director und Fachbereichsleiterin Data Science / Head of Data Science an der Fernfachhochschule Schweiz (FFHS).</p>'
                    + '<p>Sie prägt die strategische und wissenschaftliche Weiterentwicklung der Data Science in Forschung, Lehre und angewandter Innovation.</p>';
            } else if (beatriceBio && beatriceBio.dataset.originalHtml) {
                beatriceBio.innerHTML = beatriceBio.dataset.originalHtml;
            }
        }

        if (page === 'danka.html') {
            var dankaBio = document.querySelector('#home-view .prose-text.text-lg');
            if (dankaBio && !dankaBio.dataset.originalHtml) {
                dankaBio.dataset.originalHtml = dankaBio.innerHTML;
            }
            if (dankaBio && lang === 'de') {
                dankaBio.innerHTML = '<h2 class="text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mb-6 italic">Berufliches Profil</h2>'
                    + '<p>Dr. Danuta (Danka) Paraficz ist KI-Forschungswissenschaftlerin an der Fernfachhochschule Schweiz (FFHS) und arbeitet an praxisnahen Machine-Learning- und Deep-Learning-Lösungen.</p>'
                    + '<p>Ihr beruflicher Weg verbindet akademische Forschung mit produktionsreifen KI-Systemen. Im Energiesektor entwickelte sie Prognosemodelle auf Basis von Satelliten- und Wetterdaten für Wind- und Solarproduktion in Europa. In der Astrophysikforschung (EPFL und LAM Marseille) arbeitete sie zu Gravitationslinsen und Dunkler Materie, entwickelte wissenschaftliche Software und leitete internationale datenintensive Kooperationen.</p>'
                    + '<p>Sie promovierte in Astronomie und Astrophysik an der Universität Kopenhagen (Niels-Bohr-Institut). Ihre Dissertation führte einen theoretischen Ansatz zur Messung Dunkler Materie über starke Gravitationslinsen ein.</p>';
            } else if (dankaBio && dankaBio.dataset.originalHtml) {
                dankaBio.innerHTML = dankaBio.dataset.originalHtml;
            }
        }

        if (page === 'joachim.html') {
            var joachimBio = document.querySelector('#home-view .prose-text.text-lg');
            if (joachimBio && !joachimBio.dataset.originalHtml) {
                joachimBio.dataset.originalHtml = joachimBio.innerHTML;
            }
            if (joachimBio && lang === 'de') {
                joachimBio.innerHTML = '<h2 class="text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mb-6 italic">Berufliches Profil</h2>'
                    + '<p>Prof. Dr. Joachim Steinwendner ist Experte für Artificial Intelligence, Machine Learning und digitale Transformation mit Schwerpunkt auf Anwendungen in Gesundheit und Geowissenschaften. Als Leiter des Forschungsfelds GeoHealth Analytics am ADA verbindet er fortgeschrittene Analytik mit praxisnaher Umsetzung.</p>'
                    + '<p>Seine Arbeit umfasst mobile und KI-gestützte Lösungen im Gesundheitswesen, Betrugserkennung in Versicherung und Finanzwesen sowie KI-unterstütztes E-Assessment/Proctoring in der digitalen Lehre. Er ist dafür bekannt, Forschungskonzepte in skalierbare und verlässliche Produktivsysteme zu überführen.</p>'
                    + '<p>Neben seiner Forschungsleitung unterrichtet er an FFHS und ETH Zürich und ist Mitautor des Fachbuchs <em>Neuronale Netze programmieren mit Python</em> (Rheinwerk Verlag).</p>'
                    + '<h3 class="text-lg font-bold uppercase tracking-wider mt-8 mb-4 text-gray-900">Forschungsinteressen</h3>'
                    + '<ul class="text-sm text-gray-700 space-y-2 list-disc pl-5">'
                    + '<li><strong>GeoHealth Analytics:</strong> Räumliche Datenanalyse für Gesundheitstrends und Umwelteinflüsse.</li>'
                    + '<li><strong>KI &amp; Machine Learning:</strong> Prädiktive Modelle und Deep-Learning-Architekturen.</li>'
                    + '<li><strong>Data Science:</strong> Robuste Verarbeitungspipelines und Visualisierung.</li>'
                    + '<li><strong>Digitale Gesundheit:</strong> Modernisierung von Gesundheitssystemen durch intelligente Technologien.</li>'
                    + '</ul>'
                    + '<h3 class="text-lg font-bold uppercase tracking-wider mt-8 mb-4 text-gray-900">Akademische Abschlüsse</h3>'
                    + '<p>Dr. nat. techn.<br>MSc in Informatik</p>'
                    + '<h3 class="text-lg font-bold uppercase tracking-wider mt-8 mb-4 text-gray-900">Lehrgebiete</h3>'
                    + '<ul class="text-sm text-gray-700 space-y-2 list-disc pl-5">'
                    + '<li>Data Science &amp; Machine Learning (FFHS &amp; ETH Zürich)</li>'
                    + '<li>Entwicklung neuronaler Netze</li>'
                    + '<li>Python für wissenschaftliches Rechnen</li>'
                    + '</ul>';
            } else if (joachimBio && joachimBio.dataset.originalHtml) {
                joachimBio.innerHTML = joachimBio.dataset.originalHtml;
            }
        }

        if (page === 'natasa.html') {
            var natasaBio = document.querySelector('#home-view .prose-text.text-lg');
            if (natasaBio && !natasaBio.dataset.originalHtml) {
                natasaBio.dataset.originalHtml = natasaBio.innerHTML;
            }
            if (natasaBio && lang === 'de') {
                natasaBio.innerHTML = '<h2 class="text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mb-6 italic">Berufliches Profil</h2>'
                    + '<p>Dr. Natasa Sarafijanovic-Djukic ist Forscherin für angewandtes Machine Learning an der Fernfachhochschule Schweiz (FFHS) und verfügt über mehr als ein Jahrzehnt Erfahrung in Wissenschaft und Industrie.</p>'
                    + '<p>Seit ihrem Einstieg an der FFHS im Jahr 2021 konzentriert sie sich auf praxisnahe KI-Systeme. Zuvor war sie Marie-Skłodowska-Curie-Fellow bei Iris Technology Solutions (industrielle Data Science) sowie Postdoktorandin bei Inria in Frankreich (Web-Privacy und User-Tracking).</p>'
                    + '<p>Ihre Schwerpunkte umfassen Computer Vision, Natural Language Processing, RAG-Systeme, Zeitreihenmodellierung und interpretierbares Machine Learning. Sie promovierte in Computer and Communication Science an der EPFL.</p>';
            } else if (natasaBio && natasaBio.dataset.originalHtml) {
                natasaBio.innerHTML = natasaBio.dataset.originalHtml;
            }
        }

        if (page === 'ralf.html') {
            var ralfBio = document.querySelector('#home-view .prose-text.text-lg');
            if (ralfBio && !ralfBio.dataset.originalHtml) {
                ralfBio.dataset.originalHtml = ralfBio.innerHTML;
            }
            if (ralfBio && lang === 'de') {
                ralfBio.innerHTML = '<h2 class="text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mb-6 italic">Berufliches Profil</h2>'
                    + '<p>Ralf Jandl ist Forschungsfeldleiter Energie, Umwelt, Materialien / Research Field Lead Energy, Environment, Materials am Laboratory for Web Science (LWS), Fernfachhochschule Schweiz (FFHS).</p>'
                    + '<p>Sein Hintergrund verbindet Softwareentwicklung, Teamleitung und Projektberatung mit akademischer Ausbildung in Wirtschaftsinformatik und Künstlicher Intelligenz.</p>';
            } else if (ralfBio && ralfBio.dataset.originalHtml) {
                ralfBio.innerHTML = ralfBio.dataset.originalHtml;
            }
        }
    }

    function applyLanguage(lang) {
        applyCommonTranslations(lang);

        var page = getCurrentPage();
        if (page === 'ada_better.html') {
            applyAdaBetterTranslations(lang);
        } else if (page === 'projects.html') {
            applyProjectsTranslations(lang);
        } else if (page === 'team.html') {
            applyTeamTranslations(lang);
        } else if (page === 'publications.html') {
            applyPublicationsTranslations(lang);
        } else {
            applyProfileTranslations(page, lang);
        }

        updateSwitcher(lang);
    }

    document.addEventListener('DOMContentLoaded', function () {
        injectStyles();
        var lang = getStoredLanguage();
        injectSwitcher(lang);
        applyLanguage(lang);
    });
})();
