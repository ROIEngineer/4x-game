export default class Economy {
    constructor(players) {
        this.players = new Map(players.map(p => [p.name, p]));
        this._totalGold = players.reduce((sum, p) => sum + p.gold, 0);
        this._rankingCache = null;
        this._bankruptPlayersCache = null;
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
        this._rankingCache = null;
        this._bankruptPlayersCache = null;
        this._playersArrayCache = null;
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
            this._totalGold += collected;
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

        fromPlayer.gold -= goldAmount;
        toPlayer.gold += goldAmount;
        this.#invalidateCache();
        return { success: true };
    }

    deductGold(name, goldAmount) {
        const player = this.#getPlayer(name);
        if (!player) return { success: false, message: "Player not found." };
        if (goldAmount <= 0) return { success: false, message: "Amount must be greater than zero." };

        player.gold -= goldAmount;
        this._totalGold -= goldAmount;
        this.#invalidateCache();
        return { success: true, newGold: player.gold };
    }

    isAffordable(name, cost) {
        const player = this.#getPlayer(name);
        if (!player) return { success: false, message: "Player not found." };

        const newGold = player.gold - cost;

        if (newGold < 0) {
            return {
                success: true,
                warning: true,
                message: `${player.name} will be in debt of ${Math.abs(newGold)} gold.`
            };
        }

        return { success: true, warning: false };
    }

    // Reporting related
    getWealthRanking() {
        if (this._rankingCache) return this._rankingCache;
        this._rankingCache = this.#getPlayersArray().toSorted((a, b) => b.gold - a.gold);
        return this._rankingCache;
    }

    getTotalGold() {
        return this._totalGold;
    }

    getAverageGold() {
        return this._totalGold / this.players.size;
    }

    // Validation
    isBankrupt(name) {
        const player = this.#getPlayer(name);
        if (!player) return { success: false, message: "Player not found." };
        return { success: true, isBankrupt: player.gold <= 0 };
    }

    getBankruptPlayers() {
        if (this._bankruptPlayersCache) return this._bankruptPlayersCache;
        this._bankruptPlayersCache = this.#getPlayersArray().filter(p => p.gold <= 0);
        return this._bankruptPlayersCache;
    }
}