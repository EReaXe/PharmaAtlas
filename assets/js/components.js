/**
 * Components Manager
 * Handles reusable HTML components like Header and Footer
 */

export const Components = {
    renderHeader(activePage = 'index') {
        const header = document.getElementById('app-header');
        if (!header) return;

        const navLinks = [
            { id: 'index', text: 'Anasayfa', url: 'index.html' },
            { id: 'drugs', text: 'İlaçlar', url: 'drugs.html' },
            { id: 'companies', text: 'Firmalar', url: 'companies.html' },
            { id: 'ingredients', text: 'Etken Maddeler', url: 'ingredients.html' }
        ];

        const navHTML = navLinks.map(link =>
            `<a href="${link.url}" class="${activePage === link.id ? 'active' : ''}">${link.text}</a>`
        ).join('');

        header.innerHTML = `
            <div class="container header-content">
                <a href="index.html" class="logo">PharmaAtlas</a>
                <div class="header-right">
                    <nav class="main-nav">
                        ${navHTML}
                    </nav>
                    <button id="themeToggle" class="theme-toggle" aria-label="Temayı Değiştir">🌙</button>
                </div>
            </div>
        `;
    },

    renderFooter() {
        const footer = document.getElementById('app-footer');
        if (!footer) return;

        footer.className = 'glass-footer';
        footer.innerHTML = `
            <div class="container">
                <p>PharmaAtlas - Açık Kaynak İlaç Veritabanı</p>
                <p>
                    <a href="https://github.com/google-deepmind/pharma-atlas" target="_blank">
                        <span>🐙</span> GitHub Sayfası
                    </a>
                </p>
            </div>
        `;
    }
};
