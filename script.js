const username = "tinpro2k5";

const avatarEl = document.getElementById("avatar");
const nameEl = document.getElementById("name");
const bioEl = document.getElementById("bio");
const githubLinkEl = document.getElementById("github-link");
const repoCountEl = document.getElementById("repo-count");
const followersEl = document.getElementById("followers");
const followingEl = document.getElementById("following");
const repoListEl = document.getElementById("repo-list");

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

async function loadPortfolio() {
  try {
    const [profileRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${encodeURIComponent(username)}`),
      fetch(
        `https://api.github.com/users/${encodeURIComponent(
          username
        )}/repos?sort=updated&per_page=6`
      ),
    ]);

    if (!profileRes.ok || !reposRes.ok) {
      throw new Error("Không thể tải dữ liệu từ GitHub API.");
    }

    const profile = await profileRes.json();
    const repos = await reposRes.json();

    avatarEl.src = profile.avatar_url || "";
    avatarEl.alt = `Avatar của ${profile.login || username}`;
    nameEl.textContent = profile.name || profile.login || username;
    bioEl.textContent = profile.bio || "Chưa có bio.";
    githubLinkEl.href = profile.html_url || `https://github.com/${username}`;
    githubLinkEl.textContent = `@${profile.login || username}`;
    repoCountEl.textContent = String(profile.public_repos ?? 0);
    followersEl.textContent = String(profile.followers ?? 0);
    followingEl.textContent = String(profile.following ?? 0);

    const repoItems = repos
      .filter((repo) => !repo.fork)
      .slice(0, 6)
      .map((repo) => {
        const repoName = escapeHtml(repo.name || "unknown");
        const repoUrl = escapeHtml(repo.html_url || "#");
        const repoDesc = escapeHtml(repo.description || "No description");
        return `<li><a href="${repoUrl}" target="_blank" rel="noopener noreferrer">${repoName}</a> — ${repoDesc}</li>`;
      });

    repoListEl.innerHTML =
      repoItems.join("") || "<li>Chưa có repository phù hợp để hiển thị.</li>";
  } catch (error) {
    bioEl.textContent = "Lỗi tải dữ liệu GitHub.";
    repoListEl.innerHTML =
      "<li>Không thể tải repositories. Vui lòng thử lại sau.</li>";
    console.error(error);
  }
}

loadPortfolio();
