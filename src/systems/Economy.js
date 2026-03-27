export default class Economy {
    constructor(entities) {
        this.entities = new Map(entities.map(e => [e.name, e]));
        this._totalGold = entities.reduce((sum, e) => sum + e.gold, 0);
        this._rankingCache = null;
        this._bankruptEntitiesCache = null;
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
        this._rankingCache = null;
        this._bankruptEntitiesCache = null;
        this._entitiesArrayCache = null;
    }

    // Tax related
    getTaxRate(name) {
        const entity = this.#getEntity(name);
        if (!entity) return { success: false, message: "Entity not found." };
        return { success: true, taxRate: entity.taxRate };
    }

    setTaxRate(name, rate) {
        const entity = this.#getEntity(name);
        if (!entity) return { success: false, message: "Entity not found." };
        if (rate < 0 || rate > 1) return { success: false, message: "Rate must be between 0 and 1." };

        entity.taxRate = rate;
        return { success: true };
    }

    raiseTaxes(name) {
        const entity = this.#getEntity(name);
        if (!entity) return { success: false, message: "Entity not found." };
        if (entity.taxRate >= 1) return { success: false, message: "Tax rate is already at maximum." };

        entity.taxRate = Math.round((entity.taxRate + 0.1) * 10) / 10;
        return { success: true, taxRate: entity.taxRate };
    }

    lowerTaxes(name) {
        const entity = this.#getEntity(name);
        if (!entity) return { success: false, message: "Entity not found." };
        if (entity.taxRate <= 0) return { success: false, message: "Tax rate is already at minimum." };

        entity.taxRate = Math.round((entity.taxRate - 0.1) * 10) / 10;
        return { success: true, taxRate: entity.taxRate };
    }

    collectTaxes(terrainModifier = 1) {
        const summary = [];
        for (const entity of this.entities.values()) {
            const collected = Math.floor(entity.population * entity.taxRate * terrainModifier);
            entity.gold += collected;
            this._totalGold += collected;
            summary.push({ name: entity.name, collected, newGold: entity.gold });
        }
        this.#invalidateCache();
        return { success: true, summary };
    }

    // Gold related
    transferGold(fromName, toName, goldAmount) {
        const fromEntity = this.#getEntity(fromName);
        const toEntity = this.#getEntity(toName);

        if (!fromEntity || !toEntity) return { success: false, message: "Entity not found." };
        if (goldAmount <= 0) return { success: false, message: "Amount must be greater than zero." };

        fromEntity.gold -= goldAmount;
        toEntity.gold += goldAmount;
        this.#invalidateCache();
        return { success: true };
    }

    deductGold(name, goldAmount) {
        const entity = this.#getEntity(name);
        if (!entity) return { success: false, message: "Entity not found." };
        if (goldAmount <= 0) return { success: false, message: "Amount must be greater than zero." };

        entity.gold -= goldAmount;
        this._totalGold -= goldAmount;
        this.#invalidateCache();
        return { success: true, newGold: entity.gold };
    }

    isAffordable(name, cost) {
        const entity = this.#getEntity(name);
        if (!entity) return { success: false, message: "Entity not found." };

        const newGold = entity.gold - cost;

        if (newGold < 0) {
            return {
                success: true,
                warning: true,
                message: `${entity.name} will be in debt of ${Math.abs(newGold)} gold.`
            };
        }

        return { success: true, warning: false };
    }

    // Reporting related
    getWealthRanking() {
        if (this._rankingCache) return this._rankingCache;
        this._rankingCache = this.#getEntitiesArray().toSorted((a, b) => b.gold - a.gold);
        return this._rankingCache;
    }

    getTotalGold() {
        return this._totalGold;
    }

    getAverageGold() {
        return this._totalGold / this.entities.size;
    }

    // Validation
    isBankrupt(name) {
        const entity = this.#getEntity(name);
        if (!entity) return { success: false, message: "Entity not found." };
        return { success: true, isBankrupt: entity.gold <= 0 };
    }

    getBankruptEntities() {
        if (this._bankruptEntitiesCache) return this._bankruptEntitiesCache;
        this._bankruptEntitiesCache = this.#getEntitiesArray().filter(e => e.gold <= 0);
        return this._bankruptEntitiesCache;
    }
}