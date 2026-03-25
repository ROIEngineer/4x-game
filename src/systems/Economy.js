export default class Economy {
    constructor(players) {
        this.players = new Map(players.map(p => [p.name, p]));
        this._totalGoldCache = null;
        this._rankingCache = null;
    }

    // Private helpers
    #getPlayer(name) {
        return this.players.get(name) ?? null;
    }

    #invalidateCache() {
        this._totalGoldCache = null;
        this._rankingCache = null;
    }

    // Tax related
    getTaxRate(name) {
        const player = this.#getPlayer(name);
        if (!player) return { success: false, message: "Player not found." };
        return { success: true, taxRate: player.taxRate };
    }

    setTaxRate(name, rate) {
        const player = this.#getPlayer(name);
        if (!player) return { success: false, message: "Player not found." };
        if (rate < 0 || rate > 1) return { success: false, message: "Rate must be between 0 and 1." };

        player.taxRate = rate;
        return { success: true };
    }

    raiseTaxes(name) {
        const player = this.#getPlayer(name);
        if (!player) return { success: false, message: "Player not found." };
        if (player.taxRate >= 1) return { success: false, message: "Tax rate is already at maximum." };

        player.taxRate = Math.round((player.taxRate + 0.1) * 10) / 10;
        return { success: true, taxRate: player.taxRate };
    }

    lowerTaxes(name) {
        const player = this.#getPlayer(name);
        if (!player) return { success: false, message: "Player not found." };
        if (player.taxRate <= 0) return { success: false, message: "Tax rate is already at minimum." };

        player.taxRate = Math.round((player.taxRate - 0.1) * 10) / 10;
        return { success: true, taxRate: player.taxRate };
    }

    collectTaxes() {
        const summary = [];
        for (const player of this.players.values()) {
            const collected = player.population * player.taxRate;
            player.gold += collected;
            summary.push({ name: player.name, collected, newGold: player.gold });
        }
        this.#invalidateCache();
        return { success: true, summary };
    }

    // Gold related
    transferGold(fromName, toName, goldAmount) {
        const fromPlayer = this.#getPlayer(fromName);
        const toPlayer = this.#getPlayer(toName);

        if (!fromPlayer || !toPlayer) return { success: false, message: "Player not found." };
        if (goldAmount <= 0) return { success: false, message: "Amount must be greater than zero." };
        if (goldAmount > fromPlayer.gold) return { success: false, message: `${fromPlayer.name} has insufficient funds.` };

        fromPlayer.gold -= goldAmount;
        toPlayer.gold += goldAmount;
        this.#invalidateCache();
        return { success: true };
    }

    deductGold(name, goldAmount) {
        const player = this.#getPlayer(name);
        if (!player) return { success: false, message: "Player not found." };
        if (goldAmount <= 0) return { success: false, message: "Amount must be greater than zero." };
        if (goldAmount > player.gold) return { success: false, message: `${player.name} has insufficient funds.` };

        player.gold -= goldAmount;
        this.#invalidateCache();
        return { success: true };
    }

    isAffordable(name, cost) {
        const player = this.#getPlayer(name);
        if (!player) return { success: false, message: "Player not found." };

        return cost <= player.gold
            ? { success: true }
            : { success: false, message: "Insufficient funds." };
    }

    // Reporting related
    getWealthRanking() {
        if (this._rankingCache) return this._rankingCache;
        this._rankingCache = [...this.players.values()].toSorted((a, b) => b.gold - a.gold);
        return this._rankingCache;
    }

    getTotalGold() {
        if (this._totalGoldCache !== null) return this._totalGoldCache;
        this._totalGoldCache = [...this.players.values()].reduce((total, p) => total + p.gold, 0);
        return this._totalGoldCache;
    }

    getAverageGold() {
        return this.getTotalGold() / this.players.size;
    }

    // Validation
    isBankrupt(name) {
        const player = this.#getPlayer(name);
        if (!player) return { success: false, message: "Player not found." };
        return { success: true, isBankrupt: player.gold <= 0 };
    }

    getBankruptPlayers() {
        return [...this.players.values()].filter(player => player.gold <= 0);
    }
}