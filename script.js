const root = document.documentElement;
const body = document.body;
const themeToggle = document.getElementById("themeToggle");
const monoToggle = document.getElementById("monoToggle");
const menuButton = document.getElementById("menuButton");
const mobileMenu = document.getElementById("mobileMenu");
const scrollProgress = document.getElementById("scrollProgress");

const storedTheme = localStorage.getItem("ae-theme");
const storedMono = localStorage.getItem("ae-mono");

if (storedTheme === "dark") {
  body.setAttribute("data-theme", "dark");
}

if (storedMono === "true") {
  body.classList.add("monochrome");
  monoToggle.setAttribute("aria-pressed", "true");
}

themeToggle.addEventListener("click", () => {
  const dark = body.getAttribute("data-theme") === "dark";
  if (dark) {
    body.removeAttribute("data-theme");
    localStorage.setItem("ae-theme", "light");
  } else {
    body.setAttribute("data-theme", "dark");
    localStorage.setItem("ae-theme", "dark");
  }
});

monoToggle.addEventListener("click", () => {
  const active = body.classList.toggle("monochrome");
  monoToggle.setAttribute("aria-pressed", String(active));
  localStorage.setItem("ae-mono", String(active));
});

menuButton.addEventListener("click", () => {
  const open = mobileMenu.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
  mobileMenu.setAttribute("aria-hidden", String(!open));
});

mobileMenu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

const stat = document.querySelector(".stat-number");
let counterStarted = false;

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !counterStarted) {
      counterStarted = true;
      const target = Number(stat.dataset.target || 50);
      const start = performance.now();
      const duration = 1100;

      const animate = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        stat.textContent = Math.round(target * eased);
        if (progress < 1) requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
      counterObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

if (stat) counterObserver.observe(stat);

window.addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
  scrollProgress.style.width = `${progress}%`;
}, { passive: true });
