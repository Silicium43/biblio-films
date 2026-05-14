// moviesData is loaded from data.js via script tag

const movieGrid = document.getElementById('movie-grid');
const searchInput = document.getElementById('search-input');
const filterBtns = document.querySelectorAll('.filter-btn');
const countryFilter = document.getElementById('country-filter');
const addModal = document.getElementById('add-modal');
const settingsModal = document.getElementById('settings-modal');
const addMovieBtn = document.getElementById('add-movie-btn');
const settingsBtn = document.getElementById('settings-btn');
const cancelBtn = document.getElementById('cancel-btn');
const addMovieForm = document.getElementById('add-movie-form');
const settingsForm = document.getElementById('settings-form');

const countryToEmoji = {
    "France": "🇫🇷", "États-Unis": "🇺🇸", "Japon": "🇯🇵", "Royaume-Uni": "🇬🇧",
    "Italie": "🇮🇹", "Belgique": "🇧🇪", "Corée du Sud": "🇰🇷", "Espagne": "🇪🇸",
    "Allemagne": "🇩🇪", "Canada": "🇨🇦", "Australie": "🇦🇺", "Hong Kong": "🇭🇰",
    "Chine": "🇨🇳", "Turquie": "🇹🇷", "Suède": "🇸🇪", "Danemark": "🇩🇰",
    "Pologne": "🇵🇱", "Irlande": "🇮🇪", "Russie": "🇷🇺", "Afrique du Sud": "🇿🇦",
    "Nouvelle-Zélande": "🇳🇿", "Suisse": "🇨🇭", "Mexique": "🇲🇽", "Brésil": "🇧🇷", "Inde": "🇮🇳"
};

function parseDate(dateStr) {
    if (!dateStr || typeof dateStr !== 'string') return new Date(0);
    const parts = dateStr.split('/');
    if (parts.length === 3) return new Date(parts[2], parts[1] - 1, parts[0]);
    const isoParts = dateStr.split('-');
    if (isoParts.length === 3) return new Date(isoParts[0], isoParts[1] - 1, isoParts[2]);
    return new Date(0);
}

let movies = [...(window.moviesData || [])];
let currentFilter = 'all';
let currentCountry = 'all';
let searchQuery = '';

const customMovies = JSON.parse(localStorage.getItem('customMovies') || '[]');
const githubSettings = JSON.parse(localStorage.getItem('githubSettings') || '{"owner":"","repo":"","path":"données.csv","token":""}');

function saveToLocalStorage() {
    localStorage.setItem('customMovies', JSON.stringify(customMovies));
    localStorage.setItem('githubSettings', JSON.stringify(githubSettings));
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// GitHub Sync Logic
async function syncToGithub(newMovie) {
    if (!githubSettings.token || !githubSettings.owner || !githubSettings.repo) {
        showToast("Paramètres GitHub manquants. Sauvegarde locale uniquement.", "error");
        return;
    }

    const { owner, repo, path, token } = githubSettings;
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

    try {
        // 1. Get the current file content and SHA
        const response = await fetch(url, {
            headers: { 'Authorization': `token ${token}` }
        });

        if (!response.ok) throw new Error("Impossible de lire le fichier sur GitHub");
        const fileData = await response.json();
        const currentContent = atob(fileData.content); // Base64 to text
        const sha = fileData.sha;

        // 2. Prepare new content (append movie line)
        // Format: date_notation;titre;titre_original;auteurs;sortie;note;pays
        const newLine = `\n${newMovie.date_notation};${newMovie.titre};${newMovie.titre_original || ''};${newMovie.auteurs || ''};${newMovie.sortie};${newMovie.note};${newMovie.pays}`;
        const updatedContent = currentContent.trim() + newLine;

        // 3. Commit back to GitHub
        const updateResponse = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: `Ajout du film : ${newMovie.titre}`,
                content: btoa(unescape(encodeURIComponent(updatedContent))), // Text to Base64 (UTF-8 safe)
                sha: sha
            })
        });

        if (updateResponse.ok) {
            showToast("Synchronisé avec GitHub ! ✅");
        } else {
            throw new Error("Échec de la mise à jour GitHub");
        }
    } catch (error) {
        console.error(error);
        showToast("Erreur de synchro GitHub. Sauvegarde locale effectuée.", "error");
    }
}

function populateCountries() {
    const allMovies = [...customMovies, ...(window.moviesData || [])];
    const countryCounts = {};
    allMovies.forEach(m => {
        if (m.pays) countryCounts[m.pays] = (countryCounts[m.pays] || 0) + 1;
    });
    const countries = Object.keys(countryCounts).sort();
    countryFilter.innerHTML = `<option value="all">🌐 Tous les pays (${allMovies.length})</option>`;
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        const emoji = countryToEmoji[country] || '🏳️';
        option.textContent = `${emoji} ${country} (${countryCounts[country]})`;
        countryFilter.appendChild(option);
    });
}

function renderMovies() {
    movieGrid.innerHTML = '';
    let allMovies = [...customMovies, ...(window.moviesData || [])];

    const filteredMovies = allMovies.filter(movie => {
        const matchesSearch = 
            movie.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (movie.auteurs && movie.auteurs.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (movie.pays && movie.pays.toLowerCase().includes(searchQuery.toLowerCase()));
        let matchesFilter = true;
        if (currentFilter === 'top-rated') matchesFilter = parseInt(movie.note) >= 8;
        let matchesCountry = true;
        if (currentCountry !== 'all') matchesCountry = movie.pays === currentCountry;
        return matchesSearch && matchesFilter && matchesCountry;
    });

    // Sort: top-rated uses note DESC then date_notation DESC; default uses date_notation DESC then sortie DESC
    if (currentFilter === 'top-rated') {
        filteredMovies.sort((a, b) => {
            const noteA = parseInt(a.note) || 0;
            const noteB = parseInt(b.note) || 0;
            if (noteA !== noteB) return noteB - noteA;
            return parseDate(b.date_notation).getTime() - parseDate(a.date_notation).getTime();
        });
    } else {
        filteredMovies.sort((a, b) => {
            const timeA = parseDate(a.date_notation).getTime();
            const timeB = parseDate(b.date_notation).getTime();
            if (timeA !== timeB) return timeB - timeA;
            return parseDate(b.sortie) - parseDate(a.sortie);
        });
    }

    if (filteredMovies.length === 0) {
        movieGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary);">AUCUN RÉSULTAT.</div>';
        return;
    }

    filteredMovies.forEach((movie, index) => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.style.animationDelay = `${(index % 20) * 0.05}s`;
        const emoji = countryToEmoji[movie.pays] || '🏳️';
        card.innerHTML = `
            <div class="card-inner">
                <h3>${movie.titre}</h3>
                ${movie.titre_original ? `<div class="info"><i>${movie.titre_original}</i></div>` : ''}
                <div class="info"><span>🎬</span> ${movie.auteurs || 'Inconnu'}</div>
                <div class="info"><span>${emoji}</span> ${movie.pays || 'Inconnu'}</div>
                <div class="info release-date">📅 Sortie : ${movie.sortie || 'Inconnue'}</div>
                <div class="info view-date">👁️ Vu le : ${movie.date_notation || 'Inconnu'}</div>
                <div class="note">NOTE: ${movie.note || '?'}/10</div>
            </div>
        `;
        movieGrid.appendChild(card);
    });
}

// Modals
addMovieBtn.onclick = () => addModal.classList.add('active');
settingsBtn.onclick = () => {
    document.getElementById('gh-owner').value = githubSettings.owner;
    document.getElementById('gh-repo').value = githubSettings.repo;
    document.getElementById('gh-path').value = githubSettings.path;
    document.getElementById('gh-token').value = githubSettings.token;
    settingsModal.classList.add('active');
};

document.querySelectorAll('.cancel-btn').forEach(btn => {
    btn.onclick = () => {
        addModal.classList.remove('active');
        settingsModal.classList.remove('active');
    };
});

addMovieForm.onsubmit = async (e) => {
    e.preventDefault();
    const format = (dateStr) => {
        if (!dateStr) return '';
        const [y, m, d] = dateStr.split('-');
        return `${d}/${m}/${y}`;
    };

    const newMovie = {
        titre: document.getElementById('new-titre').value,
        titre_original: "", // Can be added to form if needed
        auteurs: document.getElementById('new-auteurs').value,
        note: document.getElementById('new-note').value,
        pays: document.getElementById('new-pays').value,
        sortie: format(document.getElementById('new-sortie').value) || new Date().toLocaleDateString('fr-FR'),
        date_notation: format(document.getElementById('new-visionnage').value) || new Date().toLocaleDateString('fr-FR')
    };
    
    customMovies.unshift(newMovie);
    saveToLocalStorage();
    renderMovies();
    addModal.classList.remove('active');
    addMovieForm.reset();
    showToast('Ajout local réussi. Synchro GitHub en cours...');
    await syncToGithub(newMovie);
};

settingsForm.onsubmit = (e) => {
    e.preventDefault();
    githubSettings.owner = document.getElementById('gh-owner').value;
    githubSettings.repo = document.getElementById('gh-repo').value;
    githubSettings.path = document.getElementById('gh-path').value;
    githubSettings.token = document.getElementById('gh-token').value;
    saveToLocalStorage();
    settingsModal.classList.remove('active');
    showToast('Paramètres enregistrés !');
};

// Listeners
searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderMovies();
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderMovies();
    });
});

countryFilter.addEventListener('change', (e) => {
    currentCountry = e.target.value;
    renderMovies();
});

populateCountries();
renderMovies();
