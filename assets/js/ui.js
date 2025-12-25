/**
 * UI Manager
 * Handles DOM updates and rendering
 */

import { FavoritesManager } from './storage.js';

export const UI = {
    renderCards(containerId, items, type) {
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
    },

    updateStats(data) {
        const statsDrugs = document.getElementById('statsDrugs');
        const statsCompanies = document.getElementById('statsCompanies');
        const statsIngredients = document.getElementById('statsIngredients');

        if (statsDrugs) statsDrugs.textContent = data.drugs.length;
        if (statsCompanies) statsCompanies.textContent = data.companies.length;
        if (statsIngredients) statsIngredients.textContent = data.ingredients.length;
    },

    toggleThemeIcon(theme) {
        const toggleBtn = document.getElementById('themeToggle');
        if (toggleBtn) {
            toggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    },

    showError(message) {
        document.body.innerHTML = `<div class="error" style="text-align:center; padding:50px;">${message}</div>`;
    }
};
