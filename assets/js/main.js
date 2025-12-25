/**
 * Main Application Entry Point
 */

import { API } from './api.js';
import { UI } from './ui.js';
import { ThemeManager, FavoritesManager } from './storage.js';
import { Components } from './components.js';

const App = {
    async init() {
        // 1. Initialize Storage & Theme
        FavoritesManager.init();
        const currentTheme = ThemeManager.init();

        // 2. Render Shared Components
        const pageId = document.body.dataset.page || 'index';
        Components.renderHeader(pageId);
        Components.renderFooter();

        // 3. Setup Theme Toggle Event (after header render)
        const toggleBtn = document.getElementById('themeToggle');
        if (toggleBtn) {
            UI.toggleThemeIcon(currentTheme);
            toggleBtn.addEventListener('click', () => {
                const newTheme = ThemeManager.toggle();
                UI.toggleThemeIcon(newTheme);
            });
        }

        // 4. Load Data
        const success = await API.init();
        if (!success) {
            UI.showError('Veri yüklenemedi. Lütfen yerel sunucu (localhost) kullandığınızdan emin olun.');
            return;
        }

        // 5. Dispatch Event for page-specific logic
        window.dispatchEvent(new CustomEvent('pharmaReady', { detail: API.getData() }));

        // 6. Setup Global Listeners
        window.addEventListener('favoritesUpdated', () => {
            // Re-render favorites if on index page
            if (pageId === 'index') {
                const favs = API.getFavorites(FavoritesManager.getFavorites());
                UI.renderCards('favoritesList', favs, 'drug');
            }
        });
    }
};

// Start the app
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Export API for page-specific scripts if needed
window.PharmaAPI = API;
window.PharmaUI = UI;
window.PharmaFavorites = FavoritesManager;
