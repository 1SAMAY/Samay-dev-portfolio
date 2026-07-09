import "../styles.css";

type Theme = "light" | "dark";
type ProjectCategory = "AI" | "Web" | "Extension" | "Game" | "Security" | "Portfolio";
type ProjectStatus = "Live" | "GitHub" | "Demo" | "Offline";

type ProjectMeta = {
  id: string;
  title: string;
  repoName: string;
  type: string;
  status: ProjectStatus;
  categories: ProjectCategory[];
  description: string;
  tech: string[];
  features: string[];
  github: string;
  live?: string;
};

const projects: ProjectMeta[] = [
  {
    id: "personal-ai-assistant",
    title: "Personal AI Assistant",
    repoName: "Personal-AI-Assistant",
    type: "AI productivity tool",
    status: "GitHub",
    categories: ["AI"],
    description: "An intelligent assistant for everyday productivity, task handling, and smoother personal workflows.",
    tech: ["Python", "AI", "Automation"],
    features: ["Task-focused assistant workflow", "Local productivity experiments", "Practical automation patterns"],
    github: "https://github.com/1SAMAY/Personal-AI-Assistant",
  },
  {
    id: "media-downloader-extension",
    title: "Media Downloader Extension",
    repoName: "media-downloader-extension",
    type: "Browser extension",
    status: "GitHub",
    categories: ["Extension"],
    description: "A browser extension designed to make downloading media quicker and more convenient from supported websites.",
    tech: ["JavaScript", "Extension", "Browser APIs"],
    features: ["Extension-first UI", "Browser workflow support", "Fast access to supported media actions"],
    github: "https://github.com/1SAMAY/media-downloader-extension",
  },
  {
    id: "game-store",
    title: "Game Store",
    repoName: "Game_Store",
    type: "E-commerce storefront",
    status: "Demo",
    categories: ["Web", "Game"],
    description: "A polished game store concept focused on browsing titles, categories, and product presentation.",
    tech: ["PHP", "Storefront", "UI"],
    features: ["Product-style game cards", "Category browsing concept", "Live deployed storefront"],
    github: "https://github.com/1SAMAY/Game_Store",
    live: "https://game-store-1-8ibl.onrender.com",
  },
  {
    id: "devdock",
    title: "DevDock",
    repoName: "DevDock",
    type: "Developer productivity UI",
    status: "GitHub",
    categories: ["Web"],
    description: "A developer-focused workspace concept for organizing tools, tasks, and daily work in one clean interface.",
    tech: ["JavaScript", "Productivity", "Dashboard"],
    features: ["Workspace-style layout", "Developer tool organization", "Clean command-center presentation"],
    github: "https://github.com/1SAMAY/DevDock",
  },
  {
    id: "airtouch",
    title: "AirTouch",
    repoName: "AirTouch",
    type: "Desktop AI controller",
    status: "GitHub",
    categories: ["AI"],
    description: "A Python webcam controller that uses hand gestures to move the cursor, click, scroll, and trigger useful system actions.",
    tech: ["Python", "Computer Vision", "Desktop"],
    features: ["Gesture-based control", "Mouse and scroll actions", "Webcam-powered interface"],
    github: "https://github.com/1SAMAY/AirTouch",
  },
  {
    id: "donttrust",
    title: "DontTrust",
    repoName: "DontTrust",
    type: "Desktop simulation",
    status: "GitHub",
    categories: ["Security"],
    description: "A Windows-style Python desktop simulation built for visual practice with a dramatic command-prompt interface.",
    tech: ["Python", "Desktop", "Simulation"],
    features: ["Windows-inspired visual flow", "Command-prompt styling", "Desktop practice project"],
    github: "https://github.com/1SAMAY/DontTrust",
  },
  {
    id: "visiontext-ai",
    title: "VisionText AI",
    repoName: "VisionText-AI",
    type: "AI OCR web app",
    status: "Live",
    categories: ["AI", "Web"],
    description: "A production-ready OCR web app that converts images, screenshots, camera captures, and scanned PDFs into editable text.",
    tech: ["JavaScript", "OCR", "AI"],
    features: ["Image and screenshot OCR", "Camera capture workflow", "Scanned PDF text extraction"],
    github: "https://github.com/1SAMAY/VisionText-AI",
    live: "https://ai-photo-to-text-website-ocr.vercel.app",
  },
  {
    id: "cookie-sync",
    title: "Cookie Sync",
    repoName: "Cookie-Sync",
    type: "Security browser extension",
    status: "GitHub",
    categories: ["Extension", "Security"],
    description: "A Manifest V3 Chrome extension for cookie export, preview, import, validation, restoration, and auth security review.",
    tech: ["JavaScript", "MV3", "Security"],
    features: ["Cookie export and import", "Validation and restoration", "Authentication security review"],
    github: "https://github.com/1SAMAY/Cookie-Sync",
  },
  {
    id: "fun-game",
    title: "Fun Game",
    repoName: "Fun-Game",
    type: "Browser game",
    status: "GitHub",
    categories: ["Game", "Web"],
    description: "A responsive Whack-a-Mole browser game with a timer challenge, real-time scoring, combo bonuses, and animated UI effects.",
    tech: ["JavaScript", "Game UI", "Animation"],
    features: ["Timer challenge", "Real-time scoring", "Combo bonuses and animated UI"],
    github: "https://github.com/1SAMAY/Fun-Game",
  },
  {
    id: "samay-portfolio",
    title: "Samay Portfolio",
    repoName: "SAMAY-PORTFOLIO",
    type: "Portfolio experience",
    status: "Live",
    categories: ["Portfolio", "Web"],
    description: "A React, TypeScript, and Tailwind portfolio experience with cinematic sections, animated loading, and project cards.",
    tech: ["TypeScript", "React", "Tailwind"],
    features: ["Cinematic sections", "Animated loading flow", "Live deployed portfolio"],
    github: "https://github.com/1SAMAY/SAMAY-PORTFOLIO",
    live: "https://project-goal-create-a-modern-futuri.vercel.app",
  },
  {
    id: "codeguard-os",
    title: "CodeGuard OS",
    repoName: "CodeGuard-OS-",
    type: "Offline security scanner",
    status: "Offline",
    categories: ["Security", "Web"],
    description: "An offline source code analysis platform with local scanning, security scoring, reports, and Windows desktop packaging.",
    tech: ["Python", "FastAPI", "Next.js", "SQLite"],
    features: ["ZIP and local folder scans", "Security vulnerability detection", "HTML and PDF report generation"],
    github: "https://github.com/1SAMAY/CodeGuard-OS-",
  },
  {
    id: "repogalaxy",
    title: "RepoGalaxy",
    repoName: "-RepoGalaxy",
    type: "3D GitHub visualizer",
    status: "GitHub",
    categories: ["Web"],
    description: "A pure client-side GitHub visualizer that turns public users or repositories into interactive 3D repo and project graphs.",
    tech: ["JavaScript", "3D Graph", "GitHub API"],
    features: ["User and repo visualization", "Interactive 3D project graph", "Client-side only architecture"],
    github: "https://github.com/1SAMAY/-RepoGalaxy",
  },
  {
    id: "pdfshield-pro",
    title: "PDFShield Pro",
    repoName: "PDFShield-Pro",
    type: "PDF security suite",
    status: "Offline",
    categories: ["Security", "Web"],
    description: "A local PDF protection suite with encryption, authorized unlocking, batch processing, privacy handling, and a polished dashboard.",
    tech: ["TypeScript", "FastAPI", "PDF", "Docker"],
    features: ["PDF encryption workflows", "Authorized unlock support", "Batch processing with local privacy"],
    github: "https://github.com/1SAMAY/PDFShield-Pro",
  },
  {
    id: "samay-dev-portfolio",
    title: "Samay Dev Portfolio",
    repoName: "Samay-dev-portfolio",
    type: "Current portfolio",
    status: "Live",
    categories: ["Portfolio", "Web"],
    description: "The current personal portfolio site with dark/light mode, animated UI, project sections, and downloadable resume support.",
    tech: ["TypeScript", "Vite", "CSS"],
    features: ["Interactive project showcase", "Generated resume PDF", "Fast Vite static build"],
    github: "https://github.com/1SAMAY/Samay-dev-portfolio",
    live: "https://samay-dev-portfolio.vercel.app",
  },
  {
    id: "samay-github-io",
    title: "Samay GitHub IO",
    repoName: "Samay.github.io",
    type: "GitHub Pages site",
    status: "GitHub",
    categories: ["Portfolio", "Web"],
    description: "A GitHub Pages repository reserved for publishing static portfolio experiments, web pages, and personal site assets.",
    tech: ["GitHub Pages", "Static Site", "Portfolio"],
    features: ["Static publishing target", "Portfolio experiments", "Personal site assets"],
    github: "https://github.com/1SAMAY/Samay.github.io",
  },
  {
    id: "samay",
    title: "SAMAY",
    repoName: "SAMAY",
    type: "Personal repository",
    status: "GitHub",
    categories: ["Portfolio"],
    description: "A personal GitHub repository for profile content, learning experiments, and developer identity material connected to the main portfolio.",
    tech: ["GitHub", "Profile", "Portfolio"],
    features: ["Profile materials", "Learning experiments", "Portfolio identity content"],
    github: "https://github.com/1SAMAY/SAMAY",
  },
  {
    id: "1samay",
    title: "1SAMAY",
    repoName: "1SAMAY",
    type: "GitHub profile README",
    status: "GitHub",
    categories: ["Portfolio"],
    description: "The GitHub profile repository for account-level README content, profile presentation, and public developer portfolio links.",
    tech: ["GitHub", "README", "Profile"],
    features: ["Profile README content", "Public portfolio links", "Developer identity surface"],
    github: "https://github.com/1SAMAY/1SAMAY",
  },
];

const body = document.body;
const progress = document.querySelector<HTMLSpanElement>("[data-progress]");
const scrollProgress = document.querySelector<HTMLSpanElement>("[data-scroll-progress]");
const themeToggle = document.querySelector<HTMLButtonElement>("[data-theme-toggle]");
const moreToggle = document.querySelector<HTMLButtonElement>("[data-more-toggle]");
const moreProjects = document.querySelector<HTMLElement>("[data-more-projects]");
const githubPopup = document.querySelector<HTMLElement>("[data-github-popup-box]");
const projectSearch = document.querySelector<HTMLInputElement>("[data-project-search]");
const projectCount = document.querySelector<HTMLSpanElement>("[data-project-count]");
const projectResults = document.querySelector<HTMLElement>("[data-project-results]");
const projectSpotlight = document.querySelector<HTMLElement>("[data-project-spotlight]");
const projectModal = document.querySelector<HTMLElement>("[data-project-modal]");
const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>(".nav a"));
const sections = Array.from(document.querySelectorAll<HTMLElement>("main section[id]"));
const revealTargets = document.querySelectorAll<HTMLElement>(
  ".boot-card, .hero-copy, .terminal-card, .featured-card, .project-card, .about-card, .contact-card, .section-head, .more-head, .project-controls, .project-results, .stats-strip, .stack-grid, .footer-marquee"
);

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");
const projectByTitle = new Map(projects.map((project) => [project.title.replace(/[^a-z0-9]/gi, "").toLowerCase(), project]));

let moreExpanded = false;
let activeFilter: ProjectCategory | "All" = "All";
let displayedProjectCount = projects.length;
let lastModalTrigger: HTMLElement | null = null;

const animateBootBar = () => {
  if (!progress) return;
  const delays = [200, 650, 1100, 1650, 2250, 2900, 3400];
  delays.forEach((delay, index) => {
    window.setTimeout(() => {
      progress.style.width = `${Math.min(18 + index * 13, 100)}%`;
    }, delay);
  });
};

let scrollRaf = 0;
const updateScrollEffects = () => {
  const scrollTop = window.scrollY || window.pageYOffset;
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const progressValue = Math.min(1, Math.max(0, scrollTop / maxScroll));

  if (scrollProgress) {
    scrollProgress.style.width = `${progressValue * 100}%`;
  }

  body.style.setProperty("--parallax-hero", `${scrollTop * 0.08}px`);
  body.style.setProperty("--parallax-orb-1", `${scrollTop * 0.05}px`);
  body.style.setProperty("--parallax-orb-2", `${scrollTop * -0.04}px`);
};

const onScroll = () => {
  if (scrollRaf) return;
  scrollRaf = window.requestAnimationFrame(() => {
    updateScrollEffects();
    scrollRaf = 0;
  });
};

const setTheme = (theme: Theme) => {
  body.dataset.theme = theme;
  localStorage.setItem("theme", theme);
  if (themeToggle) {
    themeToggle.textContent = theme === "light" ? "Dark" : "Light";
  }
};

const initTheme = () => {
  const savedTheme = localStorage.getItem("theme") as Theme | null;
  const theme = savedTheme === "light" || savedTheme === "dark"
    ? savedTheme
    : window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";

  setTheme(theme);

  themeToggle?.addEventListener("click", () => {
    const nextTheme: Theme = body.dataset.theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
  });
};

const setMoreProjectsExpanded = (expanded: boolean) => {
  if (!moreToggle || !moreProjects) return;
  moreExpanded = expanded;
  moreProjects.dataset.collapsed = String(!expanded);
  moreProjects.setAttribute("aria-hidden", String(!expanded));
  moreToggle.textContent = expanded ? "Show less projects" : "Show more projects";
  moreToggle.setAttribute("aria-expanded", String(expanded));
};

const initMoreProjects = () => {
  if (!moreToggle || !moreProjects) return;
  setMoreProjectsExpanded(moreProjects.dataset.collapsed !== "true");
  moreToggle.addEventListener("click", () => {
    setMoreProjectsExpanded(!moreExpanded);
  });
};

const tag = (text: string, className = "") => {
  const element = document.createElement("span");
  element.textContent = text;
  if (className) element.className = className;
  return element;
};

const actionLink = (label: string, href: string, variant = "") => {
  const link = document.createElement("a");
  link.className = `project-action ${variant}`.trim();
  link.href = href;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.textContent = label;
  if (label === "GitHub") {
    link.dataset.githubPopup = href.split("/").pop() ?? "repository";
  }
  return link;
};

const createPreview = (project: ProjectMeta) => {
  const preview = document.createElement("aside");
  preview.className = "project-preview";
  preview.setAttribute("aria-hidden", "true");

  const media = document.createElement("div");
  media.className = project.live ? "preview-media has-live" : "preview-media";

  if (project.live) {
    const browserBar = document.createElement("div");
    browserBar.className = "preview-browser-bar";
    browserBar.append(tag("live preview"));

    const iframe = document.createElement("iframe");
    iframe.className = "preview-frame";
    iframe.title = `${project.title} live preview`;
    iframe.loading = "lazy";
    iframe.src = project.live;
    iframe.setAttribute("sandbox", "allow-scripts allow-same-origin allow-popups allow-forms");

    const fallback = document.createElement("div");
    fallback.className = "preview-fallback";
    fallback.textContent = "Live site preview";

    media.append(browserBar, iframe, fallback);
  } else {
    const repoCard = document.createElement("div");
    repoCard.className = "repo-preview";
    repoCard.append(tag(project.repoName, "repo-preview__name"));

    const description = document.createElement("p");
    description.textContent = "Open repository to explore source code";

    const miniTags = document.createElement("div");
    miniTags.className = "repo-preview__tags";
    project.tech.slice(0, 3).forEach((item) => miniTags.append(tag(item)));

    repoCard.append(description, miniTags);
    media.append(repoCard);
  }

  const actions = document.createElement("div");
  actions.className = "project-actions";
  if (project.live) {
    actions.append(actionLink("Live Demo", project.live, "is-live"));
  }
  actions.append(actionLink("GitHub", project.github));

  const details = document.createElement("button");
  details.className = "project-action is-details";
  details.type = "button";
  details.dataset.viewDetails = project.id;
  details.textContent = "View Details";
  actions.append(details);

  preview.append(media, actions);
  return preview;
};

const activateProject = (card: HTMLElement, project: ProjectMeta) => {
  document.querySelectorAll<HTMLElement>(".featured-card.is-preview, .project-card.is-preview").forEach((item) => {
    if (item !== card && !canHover.matches) item.classList.remove("is-preview");
  });

  card.classList.add("is-preview");
  projectSpotlight?.classList.add("is-active");
  projectSpotlight?.style.setProperty("--spotlight-label", `"${project.type}"`);
};

const deactivateProject = (card: HTMLElement) => {
  if (!canHover.matches) return;
  card.classList.remove("is-preview");
  projectSpotlight?.classList.remove("is-active");
  card.style.setProperty("--tilt-x", "0deg");
  card.style.setProperty("--tilt-y", "0deg");
};

const bindCardMotion = (card: HTMLElement, project: ProjectMeta) => {
  let raf = 0;
  let latestEvent: PointerEvent | null = null;

  const updateMotion = () => {
    if (!latestEvent) return;
    const rect = card.getBoundingClientRect();
    const x = latestEvent.clientX - rect.left;
    const y = latestEvent.clientY - rect.top;
    const px = Math.min(100, Math.max(0, (x / rect.width) * 100));
    const py = Math.min(100, Math.max(0, (y / rect.height) * 100));

    card.style.setProperty("--mx", `${px}%`);
    card.style.setProperty("--my", `${py}%`);

    if (!prefersReducedMotion.matches && canHover.matches) {
      card.style.setProperty("--tilt-x", `${(50 - py) / 8}deg`);
      card.style.setProperty("--tilt-y", `${(px - 50) / 8}deg`);
    }

    const spotlightRect = projectSpotlight?.parentElement?.getBoundingClientRect();
    if (spotlightRect && projectSpotlight) {
      projectSpotlight.style.setProperty("--spot-x", `${latestEvent.clientX - spotlightRect.left}px`);
      projectSpotlight.style.setProperty("--spot-y", `${latestEvent.clientY - spotlightRect.top}px`);
    }

    raf = 0;
  };

  card.addEventListener("pointermove", (event) => {
    latestEvent = event;
    if (!raf) raf = window.requestAnimationFrame(updateMotion);
  });

  card.addEventListener("pointerenter", () => activateProject(card, project));
  card.addEventListener("pointerleave", () => deactivateProject(card));
  card.addEventListener("focusin", () => activateProject(card, project));
  card.addEventListener("focusout", (event) => {
    if (card.contains(event.relatedTarget as Node | null)) return;
    deactivateProject(card);
  });

  card.addEventListener("click", (event) => {
    if (canHover.matches) return;
    if ((event.target as HTMLElement).closest("a, button")) return;
    const isOpen = card.classList.contains("is-preview");
    document.querySelectorAll<HTMLElement>(".featured-card.is-preview, .project-card.is-preview").forEach((item) => {
      item.classList.remove("is-preview");
    });
    if (!isOpen) activateProject(card, project);
  });
};

const initProjectExperience = () => {
  const cards = Array.from(document.querySelectorAll<HTMLElement>(".featured-card, .project-card"));
  const cardRecords = cards
    .map((card) => {
      const title = card.querySelector("h3")?.textContent?.trim() ?? "";
      const project = projectByTitle.get(title.replace(/[^a-z0-9]/gi, "").toLowerCase());
      return project ? { card, project } : null;
    })
    .filter((record): record is { card: HTMLElement; project: ProjectMeta } => record !== null);

  cardRecords.forEach(({ card, project }) => {
    card.classList.add("project-enhanced");
    card.dataset.projectId = project.id;
    card.dataset.projectCategories = project.categories.join(" ");
    card.tabIndex = 0;
    card.setAttribute("aria-label", `${project.title} project preview`);

    const status = document.createElement("span");
    status.className = `status-badge status-${project.status.toLowerCase()}`;
    status.textContent = project.status;
    const top = card.querySelector(".card-label, .project-top");
    top?.insertAdjacentElement("afterend", status);

    card.append(createPreview(project));
    bindCardMotion(card, project);
  });

  const updateVisibleProjects = () => {
    const query = projectSearch?.value.trim().toLowerCase() ?? "";
    const filterActive = activeFilter !== "All" || query.length > 0;
    let visibleCount = 0;

    if (filterActive) {
      setMoreProjectsExpanded(true);
    }

    cardRecords.forEach(({ card, project }) => {
      const haystack = [
        project.title,
        project.repoName,
        project.type,
        project.description,
        project.status,
        ...project.categories,
        ...project.tech,
        ...project.features,
      ].join(" ").toLowerCase();
      const matchesFilter = activeFilter === "All" || project.categories.includes(activeFilter);
      const matchesSearch = !query || haystack.includes(query);
      const visible = matchesFilter && matchesSearch;

      card.hidden = !visible;
      card.classList.toggle("is-filtered-out", !visible);
      if (visible) visibleCount += 1;
    });

    if (projectResults) {
      projectResults.textContent = visibleCount === projects.length
        ? `${projects.length} projects ready`
        : `Showing ${visibleCount} of ${projects.length} projects`;
    }
    animateProjectCount(visibleCount);
  };

  document.querySelectorAll<HTMLButtonElement>("[data-project-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = (button.dataset.projectFilter ?? "All") as ProjectCategory | "All";
      document.querySelectorAll<HTMLButtonElement>("[data-project-filter]").forEach((item) => {
        const selected = item === button;
        item.classList.toggle("is-active", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
      updateVisibleProjects();
    });
  });

  projectSearch?.addEventListener("input", updateVisibleProjects);
  updateVisibleProjects();
};

const animateProjectCount = (target: number) => {
  if (!projectCount) return;
  if (prefersReducedMotion.matches) {
    displayedProjectCount = target;
    projectCount.textContent = String(target);
    return;
  }

  const start = displayedProjectCount;
  const delta = target - start;
  const duration = 420;
  const started = performance.now();

  const tick = (now: number) => {
    const progressValue = Math.min(1, (now - started) / duration);
    const eased = 1 - Math.pow(1 - progressValue, 3);
    const next = Math.round(start + delta * eased);
    projectCount.textContent = String(next);

    if (progressValue < 1) {
      window.requestAnimationFrame(tick);
    } else {
      displayedProjectCount = target;
      projectCount.textContent = String(target);
    }
  };

  window.requestAnimationFrame(tick);
};

const openProjectModal = (project: ProjectMeta, trigger: HTMLElement) => {
  if (!projectModal) return;
  lastModalTrigger = trigger;

  projectModal.querySelector<HTMLElement>("[data-modal-type]")!.textContent = project.type;
  projectModal.querySelector<HTMLElement>("[data-modal-title]")!.textContent = project.title;
  projectModal.querySelector<HTMLElement>("[data-modal-description]")!.textContent = project.description;

  const tech = projectModal.querySelector<HTMLElement>("[data-modal-tech]")!;
  tech.replaceChildren(...project.tech.map((item) => tag(item)));

  const features = projectModal.querySelector<HTMLUListElement>("[data-modal-features]")!;
  features.replaceChildren(...project.features.map((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    return li;
  }));

  const actions = projectModal.querySelector<HTMLElement>("[data-modal-actions]")!;
  const actionItems = [actionLink("GitHub", project.github)];
  if (project.live) {
    actionItems.unshift(actionLink("Live Demo", project.live, "is-live"));
  }
  actions.replaceChildren(...actionItems);

  projectModal.hidden = false;
  projectModal.setAttribute("aria-hidden", "false");
  body.classList.add("modal-open");
  projectModal.querySelector<HTMLButtonElement>("[data-modal-close]")?.focus();
};

const closeProjectModal = () => {
  if (!projectModal || projectModal.hidden) return;
  projectModal.hidden = true;
  projectModal.setAttribute("aria-hidden", "true");
  body.classList.remove("modal-open");
  lastModalTrigger?.focus();
};

const initProjectModal = () => {
  document.addEventListener("click", (event) => {
    const detailButton = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-view-details]");
    if (detailButton) {
      const project = projects.find((item) => item.id === detailButton.dataset.viewDetails);
      if (project) openProjectModal(project, detailButton);
      return;
    }

    if ((event.target as HTMLElement).closest("[data-modal-close]")) {
      closeProjectModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeProjectModal();
  });
};

const initGithubPopup = () => {
  if (!githubPopup) return;

  const links = document.querySelectorAll<HTMLAnchorElement>("[data-github-popup]");

  const hidePopup = () => {
    githubPopup.classList.remove("is-visible");
    githubPopup.setAttribute("hidden", "");
    githubPopup.setAttribute("aria-hidden", "true");
  };

  const showPopup = (link: HTMLAnchorElement) => {
    const repo = link.dataset.githubPopup ?? "repository";
    const rect = link.getBoundingClientRect();
    const popupWidth = Math.min(280, window.innerWidth - 24);
    const preferredLeft = rect.left;
    const clampedLeft = Math.min(Math.max(12, preferredLeft), Math.max(12, window.innerWidth - popupWidth - 12));
    const preferredTop = rect.top - 14;
    const popupTop = preferredTop < 120 ? rect.bottom + 14 : preferredTop - 120;

    githubPopup.style.left = `${clampedLeft}px`;
    githubPopup.style.top = `${Math.max(12, popupTop)}px`;
    githubPopup.querySelector(".github-popup__title")!.textContent = "github preview";
    githubPopup.querySelector(".github-popup__body")!.innerHTML = `
      <p>$ open repository</p>
      <p>${repo}</p>
      <p>Open GitHub to view the project source.</p>
    `;
    githubPopup.removeAttribute("hidden");
    githubPopup.setAttribute("aria-hidden", "false");
    githubPopup.classList.add("is-visible");
  };

  links.forEach((link) => {
    link.addEventListener("pointerenter", () => showPopup(link));
    link.addEventListener("pointerleave", hidePopup);
    link.addEventListener("focus", () => showPopup(link));
    link.addEventListener("blur", hidePopup);
  });

  window.addEventListener("scroll", hidePopup, { passive: true });
  window.addEventListener("resize", hidePopup);
  document.addEventListener("pointerdown", (event) => {
    if (!githubPopup.contains(event.target as Node)) {
      hidePopup();
    }
  });
};

const initReveal = () => {
  revealTargets.forEach((el, index) => {
    el.classList.add("reveal", `reveal-delay-${Math.min((index % 5) + 1, 5)}`);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealTargets.forEach((target) => observer.observe(target));
};

const initScrollSpy = () => {
  if (!sections.length || !navLinks.length) return;

  const linkMap = new Map(
    navLinks
      .map((link) => {
        const id = link.getAttribute("href")?.replace("#", "");
        return id ? [id, link] : null;
      })
      .filter((entry): entry is [string, HTMLAnchorElement] => entry !== null)
  );

  const activate = (id: string) => {
    navLinks.forEach((link) => link.classList.remove("is-active"));
    linkMap.get(id)?.classList.add("is-active");
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) {
        activate((visible.target as HTMLElement).id);
      }
    },
    {
      threshold: [0.25, 0.35, 0.5, 0.65],
      rootMargin: "-15% 0px -55% 0px",
    }
  );

  sections.forEach((section) => observer.observe(section));
  activate(sections[0].id);
};

const initParallax = () => {
  updateScrollEffects();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", updateScrollEffects);
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
};

const initParticles = () => {
  const canvas = document.getElementById("particle-canvas") as HTMLCanvasElement | null;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const reduceMotion = prefersReducedMotion.matches;
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const particles: Particle[] = [];
  const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  const palette = (): string[] => {
    return body.dataset.theme === "light"
      ? ["rgba(7, 19, 29, 0.14)", "rgba(122, 169, 255, 0.24)", "rgba(12, 33, 50, 0.16)"]
      : ["rgba(142, 240, 200, 0.24)", "rgba(122, 169, 255, 0.22)", "rgba(255, 184, 107, 0.18)"];
  };

  const resize = () => {
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const spawnParticles = () => {
    particles.length = 0;
    const count = Math.min(72, Math.max(40, Math.floor(window.innerWidth / 18)));
    const colors = palette();

    for (let i = 0; i < count; i += 1) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        radius: 0.9 + Math.random() * 2.1,
        color: colors[i % colors.length],
      });
    }
  };

  const draw = () => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (const particle of particles) {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < -20) particle.x = window.innerWidth + 20;
      if (particle.x > window.innerWidth + 20) particle.x = -20;
      if (particle.y < -20) particle.y = window.innerHeight + 20;
      if (particle.y > window.innerHeight + 20) particle.y = -20;

      const dx = particle.x - pointer.x;
      const dy = particle.y - pointer.y;
      const distance = Math.hypot(dx, dy);
      const attraction = Math.max(0, 1 - distance / 260);

      ctx.beginPath();
      ctx.fillStyle = particle.color;
      ctx.arc(
        particle.x + attraction * 10,
        particle.y + attraction * 10,
        particle.radius + attraction * 0.8,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    for (let i = 0; i < particles.length; i += 1) {
      for (let j = i + 1; j < particles.length; j += 1) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.hypot(dx, dy);

        if (distance < 125) {
          const alpha = body.dataset.theme === "light"
            ? 0.08 * (1 - distance / 125)
            : 0.12 * (1 - distance / 125);

          ctx.strokeStyle = body.dataset.theme === "light"
            ? `rgba(7, 19, 29, ${alpha})`
            : `rgba(142, 240, 200, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
  };

  const tick = () => {
    draw();
    if (!reduceMotion) {
      requestAnimationFrame(tick);
    }
  };

  const refresh = () => {
    resize();
    spawnParticles();
    draw();
  };

  window.addEventListener("resize", refresh);
  window.addEventListener("pointermove", (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
  });

  refresh();
  if (!reduceMotion) {
    requestAnimationFrame(tick);
  }
};

const initMagneticButtons = () => {
  if (prefersReducedMotion.matches || !canHover.matches) return;

  document.querySelectorAll<HTMLElement>(".nav a, .button, .more-btn, .filter-chip, .project-links a, .project-action").forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      button.style.transform = `translate3d(${x * 0.12}px, ${y * 0.18}px, 0)`;
    });
    button.addEventListener("pointerleave", () => {
      button.style.transform = "";
    });
  });
};

const initMicroInteractions = () => {
  document.querySelectorAll<HTMLElement>(".nav a, .button, .ticker span").forEach((link) => {
    link.addEventListener("click", () => {
      document.body.animate(
        [
          { transform: "translateY(0px)" },
          { transform: "translateY(-1px)" },
          { transform: "translateY(0px)" },
        ],
        { duration: 180, easing: "ease-out" }
      );
    });
  });
};

initTheme();
initMoreProjects();
initProjectExperience();
initProjectModal();
let codeCityLoad: Promise<void> | null = null;

const loadCodeCity = () => {
  if (!codeCityLoad) {
    codeCityLoad = import("./codeCity").then(({ initCodeCity }) => {
      initCodeCity(projects);
    });
  }
  return codeCityLoad;
};

const codeCityRoot = document.querySelector<HTMLElement>("[data-code-city-root]");
if (codeCityRoot) {
  const cityObserver = new IntersectionObserver((entries, observer) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      observer.disconnect();
      void loadCodeCity();
    }
  }, { rootMargin: "240px" });
  cityObserver.observe(codeCityRoot);
}

document.querySelectorAll<HTMLElement>("[data-enter-code-city]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    void loadCodeCity();
  });
});
initGithubPopup();
initReveal();
initScrollSpy();
initParallax();
animateBootBar();
initParticles();
initMagneticButtons();
initMicroInteractions();
