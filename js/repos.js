(function () {
  'use strict';

  const translations = window.translations || {};
  window.repoDescriptionOverrides = window.repoDescriptionOverrides || {};

  function getLang() {
    return window.currentLang || 'es';
  }

  function renderRepos(repos, container) {
    const loader = container.querySelector('.loader');
    if (loader) loader.remove();

    const t = function (key, fallback) {
      try {
        return translations[getLang()] && translations[getLang()][key] || fallback;
      } catch (_) {
        return fallback;
      }
    };

    if (!repos.length) {
      container.innerHTML = '<p>' + t('repo-empty', 'No public repositories available.') + '</p>';
      return;
    }

    repos
      .filter(function (repo) { return !repo.fork; })
      .slice(0, 12)
      .forEach(function (repo) {
        const div = document.createElement('div');
        div.className = 'repo-item';

        const override = window.repoDescriptionOverrides[repo.name] && window.repoDescriptionOverrides[repo.name][getLang()];
        const description = override || (repo.description ? repo.description : t('repo-no-desc', 'No description available.'));

        div.innerHTML = '<h3><a href="' + repo.html_url + '" target="_blank" rel="noopener">' + repo.name + '</a></h3>' +
          '<p>' + description + '</p>';
        container.appendChild(div);
      });
  }

  async function fetchRepos() {
    const username = 'YerayAR';
    const container = document.getElementById('repo-list');
    if (!container) return;

    const cacheKey = 'github-repos-cache';
    const cacheTTL = 1000 * 60 * 60 * 6;
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < cacheTTL) {
          renderRepos(parsed.data, container);
          return;
        }
      }
    } catch (cacheError) {
      console.warn('No se pudo leer la cache de repositorios', cacheError);
    }

    try {
      const res = await fetch('https://api.github.com/users/' + username + '/repos?per_page=30&sort=updated', {
        headers: { 'Accept': 'application/vnd.github+json' }
      });

      if (res.status === 403) {
        container.textContent = translations[getLang()] && translations[getLang()]['repo-rate-limit'] || 'GitHub API rate limit reached. Please try again later.';
        return;
      }

      if (!res.ok) throw new Error('request failed (' + res.status + ')');

      const repos = await res.json();
      renderRepos(repos, container);

      try {
        localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: repos }));
      } catch (cacheWriteError) {
        console.warn('No se pudo guardar la cache de repositorios', cacheWriteError);
      }
    } catch (e) {
      console.error('Error al cargar los repositorios:', e);
      container.textContent = translations[getLang()] && translations[getLang()]['repo-load-failed'] || 'Could not load repositories.';
    }
  }

  window.fetchRepos = fetchRepos;
})();
