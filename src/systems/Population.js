export default class Population {
    constructor(entities) {
        this.entities = new Map(entities.map(e => [e.name, e]));
        this._totalPopulation = entities.reduce((sum, e) => sum + e.population, 0);
        this._populationRankingCache = null;
        this._happinessRankingCache = null;
        this._extinctEntitiesCache = null;
        this._entitiesArrayCache = null;
    }

    // Private helpers
    #getEntity(name) {
        return this.entities.get(name) ?? null;
    }

    #getEntitiesArray() {
        if (this._entitiesArrayCache) return this._entitiesArrayCache;
        this._entitiesArrayCache = [...this.entities.values()];
        return this._entitiesArrayCache;
    }

    #invalidateCache() {
        this._populationRankingCache = null;
        this._happinessRankingCache = null;
        this._extinctEntitiesCache = null;
        this._entitiesArrayCache = null;
    }

    // Growth & Decline
    growPopulation(name, amount) {
        const entity = this.#getEntity(name);
        if (!entity) return { success: false, message: "Entity not found." };
        if (amount <= 0) return { success: false, message: "Amount must be greater than zero." };

        entity.population += amount;
        this._totalPopulation += amount;
        this.#invalidateCache();
        return { success: true, newPopulation: entity.population };
    }

    shrinkPopulation(name, amount) {
        const entity = this.#getEntity(name);
        if (!entity) return { success: false, message: "Entity not found." };
        if (amount <= 0) return { success: false, message: "Amount must be greater than zero." };
        if (amount > entity.population) return { success: false, message: "Population cannot go below zero." };

        entity.population -= amount;
        this._totalPopulation -= amount;
        this.#invalidateCache();
        return { success: true, newPopulation: entity.population };
    }

    applyPlagueEvent(name, rate) {
        const entity = this.#getEntity(name);
        if (!entity) return { success: false, message: "Entity not found." };
        if (rate < 0 || rate > 1) return { success: false, message: "Rate must be between 0 and 1." };

        const populationLost = Math.floor(entity.population * rate);
        entity.population -= populationLost;
        this._totalPopulation -= populationLost;
        this.#invalidateCache();

        return {
            success: true,
            populationLost,
            newPopulation: entity.population
        };
    }

    applyGrowthEffect(name, growthModifier = 1) {
        const entity = this.#getEntity(name);
        if (!entity) return { success: false, message: "Entity not found." };
        if (entity.population >= 1000) return { success: true, message: "Population cap reached.", newPopulation: entity.population };

        let growthRate;

        if (entity.happiness >= 50) {
            growthRate = 0.05;
        } else if (entity.happiness >= 0) {
            growthRate = 0.03;
        } else if (entity.happiness >= -50) {
            growthRate = 0.01;
        } else {
            growthRate = -0.02;
        }

        const growthAmount = Math.floor(entity.population * growthRate * growthModifier);
        const previousPopulation = entity.population;
        entity.population = Math.min(1000, entity.population + growthAmount);
        this._totalPopulation += entity.population - previousPopulation;
        this.#invalidateCache();

        return {
            success: true,
            growthRate,
            growthAmount,
            newPopulation: entity.population
        };
    }

    // Happiness
    getHappiness(name) {
        const entity = this.#getEntity(name);
        if (!entity) return { success: false, message: "Entity not found." };
        return { success: true, happiness: entity.happiness };
    }

    setHappiness(name, value) {
        const entity = this.#getEntity(name);
        if (!entity) return { success: false, message: "Entity not found." };
        if (value < -100 || value > 100) return { success: false, message: "Happiness must be between -100 and 100." };

        entity.happiness = value;
        this.#invalidateCache();
        return { success: true, happiness: entity.happiness };
    }

    applyTaxEffect(name) {
        const entity = this.#getEntity(name);
        if (!entity) return { success: false, message: "Entity not found." };

        let happinessChange;

        if (entity.taxRate <= 0.2) {
            happinessChange = 10;
        } else if (entity.taxRate <= 0.5) {
            happinessChange = -10;
        } else {
            happinessChange = -30;
        }

        entity.happiness = Math.min(100, Math.max(-100, entity.happiness + happinessChange));
        this.#invalidateCache();

        return { success: true, happiness: entity.happiness };
    }

    // Reporting related
    getPopulationRanking() {
        if (this._populationRankingCache) return this._populationRankingCache;
        this._populationRankingCache = this.#getEntitiesArray().toSorted((a, b) => b.population - a.population);
        return this._populationRankingCache;
    }

    getTotalPopulation() {
        return this._totalPopulation;
    }

    getAveragePopulation() {
        return this._totalPopulation / this.entities.size;
    }

    getHappinessRanking() {
        if (this._happinessRankingCache) return this._happinessRankingCache;
        this._happinessRankingCache = this.#getEntitiesArray().toSorted((a, b) => b.happiness - a.happiness);
        return this._happinessRankingCache;
    }

    // Validation related
    isExtinct(name) {
        const entity = this.#getEntity(name);
        if (!entity) return { success: false, message: "Entity not found." };
        return { success: true, isExtinct: entity.population === 0 };
    }

    getExtinctEntities() {
        if (this._extinctEntitiesCache) return this._extinctEntitiesCache;
        this._extinctEntitiesCache = this.#getEntitiesArray().filter(e => e.population === 0);
        return this._extinctEntitiesCache;
    }
}