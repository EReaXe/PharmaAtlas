/**
 * API Manager
 * Handles data fetching and searching
 */

export const API = {
    data: {
        drugs: [],
        companies: [],
        ingredients: []
    },
    cache: {},

    async init() {
        try {
            await this.loadAllData();
            return true;
        } catch (error) {
            console.error('Data loading failed:', error);
            return false;
        }
    },

    async loadAllData() {
        // Parallel data fetching
        // Removed cache busting (?t=...) for better performance in production
        const [drugs, companies, ingredients] = await Promise.all([
            this.fetchJSON('data/drugs.json'),
            this.fetchJSON('data/companies.json'),
            this.fetchJSON('data/ingredients.json')
        ]);

        this.data.drugs = drugs;
        this.data.companies = companies;
        this.data.ingredients = ingredients;
    },

    async fetchJSON(url) {
        if (this.cache[url]) return this.cache[url];
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        this.cache[url] = data;
        return data;
    },

    getData() {
        return this.data;
    },

    findById(listName, id) {
        return this.data[listName]?.find(item => item.id === id);
    },

    getFavorites(favoriteIds) {
        return this.data.drugs.filter(d => favoriteIds.includes(d.id));
    },

    search(query) {
        query = query.toLowerCase().trim();
        if (!query) return { drugs: [], companies: [], ingredients: [] };

        return {
            drugs: this.data.drugs.filter(d => d.name.toLowerCase().includes(query)),
            companies: this.data.companies.filter(c => c.name.toLowerCase().includes(query)),
            ingredients: this.data.ingredients.filter(i => i.name.toLowerCase().includes(query))
        };
    }
};
