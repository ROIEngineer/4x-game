export default class Population {
    constructor(players) {
        this.players = new Map(players.map(p => [p.name, p]));
        this._totalPopulation = players.reduce((sum, p) => sum + p.population, 0);
        this._populationRankingCache = null;
        this._happinessRankingCache = null;
        this._extinctPlayersCache = null;
        this._playersArrayCache = null;
    }

    // Private helpers
    #getPlayer(name) {
        return this.players.get(name) ?? null;
    }

    #getPlayersArray() {
        if (this._playersArrayCache) return this._playersArrayCache;
        this._playersArrayCache = [...this.players.values()];
        return this._playersArrayCache;
    }

    #invalidateCache() {
        this._populationRankingCache = null;
        this._happinessRankingCache = null;
        this._extinctPlayersCache = null;
        this._playersArrayCache = null;
    }

    // Growth & Decline
    growPopulation(name, amount) {
        const player = this.#getPlayer(name);
        if (!player) return { success: false, message: "Player not found." };
        if (amount <= 0) return { success: false, message: "Amount must be greater than zero." };

        player.population += amount;
        this._totalPopulation += amount;
        this.#invalidateCache();
        return { success: true, newPopulation: player.population };
    }

    shrinkPopulation(name, amount) {
        const player = this.#getPlayer(name);
        if (!player) return { success: false, message: "Player not found." };
        if (amount <= 0) return { success: false, message: "Amount must be greater than zero." };
        if (amount > player.population) return { success: false, message: "Population cannot go below zero." };

        player.population -= amount;
        this._totalPopulation -= amount;
        this.#invalidateCache();
        return { success: true, newPopulation: player.population };
    }

    applyPlagueEvent(name, rate) {
        const player = this.#getPlayer(name);
        if (!player) return { success: false, message: "Player not found." };
        if (rate < 0 || rate > 1) return { success: false, message: "Rate must be between 0 and 1." };

        const populationLost = Math.floor(player.population * rate);
        player.population -= populationLost;
        this._totalPopulation -= populationLost;
        this.#invalidateCache();

        return {
            success: true,
            populationLost,
            newPopulation: player.population
        };
    }

    applyGrowthEffect(name) {
        const player = this.#getPlayer(name);
        if (!player) return { success: false, message: "Player not found." };
        if (player.population >= 1000) return { success: true, message: "Population cap reached.", newPopulation: player.population };

        let growthRate;

        if (player.happiness >= 50) {
            growthRate = 0.05;
        } else if (player.happiness >= 0) {
            growthRate = 0.03;
        } else if (player.happiness >= -50) {
            growthRate = 0.01;
        } else {
            growthRate = -0.02;
        }

        const growthAmount = Math.floor(player.population * growthRate);
        const previousPopulation = player.population;
        player.population = Math.min(1000, player.population + growthAmount);
        this._totalPopulation += player.population - previousPopulation;
        this.#invalidateCache();

        return {
            success: true,
            growthRate,
            growthAmount,
            newPopulation: player.population
        };
    }

    // Happiness
    getHappiness(name) {
        const player = this.#getPlayer(name);
        if (!player) return { success: false, message: "Player not found." };
        return { success: true, happiness: player.happiness };
    }

    setHappiness(name, value) {
        const player = this.#getPlayer(name);
        if (!player) return { success: false, message: "Player not found." };
        if (value < -100 || value > 100) return { success: false, message: "Happiness must be between -100 and 100." };

        player.happiness = value;
        this.#invalidateCache();
        return { success: true, happiness: player.happiness };
    }

    applyTaxEffect(name) {
        const player = this.#getPlayer(name);
        if (!player) return { success: false, message: "Player not found." };

        let happinessChange;

        if (player.taxRate <= 0.2) {
            happinessChange = 10;
        } else if (player.taxRate <= 0.5) {
            happinessChange = -10;
        } else {
            happinessChange = -30;
        }

        player.happiness = Math.min(100, Math.max(-100, player.happiness + happinessChange));
        this.#invalidateCache();

        return { success: true, happiness: player.happiness };
    }

    // Reporting related
    getPopulationRanking() {
        if (this._populationRankingCache) return this._populationRankingCache;
        this._populationRankingCache = this.#getPlayersArray().toSorted((a, b) => b.population - a.population);
        return this._populationRankingCache;
    }

    getTotalPopulation() {
        return this._totalPopulation;
    }

    getAveragePopulation() {
        return this._totalPopulation / this.players.size;
    }

    getHappinessRanking() {
        if (this._happinessRankingCache) return this._happinessRankingCache;
        this._happinessRankingCache = this.#getPlayersArray().toSorted((a, b) => b.happiness - a.happiness);
        return this._happinessRankingCache;
    }

    // Validation related
    isExtinct(name) {
        const player = this.#getPlayer(name);
        if (!player) return { success: false, message: "Player not found." };
        return { success: true, isExtinct: player.population === 0 };
    }

    getExtinctPlayers() {
        if (this._extinctPlayersCache) return this._extinctPlayersCache;
        this._extinctPlayersCache = this.#getPlayersArray().filter(p => p.population === 0);
        return this._extinctPlayersCache;
    }
}