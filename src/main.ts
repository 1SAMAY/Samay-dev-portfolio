import "../styles.css";

type Theme = "light" | "dark";

const body = document.body;
const progress = document.querySelector<HTMLSpanElement>("[data-progress]");
const scrollProgress = document.querySelector<HTMLSpanElement>("[data-scroll-progress]");
const themeToggle = document.querySelector<HTMLButtonElement>("[data-theme-toggle]");
const moreToggle = document.querySelector<HTMLButtonElement>("[data-more-toggle]");
const moreProjects = document.querySelector<HTMLElement>("[data-more-projects]");
const githubPopup = document.querySelector<HTMLElement>("[data-github-popup-box]");
const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>(".nav a"));
const sections = Array.from(document.querySelectorAll<HTMLElement>("main section[id]"));
const revealTargets = document.querySelectorAll<HTMLElement>(
  ".boot-card, .hero-copy, .terminal-card, .featured-card, .project-card, .about-card, .contact-card, .section-head, .more-head, .stats-strip, .stack-grid, .footer-marquee"
);

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

const initMoreProjects = () => {
  if (!moreToggle || !moreProjects) return;

  moreToggle.addEventListener("click", () => {
    const hidden = moreProjects.hasAttribute("hidden");
    if (hidden) {
      moreProjects.removeAttribute("hidden");
      moreToggle.textContent = "Show less projects";
    } else {
      moreProjects.setAttribute("hidden", "");
      moreToggle.textContent = "Show more projects";
    }
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
    githubPopup.querySelector(".github-popup__title")!.textContent = `github preview`;
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

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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

initTheme();
initMoreProjects();
initGithubPopup();
initReveal();
initScrollSpy();
initParallax();
animateBootBar();
initParticles();
