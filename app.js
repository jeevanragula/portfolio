document.addEventListener("DOMContentLoaded", async () => {
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];
  const setText = (selector, value, root = document) => {
    const el = qs(selector, root);
    if (el) el.textContent = value;
  };

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
    setText(".nav-logo", `<placeholder>`);
    const logo = qs(".nav-logo");
    if (logo) logo.innerHTML = '<span class="logo-accent">&lt;</span>' + escapeHtml(profile.name) + '<span class="logo-accent">/&gt;</span>';

    setText(".status-text", `${profile.title} @ ${profile.company}`);
    setText(".hero-title", "");
    const heroTitle = qs(".hero-title");
    if (heroTitle) heroTitle.innerHTML = `Architecting the Future of <span class="gradient-text glow-cyan">Cloud Security</span>`;
    const heroDescription = qs(".hero-description");
    if (heroDescription) heroDescription.innerHTML = escapeHtml(profile.description)
      .replace(/Zscaler Posture Control \(ZPC\)/g, "<strong>Zscaler Posture Control (ZPC)</strong>")
      .replace(/DSPM/g, "<strong>DSPM</strong>")
      .replace(/AI Security/g, "<strong>AI Security</strong>");

    renderProducts(data.products);
    renderPatents(data.patents);
    renderSkills(data.skills);
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
    if (footerLogo) footerLogo.innerHTML = '<span class="logo-accent">&lt;</span>' + escapeHtml(profile.name) + '<span class="logo-accent">/&gt;</span>';

    const footerCopyright = qs(".footer-copyright p");
    if (footerCopyright) footerCopyright.textContent = `© 2026 ${profile.name}. All rights reserved. Architected with raw HTML, CSS, and JS.`;

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
    });
  }

  function renderSkills(categories) {
    categories.forEach(category => {
      const item = document.getElementById(category.id);
      if (!item) return;
      setText(".category-title", category.category, item);
      const list = qs(".skill-list", item);
      if (!list) return;
      list.innerHTML = category.items.map(([name, level, width, barClass]) => `
        <div class="skill-item">
          <div class="skill-info"><span class="skill-name">${escapeHtml(name)}</span><span class="skill-val">${escapeHtml(level)}</span></div>
          <div class="skill-bar-bg"><div class="skill-bar ${barClass}" style="width:0%" data-width="${width}%"></div></div>
        </div>`).join("");
    });
    animateSkillBars();
  }

  function renderCareerTimeline(entries) {
    entries.forEach(([id, date, title, company, details]) => {
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

  // Contact form stays client-side by design; it provides visual feedback only.
  const form = document.getElementById("contact-form");
  const success = document.getElementById("form-success");
  if (form && success) {
    form.addEventListener("submit", event => {
      event.preventDefault();
      form.style.display = "none";
      success.classList.add("show");
    });
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[char]));
  }
});
