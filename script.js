const username = "tinpro2k5";

const avatarEl = document.getElementById("avatar");
const bioEl = document.getElementById("bio");
const aboutGithubEl = document.getElementById("about-github");
const githubLinkEl = document.getElementById("github-link");
const repoCountEl = document.getElementById("repo-count");
const followersEl = document.getElementById("followers");
const followingEl = document.getElementById("following");
const projectListEl = document.getElementById("project-list");
const techListEl = document.getElementById("tech-list");

const formatDate = (isoDate) => {
  if (!isoDate) return "N/A";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("vi-VN");
};

const clearElement = (element) => {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

const createTextListItem = (text) => {
  const li = document.createElement("li");
  li.textContent = text;
  return li;
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

const renderTechStack = (repos) => {
  const techPairs = toSortedTechPairs(repos);
  clearElement(techListEl);
  if (!techPairs.length) {
    techListEl.appendChild(createTextListItem("Chưa có dữ liệu technology từ repositories."));
    return;
  }
  for (const [name, count] of techPairs) {
    techListEl.appendChild(createTextListItem(`${name} (${count} repos)`));
  }
};

const getProjectBadges = (repo) => {
  const badges = [];
  if (repo.language) badges.push(repo.language);
  if (Array.isArray(repo.topics)) {
    for (const topic of repo.topics.slice(0, 3)) {
      const normalized = String(topic).trim();
      if (normalized) badges.push(normalized);
    }
  }
  const uniqueBadges = [...new Set(badges)].slice(0, 4);
  return uniqueBadges.length ? uniqueBadges : ["General"];
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

    const updatedAt = document.createElement("span");
    updatedAt.className = "project-meta";
    updatedAt.textContent = `Updated ${formatDate(repo.updated_at)}`;

    title.appendChild(link);
    title.appendChild(updatedAt);

    const desc = document.createElement("p");
    desc.className = "project-desc";
    desc.textContent = repo.description || "No description provided.";

    const badges = document.createElement("div");
    badges.className = "project-badges";
    for (const badge of getProjectBadges(repo)) {
      const badgeEl = document.createElement("span");
      badgeEl.className = "tech-badge";
      badgeEl.textContent = badge;
      badges.appendChild(badgeEl);
    }

    const meta = document.createElement("p");
    meta.className = "project-meta";
    meta.textContent = `⭐ ${repo.stargazers_count || 0} · Forks ${repo.forks_count || 0}`;

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
      fetch(`https://api.github.com/users/${encodeURIComponent(username)}`),
      fetch(
        `https://api.github.com/users/${encodeURIComponent(
          username
        )}/repos?sort=updated&per_page=20`
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
  }
}

loadPortfolio();
