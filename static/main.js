const btn = document.getElementById('random-btn');
const repoDiv = document.getElementById('repo');

btn.addEventListener('click', async () => {
    repoDiv.innerHTML = "<p>Chargement...</p>";
    try {
        const res = await fetch('/api/repo-random');
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
            <div class="repo-tags">
                ${data.topics.map(tag => `<span class="repo-tag">${tag}</span>`).join('')}
            </div>
            <div class="repo-actions">
                <a href="${data.url}" class="readme-btn" target="_blank">Voir sur GitHub</a>
            </div>
        `;
    } catch (e) {
        repoDiv.innerHTML = "<p>Erreur lors de la récupération du dépôt.</p>";
    }
});
