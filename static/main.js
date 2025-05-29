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
            <h2><a href="${data.url}" target="_blank">${data.name}</a></h2>
            <p>${data.description || "Pas de description."}</p>
            <p>⭐ ${data.stars} stars</p>
        `;
    } catch (e) {
        repoDiv.innerHTML = "<p>Erreur lors de la récupération du dépôt.</p>";
    }
});
