(function () {
    var PREVIEW_COUNT = 3;
    var projectGrid = document.getElementById("project-grid");
    var TECH_ICON_BASE = projectGrid ? projectGrid.getAttribute("data-tech-icon-base") : "/static/image/tech/";

    var TECH_ICON_MAP = {
        "n8n": "n8n.svg",
        "Make": "make-color.svg",
        "Zapier": "zapier-official.svg",
        "Twilio": "twilio.svg",
        "Notion": "notion.svg",
        "OpenAI": "OpenAI",
        "Softr": "Softr Logo Vector.svg",
        "Nuxt.js": "nuxt.svg",
        "Supabase": "supabase.svg",
        "Tailwind": "tailwindcss.svg",
        "Google Sheets": "google-sheets.svg",
        "Google Sheet": "google-sheets.svg",
        "Google Agenda": "google-calendar.svg",
        "Google Mail": "microsoft-outlook.svg",
        "Gmail": "microsoft-outlook.svg",
        "Google Form": "drive.svg",
        "Python": "python.svg",
        "PostgreSQL": "postgresql.svg",
        "FastAPI": "fastapi.svg",
        "Flutter": "flutter.svg",
        "Docker": "docker.svg",
        "Stripe": "stripe_wordmark.svg",
        "Next.js": "nextjs_icon_dark.svg",
        "Vercel": "Vercel",
        "Render": "Render",
        "OpenRouter": "OpenRouter",
    };

    function isDarkMode() {
        return document.documentElement.classList.contains("dark");
    }

    function getTechIconFile(tag) {
        if (!tag) return null;
        var file = TECH_ICON_MAP[tag];
        if (!file) return null;
        if (file === "OpenAI") return isDarkMode() ? "OpenAI_dark.svg" : "OpenAI_light.svg";
        if (file === "OpenRouter") return isDarkMode() ? "OpenRouter_dark.svg" : "OpenRouter_light.svg";
        if (file === "Vercel") return isDarkMode() ? "vercel_dark.svg" : "vercel_dark.svg";
        if (file === "Render") return isDarkMode() ? "render_white.svg" : "render_black.svg";
        return file;
    }

    function getFallbackMaterialIcon(tag) {
        var icons = {
            "Consommation API": "api",
            "Redis": "storage",
        };
        return icons[tag] || null;
    }

    function renderTechIcons(container, tags, maxIcons, fallbackCardIcon) {
        if (!container) return;
        container.innerHTML = "";

        var icons = [];
        var seen = {};
        (tags || []).forEach(function (tag) {
            var iconFile = getTechIconFile(tag);
            var materialIcon = iconFile ? null : getFallbackMaterialIcon(tag);
            var key = iconFile || materialIcon;
            if (!key || seen[key]) return;
            seen[key] = true;
            icons.push({ tag: tag, file: iconFile, materialIcon: materialIcon });
        });

        var size = container.classList.contains("tech-icons-preview--small") ? "w-10 h-10" : "w-12 h-12";

        function makeBoxWithImg(icon) {
            var box = document.createElement("div");
            box.className = size + " rounded flex items-center justify-center";
            box.title = icon.tag;

            if (icon.file) {
                var img = document.createElement("img");
                img.src = TECH_ICON_BASE + encodeURIComponent(icon.file);
                img.alt = icon.tag;
                img.className = "w-full h-full object-contain";
                box.appendChild(img);
            } else {
                var span = document.createElement("span");
                span.className = "material-icons text-primary";
                span.textContent = icon.materialIcon;
                box.appendChild(span);
            }
            return box;
        }

        var limit = typeof maxIcons === "number" ? maxIcons : icons.length;
        if (icons.length > 0) {
            icons.slice(0, limit).forEach(function (icon) {
                container.appendChild(makeBoxWithImg(icon));
            });
            return;
        }

        if (container.classList.contains("tech-icons-preview--automation")) {
            [
                { name: "hub", color: "text-primary" },
                { name: "sync_alt", color: "text-orange-400" },
                { name: "bolt", color: "text-green-400" },
            ].forEach(function (fallback) {
                var span = document.createElement("span");
                span.className = "material-icons " + fallback.color;
                span.textContent = fallback.name;

                var box = document.createElement("div");
                box.className = size + " rounded flex items-center justify-center";
                box.appendChild(span);
                container.appendChild(box);
            });
            return;
        }

        var box = document.createElement("div");
        box.className = size + " rounded flex items-center justify-center";
        var span = document.createElement("span");
        span.className = "material-icons text-primary/70";
        span.textContent = fallbackCardIcon || "folder";
        box.appendChild(span);
        container.appendChild(box);
    }

    function parseTagsJson(tagsJson) {
        if (!tagsJson) return [];
        var value = String(tagsJson).replace(/&quot;/g, "\"").replace(/&#34;/g, "\"").replace(/&amp;/g, "&");
        try {
            return JSON.parse(value || "[]");
        } catch (error) {
            return [];
        }
    }

    function parseJsonObject(json) {
        if (!json) return {};
        var value = String(json).replace(/&quot;/g, "\"").replace(/&#34;/g, "\"").replace(/&amp;/g, "&");
        try {
            return JSON.parse(value || "{}");
        } catch (error) {
            return {};
        }
    }

    function cardMatchesFilter(card, filter) {
        if (filter === "all") return true;
        var types = parseTagsJson(card.getAttribute("data-types"));
        if (types.length > 0) return types.indexOf(filter) !== -1;
        return card.getAttribute("data-type") === filter;
    }

    function initRevealOnScroll() {
        var items = document.querySelectorAll(".reveal-on-scroll");
        if (!items.length) return null;

        if (!("IntersectionObserver" in window)) {
            items.forEach(function (item) {
                item.classList.add("is-visible");
            });
            return null;
        }

        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) entry.target.classList.add("is-visible");
                    else entry.target.classList.remove("is-visible");
                });
            },
            { threshold: 0.12 }
        );

        items.forEach(function (item, index) {
            item.style.transitionDelay = Math.min(index * 70, 280) + "ms";
            observer.observe(item);
        });

        return observer;
    }

    function appendCaseStudySection(container, title, content) {
        if (!content || (Array.isArray(content) && content.length === 0)) return;

        var section = document.createElement("section");
        section.className = "rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50";

        var heading = document.createElement("h3");
        heading.className = "mb-2 text-xs font-bold uppercase tracking-wider text-primary";
        heading.textContent = title;
        section.appendChild(heading);

        if (Array.isArray(content)) {
            var list = document.createElement("ul");
            list.className = "space-y-1 text-sm text-slate-600 dark:text-slate-300";
            content.forEach(function (item) {
                var li = document.createElement("li");
                li.className = "flex gap-2";
                li.innerHTML = "<span class=\"text-primary\">-</span><span></span>";
                li.querySelector("span:last-child").textContent = item;
                list.appendChild(li);
            });
            section.appendChild(list);
        } else {
            var paragraph = document.createElement("p");
            paragraph.className = "text-sm leading-6 text-slate-600 dark:text-slate-300";
            paragraph.textContent = content;
            section.appendChild(paragraph);
        }

        container.appendChild(section);
    }

    function renderCaseStudy(container, caseStudy) {
        if (!container) return;
        container.innerHTML = "";
        if (!caseStudy || Object.keys(caseStudy).length === 0) return;

        appendCaseStudySection(container, "Contexte", caseStudy.context);
        appendCaseStudySection(container, "Problème", caseStudy.problem);
        appendCaseStudySection(container, "Solution", caseStudy.solution);
        appendCaseStudySection(container, "Mon rôle", caseStudy.role);
        appendCaseStudySection(container, "Workflow", caseStudy.workflow);
        appendCaseStudySection(container, "Résultats", caseStudy.results);
    }

    function isPlatformFilter(filter) {
        return ["web", "mobile", "api"].indexOf(filter) !== -1;
    }

    function filterPlatformStacks(stacks, filter) {
        if (!stacks || stacks.length === 0) return [];
        if (!isPlatformFilter(filter)) return stacks;

        return stacks.filter(function (stack) {
            return stack.type === filter;
        });
    }

    function renderPlatformStacks(container, stacks, filter) {
        if (!container) return;
        container.innerHTML = "";
        var visibleStacks = filterPlatformStacks(stacks, filter);
        if (visibleStacks.length === 0) return;

        visibleStacks.forEach(function (stack) {
            var section = document.createElement("section");
            section.className = "rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50";

            var heading = document.createElement("h3");
            heading.className = "text-xs font-bold uppercase tracking-wider text-primary";
            heading.textContent = stack.label || "Plateforme";
            section.appendChild(heading);

            if (stack.description) {
                var description = document.createElement("p");
                description.className = "mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300";
                description.textContent = stack.description;
                section.appendChild(description);
            }

            var items = document.createElement("div");
            items.className = "mt-3 flex flex-wrap gap-2";
            (stack.items || []).forEach(function (item) {
                var tag = document.createElement("span");
                tag.className = "text-[10px] font-bold px-2 py-0.5 rounded border border-primary/20 bg-primary/5 text-primary uppercase";
                tag.textContent = item;
                items.appendChild(tag);
            });
            section.appendChild(items);
            container.appendChild(section);
        });
    }

    function getPlatformPreviewTags(stacks, fallbackTags, filter) {
        if (!stacks || stacks.length === 0) return fallbackTags || [];

        return filterPlatformStacks(stacks, filter)
            .reduce(function (items, stack) {
                return items.concat(stack.items || []);
            }, [])
            .filter(function (tag, index, items) {
                return tag && items.indexOf(tag) === index;
            });
    }

    function renderCardTechPreview(card, filter) {
        var tags = parseTagsJson(card.getAttribute("data-tags"));
        var platformStacks = parseTagsJson(card.getAttribute("data-platform-stacks"));
        var previewTags = getPlatformPreviewTags(platformStacks, tags, filter);
        var limit = platformStacks.length > 0 ? undefined : PREVIEW_COUNT;
        var fallbackCardIcon = card.getAttribute("data-icon") || "folder";
        card.querySelectorAll(".tech-icons-preview").forEach(function (container) {
            renderTechIcons(container, previewTags, limit, fallbackCardIcon);
        });
    }

    function renderModalPlatformIcons(container, stacks, tags, filter, fallbackIcon) {
        if (!container) return;
        if (!stacks || stacks.length === 0) {
            renderTechIcons(container, tags, undefined, fallbackIcon);
            container.classList.remove("hidden");
            return;
        }

        var previewTags = getPlatformPreviewTags(stacks, tags, filter);
        renderTechIcons(container, previewTags, undefined, fallbackIcon);
        container.classList.toggle("hidden", previewTags.length === 0);
    }

    function updateCardStackView(card, filter) {
        var stacks = parseTagsJson(card.getAttribute("data-platform-stacks"));
        if (!stacks.length) return;

        card.querySelectorAll(".platform-stack-card").forEach(function (stackEl) {
            var stackType = stackEl.getAttribute("data-stack-type");
            stackEl.classList.toggle("hidden", isPlatformFilter(filter) && stackType !== filter);
        });

        renderCardTechPreview(card, filter);
    }

    function replayCardReveal(cards) {
        cards.forEach(function (card, index) {
            if (card.style.display === "none") return;
            card.classList.remove("is-visible");
            card.style.transitionDelay = Math.min(index * 55, 220) + "ms";
            window.setTimeout(function () {
                card.classList.add("is-visible");
            }, 20);
        });
    }

    function initBackToTop() {
        var btn = document.getElementById("back-to-top");
        if (!btn) return;
        var threshold = 250;

        function toggle() {
            if (window.scrollY > threshold) btn.classList.remove("hidden");
            else btn.classList.add("hidden");
        }

        window.addEventListener("scroll", toggle, { passive: true });
        toggle();
    }

    function initProjects() {
        var filterBtns = document.querySelectorAll(".filter-btn");
        var cards = document.querySelectorAll(".project-card");
        var countEl = document.getElementById("project-count");
        var loadMoreWrap = document.getElementById("load-more-wrap");
        var loadMoreBtn = document.getElementById("load-more");
        var modal = document.getElementById("project-modal");
        var modalBackdrop = document.getElementById("project-modal-backdrop");
        var modalClose = document.getElementById("project-modal-close");
        var currentFilter = "all";
        var allowedFilters = Array.prototype.map.call(filterBtns, function (btn) {
            return btn.getAttribute("data-filter");
        });

        if (!projectGrid) return;

        function setActiveFilter(btn) {
            filterBtns.forEach(function (button) {
                button.classList.remove("bg-primary", "text-white", "shadow-md", "shadow-primary/10");
                button.classList.add("bg-slate-200", "dark:bg-slate-800");
            });
            if (btn) {
                btn.classList.add("bg-primary", "text-white", "shadow-md", "shadow-primary/10");
                btn.classList.remove("bg-slate-200", "dark:bg-slate-800");
            }
        }

        function updateVisibility(filter) {
            var index = 0;
            var totalMatching = 0;
            var visibleCards = [];
            cards.forEach(function (card) {
                var show = cardMatchesFilter(card, filter);
                if (show) totalMatching++;
                card.style.display = show ? "" : "none";
                if (show) {
                    updateCardStackView(card, filter);
                    var isMore = index >= PREVIEW_COUNT;
                    card.classList.toggle("project-card--more", isMore);
                    card.style.display = isMore ? "none" : "";
                    if (!isMore) visibleCards.push(card);
                    index++;
                }
            });
            if (countEl) countEl.textContent = totalMatching + " projet" + (totalMatching > 1 ? "s" : "");
            if (loadMoreWrap) loadMoreWrap.style.display = totalMatching > PREVIEW_COUNT ? "flex" : "none";
            replayCardReveal(visibleCards);
        }

        function closeModal() {
            if (!modal) return;
            modal.classList.add("hidden");
            document.body.style.overflow = "";
        }

        function openModal(card) {
            var title = card.getAttribute("data-title");
            var typeLabel = card.getAttribute("data-type-label");
            var description = card.getAttribute("data-description");
            var caseStudy = parseJsonObject(card.getAttribute("data-case-study"));
            var platformStacks = parseTagsJson(card.getAttribute("data-platform-stacks"));
            var statusLabel = card.getAttribute("data-status-label");
            var tagsJson = card.getAttribute("data-tags");
            var githubUrl = card.getAttribute("data-github-url");
            var demoUrl = card.getAttribute("data-demo-url");
            var detailUrl = card.getAttribute("data-detail-url");
            var icon = card.getAttribute("data-icon") || "folder";

            document.getElementById("project-modal-title").textContent = title;
            document.getElementById("project-modal-type").textContent = typeLabel;
            document.getElementById("project-modal-description").textContent = description;
            document.getElementById("project-modal-icon").textContent = icon;

            var statusWrap = document.getElementById("project-modal-status-wrap");
            var statusEl = document.getElementById("project-modal-status");
            if (statusWrap && statusEl) {
                statusEl.textContent = statusLabel || "";
                statusWrap.classList.toggle("hidden", !statusLabel);
            }

            var tags = parseTagsJson(tagsJson);
            var tagsEl = document.getElementById("project-modal-tags");
            var modalTechIconsEl = document.getElementById("project-modal-tech-icons");
            var caseStudyEl = document.getElementById("project-modal-case-study");
            var platformStacksEl = document.getElementById("project-modal-platform-stacks");
            tagsEl.innerHTML = "";
            modalTechIconsEl.innerHTML = "";
            renderCaseStudy(caseStudyEl, caseStudy);
            renderPlatformStacks(platformStacksEl, platformStacks, currentFilter);

            if (platformStacks.length === 0) {
                tags.forEach(function (tag) {
                    var span = document.createElement("span");
                    span.className = "text-[10px] font-bold px-2 py-0.5 rounded border border-primary/20 bg-primary/5 text-primary uppercase";
                    span.textContent = tag;
                    tagsEl.appendChild(span);
                });
            }
            renderModalPlatformIcons(modalTechIconsEl, platformStacks, tags, currentFilter, icon);

            var linksEl = document.getElementById("project-modal-links");
            linksEl.innerHTML = "";
            if (githubUrl) {
                var codeLink = document.createElement("a");
                codeLink.href = githubUrl;
                codeLink.target = "_blank";
                codeLink.rel = "noopener";
                codeLink.className = "inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white transition-colors text-sm font-medium";
                codeLink.innerHTML = "<span class=\"material-icons text-lg\">code</span> Code";
                linksEl.appendChild(codeLink);
            }
            if (demoUrl) {
                var demoLink = document.createElement("a");
                demoLink.href = demoUrl;
                demoLink.target = "_blank";
                demoLink.rel = "noopener";
                demoLink.className = "inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors text-sm font-medium";
                demoLink.innerHTML = "<span class=\"material-icons text-lg\">open_in_new</span> Visiter";
                linksEl.appendChild(demoLink);
            }
            if (detailUrl) {
                var detailLink = document.createElement("a");
                detailLink.href = detailUrl;
                detailLink.className = "inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:border-primary hover:text-primary transition-colors text-sm font-medium";
                detailLink.innerHTML = "<span class=\"material-icons text-lg\">article</span> Étude de cas";
                linksEl.appendChild(detailLink);
            }

            modal.classList.remove("hidden");
            document.body.style.overflow = "hidden";
        }

        filterBtns.forEach(function (btn) {
            btn.addEventListener("click", function (event) {
                event.stopPropagation();
                currentFilter = btn.getAttribute("data-filter");
                setActiveFilter(btn);
                updateVisibility(currentFilter);
            });
        });

        cards.forEach(function (card) {
            renderCardTechPreview(card, currentFilter);

            card.addEventListener("click", function (event) {
                if (event.target.closest("a")) return;
                event.preventDefault();
                openModal(card);
            });
            card.addEventListener("keydown", function (event) {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openModal(card);
                }
            });
        });

        if (loadMoreBtn) {
            loadMoreBtn.addEventListener("click", function () {
                var revealedCards = [];
                cards.forEach(function (card) {
                    var show = cardMatchesFilter(card, currentFilter);
                    if (show) {
                        card.classList.remove("project-card--more");
                        card.style.display = "";
                        revealedCards.push(card);
                    }
                });
                if (loadMoreWrap) loadMoreWrap.style.display = "none";
                replayCardReveal(revealedCards);
            });
        }

        if (modalBackdrop) modalBackdrop.addEventListener("click", closeModal);
        if (modalClose) modalClose.addEventListener("click", closeModal);
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && modal && !modal.classList.contains("hidden")) closeModal();
        });

        var requestedFilter = new URLSearchParams(window.location.search).get("filter");
        var initialFilter = allowedFilters.indexOf(requestedFilter) !== -1 ? requestedFilter : "all";
        currentFilter = initialFilter;
        setActiveFilter(document.querySelector(".filter-btn[data-filter=\"" + initialFilter + "\"]"));
        updateVisibility(initialFilter);
    }

    initBackToTop();
    initRevealOnScroll();
    initProjects();
})();
