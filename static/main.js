const btn = document.getElementById('random-btn');
const repoDiv = document.getElementById('repo');
const languageSelect = document.getElementById('language-select');
const historyDiv = document.getElementById('history');

let history = [];
let currentLanguage = '';

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
}

function updateHistory(repo) {
    // Ajoute le repo à l'historique (en début de liste, sans doublons)
    history = history.filter(r => r.url !== repo.url);
    history.unshift(repo);
    if (history.length > 5) history = history.slice(0, 5);
    let html = '<div class="repo-history-title">Historique des dépôts vus</div><ul class="repo-history-list">';
    for (const r of history) {
        html += `<li class="repo-history-item"><a href="${r.url}" target="_blank">${r.name}</a> (${r.language || 'N/A'})</li>`;
    }
    html += '</ul>';
    historyDiv.innerHTML = html;
}

async function fetchRandomRepo(language = '') {
    repoDiv.innerHTML = "<p>Chargement...</p>";
    let url = '/api/repo-random';
    if (language && language !== 'Tous' && language !== 'Autre') {
        url += `?language=${encodeURIComponent(language)}`;
    }
    const res = await fetch(url);
    const data = await res.json();
    if (data.error) {
        repoDiv.innerHTML = `<p>Erreur : ${data.error}</p>`;
        return;
    }
    repoDiv.innerHTML = `
        <div class="repo-header">
            <span class="repo-owner">${data.name.split('/')[0]}</span> / 
            <span class="repo-name">${data.name.split('/')[1]}</span>
            <span class="repo-lang">${data.language || ''}</span>
            <span class="repo-stars">⭐ ${data.stars}</span>
        </div>
        <div class="repo-desc">${data.description || "Pas de description."}</div>
        <div class="repo-updated">Dernière mise à jour : ${formatDate(data.updated_at)}</div>
        <div class="repo-tags">
            ${data.topics.map(tag => `<span class="repo-tag">${tag}</span>`).join('')}
        </div>
        <div class="repo-actions">
            <a href="${data.url}" class="readme-btn" target="_blank">Voir sur GitHub</a>
        </div>
    `;
    updateHistory(data);
}

btn.addEventListener('click', () => {
    fetchRandomRepo(currentLanguage);
});

languageSelect.addEventListener('change', (e) => {
    currentLanguage = e.target.value;
    fetchRandomRepo(currentLanguage);
});
