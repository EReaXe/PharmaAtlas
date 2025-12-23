/**
 * PharmaAtlas Core Application Logic
 * Handles data fetching, caching, and common helpers.
 */

const APP = {
    data: {
        drugs: [],
        companies: [],
        ingredients: []
    },
    cache: {}, // Simple cache for by-id lookups

    // Initialize the application
    init: async function () {
        ThemeManager.init();
        FavoritesManager.init();

        try {
            await this.loadAllData();
            this.dispatchReadyEvent();
        } catch (error) {
            document.body.innerHTML = '<div class="error">Veri yüklenemedi. Lütfen yerel sunucu kullandığınızdan emin olun.</div>';
        }
    },

    // Load all JSON data
    loadAllData: async function () {
        const [drugs, companies, ingredients] = await Promise.all([
            this.fetchJSON('data/drugs.json'),
            this.fetchJSON('data/companies.json'),
            this.fetchJSON('data/ingredients.json')
        ]);

        this.data.drugs = drugs;
        this.data.companies = companies;
        this.data.ingredients = ingredients;
    },

    // Fetch helper with caching
    fetchJSON: async function (url) {
        if (this.cache[url]) return this.cache[url];
        // Add timestamp to prevent browser caching during data editing
        const response = await fetch(`${url}?t=${Date.now()}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        this.cache[url] = data;
        return data;
    },

    // Event dispatcher for when data is ready
    dispatchReadyEvent: function () {
        const event = new CustomEvent('pharmaDataReady');
        document.dispatchEvent(event);
    },

    // --- Helpers ---

    getQueryParam: function (param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    },

    findById: function (list, id) {
        return list.find(item => item.id === id);
    },

    filterByCompany: function (companyId) {
        return this.data.drugs.filter(drug => drug.company_id === companyId);
    },

    filterByIngredient: function (ingredientId) {
        return this.data.drugs.filter(drug => drug.ingredient_ids.includes(ingredientId));
    },

    // --- Search Logic ---

    search: function (query) {
        query = query.toLowerCase().trim();
        if (!query) return { drugs: [], companies: [], ingredients: [] };

        return {
            drugs: this.data.drugs.filter(d => d.name.toLowerCase().includes(query)),
            companies: this.data.companies.filter(c => c.name.toLowerCase().includes(query)),
            ingredients: this.data.ingredients.filter(i => i.name.toLowerCase().includes(query))
        };
    },

    // --- UI Helpers ---

    renderCards: function (containerId, items, type) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';
        if (!items || items.length === 0) {
            container.innerHTML = '<p class="text-muted">Kayıt bulunamadı.</p>';
            return;
        }

        const grid = document.createElement('div');
        grid.className = 'grid';

        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';

            let link = '#';
            let meta = '';
            let isFavorite = false;

            if (type === 'drug') {
                link = `drug.html?id=${item.id}`;
                meta = item.form || 'İlaç';
                isFavorite = FavoritesManager.isFavorite(item.id);
            } else if (type === 'company') {
                link = `company.html?id=${item.id}`;
                meta = 'Firma';
            } else if (type === 'ingredient') {
                link = `ingredient.html?id=${item.id}`;
                meta = 'Etken Madde';
            }

            const description = item.wiki || 'Açıklama bulunmuyor.';
            const star = isFavorite ? '⭐' : '';

            card.innerHTML = `
        <h3><a href="${link}">${item.name} ${star}</a></h3>
        <div class="card-meta">${meta}</div>
        <p>${description.substring(0, 100) + (description.length > 100 ? '...' : '')}</p>
      `;
            grid.appendChild(card);
        });

        container.appendChild(grid);
    }
};

/**
 * Theme Manager
 * Handles Dark/Light mode toggle and persistence
 */
const ThemeManager = {
    init: function () {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateIcon(savedTheme);

        const toggleBtn = document.getElementById('themeToggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggle());
        }
    },

    toggle: function () {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        this.updateIcon(next);
    },

    updateIcon: function (theme) {
        const toggleBtn = document.getElementById('themeToggle');
        if (toggleBtn) {
            toggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }
};

/**
 * Favorites Manager
 * Handles local storage for favorite drugs
 */
const FavoritesManager = {
    favorites: [],

    init: function () {
        const stored = localStorage.getItem('pharmaFavorites');
        if (stored) {
            this.favorites = JSON.parse(stored);
        }
    },

    isFavorite: function (id) {
        return this.favorites.includes(id);
    },

    toggle: function (id) {
        if (this.isFavorite(id)) {
            this.favorites = this.favorites.filter(favId => favId !== id);
        } else {
            this.favorites.push(id);
        }
        this.save();
        return this.isFavorite(id);
    },

    save: function () {
        localStorage.setItem('pharmaFavorites', JSON.stringify(this.favorites));
        // Trigger event to update UI if needed
        document.dispatchEvent(new CustomEvent('favoritesUpdated'));
    },

    getFavorites: function () {
        return this.favorites;
    }
};

// Auto-init
window.addEventListener('DOMContentLoaded', () => {
    APP.init();
});
