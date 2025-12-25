/**
 * Storage Manager
 * Handles LocalStorage operations for Theme and Favorites
 */

export const ThemeManager = {
    init() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        return savedTheme;
    },

    toggle() {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        return next;
    },

    getCurrent() {
        return localStorage.getItem('theme') || 'light';
    }
};

export const FavoritesManager = {
    favorites: [],

    init() {
        const stored = localStorage.getItem('pharmaFavorites');
        if (stored) {
            this.favorites = JSON.parse(stored);
        }
    },

    isFavorite(id) {
        return this.favorites.includes(id);
    },

    toggle(id) {
        if (this.isFavorite(id)) {
            this.favorites = this.favorites.filter(favId => favId !== id);
        } else {
            this.favorites.push(id);
        }
        this.save();
        return this.isFavorite(id);
    },

    save() {
        localStorage.setItem('pharmaFavorites', JSON.stringify(this.favorites));
        // Dispatch event for UI updates
        window.dispatchEvent(new CustomEvent('favoritesUpdated'));
    },

    getFavorites() {
        return this.favorites;
    }
};
