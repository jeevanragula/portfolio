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

    initTerminal(data.terminal.commands, data);
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
      '<div class="project-tags">' + project.tags.map(tag => '<span>' + escapeHtml(tag) + '</span>').join("") + '</div>' + (project.url ? '<a class="certification-link" href="' + escapeHtml(project.url) + '" target="_blank" rel="noopener noreferrer">View project ↗</a>' : '') + '</article>'
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

  function initTerminal(commands = {}, data = {}) {
    const input = document.getElementById("terminal-input");
    const output = document.getElementById("terminal-output");
    if (!input || !output) return;

    const history = [];
    let historyIndex = 0;
    const profile = data.profile || {};

    const addLine = (text, className = "output-line reply") => {
      const line = document.createElement("div");
      line.className = className;
      line.textContent = text;
      output.appendChild(line);
      return line;
    };

    const addLinkReply = (label, href, download = false) => {
      const line = document.createElement("div");
      line.className = "output-line reply";
      const link = document.createElement("a");
      link.href = href;
      link.textContent = label;
      if (download) link.setAttribute("download", "");
      else {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
      line.appendChild(link);
      output.appendChild(line);
    };

    const listProjects = () => {
      (data.projects || []).forEach(project => {
        addLine(project.title + " — " + project.company + " (" + project.period + ")");
        addLine("  " + project.description);
      });
      if (!(data.projects || []).length) addLine("No project details are available.");
    };

    let experiencePage = 0;
    const experiencePageSize = 2;
    const listExperience = (argument = "") => {
      const entries = data.career || [];
      const fallback = (profile.roleHistory || []).map(role => ["", role.period, role.title, role.company, ""]);
      const items = entries.length ? entries : fallback;
      if (!items.length) {
        addLine("No experience details are available.");
        return;
      }

      const totalPages = Math.ceil(items.length / experiencePageSize);
      const arg = String(argument || "").toLowerCase();
      if (arg === "next") experiencePage = Math.min(totalPages - 1, experiencePage + 1);
      else if (arg === "prev" || arg === "previous") experiencePage = Math.max(0, experiencePage - 1);
      else if (arg && /^\d+$/.test(arg)) experiencePage = Math.max(0, Math.min(totalPages - 1, Number(arg) - 1));
      else if (!arg) experiencePage = 0;

      // Replace the previous experience page so paging never floods the terminal.
      const previousPage = output.querySelector(".experience-page-output");
      if (previousPage) previousPage.remove();
      const pageOutput = document.createElement("div");
      pageOutput.className = "experience-page-output";
      output.appendChild(pageOutput);
      const pageLine = text => {
        const line = document.createElement("div");
        line.className = "output-line reply";
        line.textContent = text;
        pageOutput.appendChild(line);
      };

      const start = experiencePage * experiencePageSize;
      pageLine("Career history · Page " + (experiencePage + 1) + " of " + totalPages);
      items.slice(start, start + experiencePageSize).forEach(entry => {
        const [, period, title, company, details] = entry;
        pageLine(period + " | " + title + " — " + company);
        if (details) pageLine("  " + details);
      });
      pageLine("Navigation: experience next | experience prev | experience <page number>");
    };

    const listCertifications = () => {
      (data.certifications || []).forEach(cert => {
        addLine(cert.name + " — " + cert.issuer + (cert.year ? " (" + cert.year + ")" : ""));
      });
      if (!(data.certifications || []).length) addLine("No certification details are available.");
    };

    const listPatents = () => {
      (data.patents || []).forEach(patent => {
        addLine(patent.name + " — " + patent.number);
        if (patent.url) addLinkReply("View patent ↗", patent.url);
      });
      if (!(data.patents || []).length) addLine(commands.patents || "No patent details are available.");
    };

    const handlers = {
      help: () => {
        addLine("Available commands:");
        addLine("  whoami, bio, skills, products, projects, experience [page|next|prev], patents");
        addLine("  certifications, education, resume, github, linkedin, contact, ls, clear");
        addLine("Tip: use ↑ / ↓ to browse command history.");
      },
      whoami: () => addLine((profile.name || "Jeevan Reddy Ragula") + " — " + (profile.title || "Technical Architect") + " @ " + (profile.company || "Zscaler")),
      bio: () => addLine(profile.description || commands.bio || "Profile details are unavailable."),
      skills: () => addLine(commands.skills || "Skills information is unavailable."),
      products: () => {
        (data.products || []).forEach(product => addLine(product.title + " — " + product.description));
        if (!(data.products || []).length) addLine(commands.products || "Product details are unavailable.");
      },
      projects: listProjects,
      experience: args => listExperience(args[0] || ""),
      patents: listPatents,
      certifications: listCertifications,
      education: () => {
        const education = (data.career || []).filter(entry => /b\.tech|bachelor|education/i.test(String(entry[2]) + " " + String(entry[3]) + " " + String(entry[4] || "")));
        if (education.length) education.forEach(entry => addLine(entry[1] + " | " + entry[2] + " — " + entry[3] + ": " + (entry[4] || "")));
        else addLine("B.Tech, Electronics & Communication Engineering — JNTU Hyderabad (2003–2007).");
      },
      resume: () => addLinkReply("Download resume (PDF) ↓", "https://jeevanragula.github.io/resume.pdf", true),
      github: () => addLinkReply("GitHub profile ↗", profile.github || "https://github.com/jeevanragula"),
      linkedin: () => addLinkReply("LinkedIn profile ↗", profile.linkedin || "https://www.linkedin.com/in/jeevanragula/"),
      contact: () => {
        addLine((profile.location || (data.contact && data.contact.location) || "Hyderabad, India") + " · " + (profile.email || "Email available on the contact section"));
        if (profile.email) addLinkReply("Email " + profile.email + " ↗", "mailto:" + profile.email);
        if (profile.linkedin) addLinkReply("LinkedIn profile ↗", profile.linkedin);
      },
      ls: () => {
        addLine("bio.txt  skills.json  products/  projects/  patents/  certifications/  experience/  resume.pdf");
        addLine("(Simulated portfolio files — this terminal is read-only.)");
      },
      clear: () => { output.innerHTML = ""; }
    };

    const initialReply = output.querySelector(".output-line.reply");
    if (initialReply) {
      initialReply.textContent = (profile.name || "Jeevan Reddy Ragula") + " — " +
        (profile.title || "Technical Architect") + " based in " +
        (profile.location || "Hyderabad, India") + ". Explore the portfolio with 'help'.";
    }

    input.setAttribute("autocomplete", "off");
    input.addEventListener("keydown", event => {
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
        if (!history.length) return;
        historyIndex = event.key === "ArrowUp"
          ? Math.max(0, historyIndex - 1)
          : Math.min(history.length, historyIndex + 1);
        input.value = historyIndex === history.length ? "" : history[historyIndex];
        return;
      }
      if (event.key !== "Enter") return;

      const raw = input.value.trim();
      if (!raw) return;
      const command = raw.toLowerCase().split(/\s+/)[0];
      history.push(raw);
      historyIndex = history.length;

      const line = document.createElement("div");
      line.className = "output-line";
      const prompt = document.createElement("span");
      prompt.className = "terminal-user";
      prompt.textContent = "guest@portfolio:~$";
      line.appendChild(prompt);
      line.appendChild(document.createTextNode(" " + raw));
      output.appendChild(line);

      const args = raw.split(/\s+/).slice(1);
      if (handlers[command]) handlers[command](args);
      else if (commands[command]) addLine(commands[command]);
      else addLine('Command not found: "' + command + '". Type "help" to see available commands.');

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
