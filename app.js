document.addEventListener("DOMContentLoaded", async () => {
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];
  const setText = (selector, value, root = document) => {
    const el = qs(selector, root);
    if (el) el.textContent = value;
  };

  // Dark mode is the default. Remember a visitor's explicit theme choice.
  const themeToggle = qs("#theme-toggle");
  const themeIcon = qs(".theme-toggle-icon", themeToggle || document);
  const themeLabel = qs(".theme-toggle-label", themeToggle || document);
  let savedTheme = "dark";
  try {
    const storedTheme = window.localStorage.getItem("portfolio-theme");
    if (storedTheme === "light" || storedTheme === "dark") savedTheme = storedTheme;
  } catch (_) {
    // Storage may be unavailable in private browsing; the default still works.
  }

  function applyTheme(theme) {
    const isLight = theme === "light";
    document.documentElement.dataset.theme = isLight ? "light" : "dark";
    document.documentElement.style.colorScheme = isLight ? "light" : "dark";
    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", String(isLight));
      themeToggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
    }
    if (themeIcon) themeIcon.textContent = isLight ? "☾" : "☀";
    if (themeLabel) themeLabel.textContent = isLight ? "Dark mode" : "Light mode";
  }

  applyTheme(savedTheme);
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
      applyTheme(nextTheme);
      try {
        window.localStorage.setItem("portfolio-theme", nextTheme);
      } catch (_) {
        // Theme switching remains functional without persistence.
      }
    });
  }

  // The JSON file is the content source of truth. The existing HTML remains
  // as a stable visual shell so the design does not depend on a framework.
  let career;
  try {
    const response = await fetch("data/career.json", { cache: "no-store" });
    if (!response.ok) throw new Error("career.json could not be loaded");
    career = await response.json();
    renderCareer(career);
  } catch (error) {
    console.warn("Using static HTML fallback:", error);
  }

  function renderCareer(data) {
    const { profile } = data;

    document.title = `${profile.name} | ${profile.title}`;
    const logo = qs(".nav-logo");
    if (logo) logo.textContent = profile.name;

    setText(".status-text", `${profile.title} @ ${profile.company}`);
    setText(".hero-title", "");
    const heroTitle = qs(".hero-title");
    if (heroTitle) heroTitle.innerHTML = escapeHtml(profile.title);
    const heroDescription = qs(".hero-description");
    if (heroDescription) heroDescription.innerHTML = escapeHtml(profile.description)
      .replace(/Zscaler Posture Control \(ZPC\)/g, "<strong>Zscaler Posture Control (ZPC)</strong>")
      .replace(/DSPM/g, "<strong>DSPM</strong>")
      .replace(/AI Security/g, "<strong>AI Security</strong>");

    renderProducts(data.products);
    renderPatents(data.patents);
    renderSkills(data.skills);
    renderProjects(data.projects || []);
    renderCertifications(data.certifications || []);
    renderCareerTimeline(data.career);

    setText(".contact-title", data.contact.title);
    setText(".contact-subtitle", data.contact.subtitle);
    const locationValue = qsa(".details-item .value").find(el => el.textContent.trim() === "Hyderabad, India");
    if (locationValue) locationValue.textContent = data.contact.location;

    const email = qs('a[href^="mailto:"]');
    if (email) {
      email.href = `mailto:${profile.email}`;
      email.textContent = profile.email;
    }

    const socialLinks = qsa(".social-channels a");
    if (socialLinks[0]) socialLinks[0].href = profile.linkedin;
    if (socialLinks[1]) socialLinks[1].href = profile.github;
    if (socialLinks[2]) socialLinks[2].href = profile.twitter;

    const githubProfile = qs("#repo-2");
    if (githubProfile) githubProfile.href = profile.github;

    const footerLogo = qs(".footer-logo");
    if (footerLogo) footerLogo.textContent = profile.name;

    const footerCopyright = qs(".footer-copyright p");
    if (footerCopyright) footerCopyright.textContent = `© 2026 ${profile.name}. All rights reserved.`;

    initTerminal(data.terminal.commands);
  }

  function renderProducts(products) {
    products.forEach(product => {
      const card = document.getElementById(product.id);
      if (!card) return;
      setText(".product-badge", product.badge, card);
      setText(".product-title", product.title, card);
      setText(".product-text", product.description, card);
      const list = qs(".product-features", card);
      if (list) list.innerHTML = product.features.map(feature => `<li><span class="check-icon">✓</span> ${escapeHtml(feature)}</li>`).join("");
    });

    const grid = qs(".products-grid");
    if (grid) products.forEach(product => {
      const card = document.getElementById(product.id);
      if (card) grid.appendChild(card);
    });
  }

  function renderPatents(patents) {
    patents.forEach(patent => {
      const item = document.getElementById(patent.id);
      if (!item) return;
      setText(".patent-number", patent.number, item);
      setText(".patent-name", patent.name, item);
      setText(".patent-desc", patent.description, item);
      const heading = qs(".patent-name", item);
      if (heading && patent.url) {
        heading.innerHTML = '<a href="' + escapeHtml(patent.url) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(patent.name) + '</a>';
      }
    });
  }

  function renderProjects(projects) {
    const grid = qs("#projects-grid");
    if (!grid || !projects.length) return;
    grid.innerHTML = projects.map(project =>
      '<article class="project-card glass-panel" id="' + escapeHtml(project.id) + '">' +
      '<span class="project-period">' + escapeHtml(project.period) + '</span>' +
      '<h3>' + escapeHtml(project.title) + '</h3>' +
      '<p><strong>' + escapeHtml(project.company) + '</strong> · ' + escapeHtml(project.description) + '</p>' +
      '<div class="project-tags">' + project.tags.map(tag => '<span>' + escapeHtml(tag) + '</span>').join("") + '</div></article>'
    ).join("");
  }

  function renderCertifications(certifications) {
    const grid = qs("#certifications-grid");
    if (!grid || !certifications.length) return;
    grid.innerHTML = certifications.map(cert =>
      '<article class="certification-card glass-panel"><span class="certification-issuer">' + escapeHtml(cert.issuer) + (cert.year ? ' · ' + escapeHtml(cert.year) : '') + '</span><h3>' + escapeHtml(cert.name) + '</h3>' + (cert.url ? '<a class="certification-link" href="' + escapeHtml(cert.url) + '" target="_blank" rel="noopener noreferrer">View credential ↗</a>' : '') + '</article>'
    ).join("");
  }

  function renderSkills(categories) {
    categories.forEach(category => {
      const item = document.getElementById(category.id);
      if (!item) return;
      setText(".category-title", category.category, item);
      const list = qs(".skill-list", item);
      if (!list) return;
      list.innerHTML = category.items.map(([name, evidence]) => `
        <div class="skill-item">
          <div class="skill-info"><span class="skill-name">${escapeHtml(name)}</span><span class="skill-val">${escapeHtml(evidence)}</span></div>
        </div>`).join("");
    });
    // Skill descriptions are evidence-led; no subjective percentage bars.
  }

  function renderCareerTimeline(entries) {
    // Keep the timeline data-driven and prevent stale/duplicated rendering.
    const seen = new Set();
    entries.forEach(([id, date, title, company, details]) => {
      if (seen.has(id)) return;
      seen.add(id);
      const item = document.getElementById(id);
      if (!item) return;
      setText(".timeline-date", date, item);
      setText(".timeline-job-title", title, item);
      setText(".timeline-company", company, item);
      setText(".timeline-details", details, item);
    });
  }

  function animateSkillBars() {
    qsa(".skill-bar").forEach(bar => {
      requestAnimationFrame(() => {
        bar.style.width = bar.dataset.width || "0%";
      });
    });
  }

  function initTerminal(commands = {}) {
    const input = document.getElementById("terminal-input");
    const output = document.getElementById("terminal-output");
    if (!input || !output) return;

    input.addEventListener("keydown", event => {
      if (event.key !== "Enter") return;
      const command = input.value.trim().toLowerCase();
      const line = document.createElement("div");
      line.className = "output-line";
      line.innerHTML = '<span class="terminal-user">guest@portfolio:~$</span> ' + escapeHtml(command);
      output.appendChild(line);

      if (command === "clear") {
        output.innerHTML = "";
      } else {
        const reply = document.createElement("div");
        reply.className = "output-line reply";
        reply.textContent = commands[command] || "Command not found. Type help.";
        output.appendChild(reply);
      }

      input.value = "";
      output.parentElement.scrollTop = output.parentElement.scrollHeight;
    });
  }

  // Mobile navigation
  const menu = document.getElementById("menu-toggle");
  const nav = document.getElementById("nav-menu");
  if (menu && nav) menu.addEventListener("click", () => nav.classList.toggle("open"));
  qsa(".nav-link").forEach(link => link.addEventListener("click", () => nav && nav.classList.remove("open")));

  // Interactive mesh background
  const canvas = document.getElementById("mesh-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    const resize = () => {
      canvas.width = innerWidth;
      canvas.height = innerHeight;
    };
    resize();
    addEventListener("resize", resize);

    const points = Array.from({ length: 45 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25
    }));

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const point of points) {
        point.x += point.vx;
        point.y += point.vy;
        if (point.x < 0 || point.x > canvas.width) point.vx *= -1;
        if (point.y < 0 || point.y > canvas.height) point.vy *= -1;
        ctx.fillStyle = "rgba(0,229,255,.5)";
        ctx.fillRect(point.x, point.y, 2, 2);
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  // IaC simulator
  const scanButton = document.getElementById("btn-run-scan");
  const scanTerminal = document.getElementById("sim-terminal");
  const scanPlaceholder = document.getElementById("sim-terminal-placeholder");
  if (scanButton && scanTerminal && scanPlaceholder) {
    scanButton.addEventListener("click", () => {
      scanPlaceholder.classList.remove("placeholder");
      scanPlaceholder.textContent = "Scanning Terraform configuration...";
      setTimeout(() => {
        scanPlaceholder.textContent = "CRITICAL: Ingress rule allows SSH from 0.0.0.0/0. Restrict cidr_blocks to trusted networks.";
      }, 500);
    });
  }

  // Submit through FormSubmit; show success only after its API confirms acceptance.
  const form = document.getElementById("contact-form");
  const submitButton = document.getElementById("btn-submit");
  const formStatus = document.getElementById("form-status");
  if (form && submitButton && formStatus) {
    form.addEventListener("submit", async event => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const name = document.getElementById("frm-name")?.value.trim() || "";
      const email = document.getElementById("frm-email")?.value.trim() || "";
      const subject = document.getElementById("frm-subject")?.value.trim() || "Portfolio enquiry";
      const message = document.getElementById("frm-message")?.value.trim() || "";
      const buttonText = submitButton.querySelector(".btn-text");
      submitButton.disabled = true;
      if (buttonText) buttonText.textContent = "Sending…";
      formStatus.textContent = "Submitting your message…";
      formStatus.classList.remove("form-status-success", "form-status-error");

      try {
        const response = await fetch("https://formsubmit.co/ajax/jeevanragula@gmail.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            name,
            email,
            _subject: subject,
            message,
            _template: "table"
          })
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || result.success !== "true" && result.success !== true) {
          throw new Error(result.message || "The email service did not accept the message.");
        }

        formStatus.textContent = "Your message was accepted by the form service. If this is your first submission, check Jeevan’s inbox for an activation email before delivery can begin.";
        formStatus.classList.add("form-status-success");
        form.reset();
      } catch (error) {
        console.error("Contact form submission failed:", error);
        formStatus.textContent = "Your message could not be submitted. Please email jeevanragula@gmail.com directly.";
        formStatus.classList.add("form-status-error");
      } finally {
        submitButton.disabled = false;
        if (buttonText) buttonText.textContent = "Send Message";
      }
    });
  }


  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[char]));
  }
});
