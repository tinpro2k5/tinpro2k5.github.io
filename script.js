const themeToggleEl = document.getElementById("theme-toggle");
const yearEl = document.getElementById("year");

const setTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  if (themeToggleEl) {
    themeToggleEl.innerHTML = theme === "dark" ? '<span aria-hidden="true">☀️</span> Theme' : '<span aria-hidden="true">🌙</span> Theme';
  }
};

const createTextListItem = (text) => {
  const li = document.createElement("li");
  li.textContent = text;
  return li;
};

const toProjectBadges = (repo) => {
  const badges = [];
  if (repo.language) {
    badges.push(repo.language);
  }

  if (Array.isArray(repo.topics)) {
    for (const topic of repo.topics.slice(0, 3)) {
      const normalized = String(topic).trim();
      if (normalized) {
        badges.push(normalized);
      }
    }
  }

  return [...new Set(badges)];
};

const toSortedTechPairs = (repos) => {
  const techCounter = new Map();
  for (const repo of repos) {
    if (repo.language) {
      techCounter.set(repo.language, (techCounter.get(repo.language) || 0) + 1);
    }
    if (Array.isArray(repo.topics)) {
      for (const topic of repo.topics) {
        const normalized = String(topic).trim();
        if (normalized) {
          techCounter.set(normalized, (techCounter.get(normalized) || 0) + 1);
        }
      }
    }
  }
  return [...techCounter.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
};

const bindThemeToggle = () => {
  if (!themeToggleEl) return;
  themeToggleEl.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("portfolio-theme", next);
  });
};

const renderProjects = (repos) => {
  clearElement(projectListEl);
  const nonForkRepos = repos.filter((repo) => !repo.fork).slice(0, 8);
  if (!nonForkRepos.length) {
    projectListEl.appendChild(createTextListItem("Chưa có project phù hợp để hiển thị."));
    return;
  }

  for (const repo of nonForkRepos) {
    const li = document.createElement("li");
    li.className = "project-card";

    const title = document.createElement("div");
    title.className = "project-title";

    const link = document.createElement("a");
    link.className = "project-name";
    link.href = repo.html_url || "#";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = repo.name || "unknown-project";

    title.appendChild(link);

    const desc = document.createElement("p");
    desc.className = "project-desc";
    desc.textContent = repo.description || "No description provided.";

    const badges = document.createElement("div");
    badges.className = "project-tech-list";
    for (const label of toProjectBadges(repo)) {
      const badge = document.createElement("span");
      badge.className = "tech-badge";
      badge.textContent = label;
      badges.appendChild(badge);
    }

    const meta = document.createElement("p");
    meta.className = "project-meta";
    meta.textContent = `⭐ ${repo.stargazers_count || 0} · Forks ${repo.forks_count || 0} · Updated ${formatDate(repo.updated_at)}`;

    li.appendChild(title);
    li.appendChild(desc);
    li.appendChild(badges);
    li.appendChild(meta);
    projectListEl.appendChild(li);
  }
};

async function loadPortfolio() {
  try {
    const [profileRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
        headers: { Accept: "application/vnd.github+json" },
      }),
      fetch(
        `https://api.github.com/users/${encodeURIComponent(
          username
        )}/repos?sort=updated&per_page=12`,
        {
          headers: { Accept: "application/vnd.github+json" },
        }
      ),
    ]);

    if (!profileRes.ok || !reposRes.ok) {
      throw new Error("Không thể tải dữ liệu từ GitHub API.");
    }

    const profile = await profileRes.json();
    const repos = await reposRes.json();

    avatarEl.src = profile.avatar_url || "";
    avatarEl.alt = `Avatar của ${profile.login || username}`;
    bioEl.textContent = profile.bio || "Chưa có bio.";
    aboutGithubEl.textContent = `GitHub headline: ${profile.bio || "Hiện chưa có mô tả trên profile."}`;
    githubLinkEl.href = profile.html_url || `https://github.com/${username}`;
    githubLinkEl.textContent = `@${profile.login || username}`;
    repoCountEl.textContent = String(profile.public_repos ?? 0);
    followersEl.textContent = String(profile.followers ?? 0);
    followingEl.textContent = String(profile.following ?? 0);

    renderTechStack(repos);
    renderProjects(repos);
  } catch (error) {
    bioEl.textContent = "Lỗi tải dữ liệu GitHub.";
    aboutGithubEl.textContent = "Không thể tải mô tả từ GitHub lúc này.";
    clearElement(techListEl);
    techListEl.appendChild(createTextListItem("Không thể tải technology."));
    clearElement(projectListEl);
    projectListEl.appendChild(createTextListItem("Không thể tải projects. Vui lòng thử lại sau."));
    console.error(error);
  }
}

loadPortfolio();
