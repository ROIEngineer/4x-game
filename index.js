const config = {
        gold: 100,
        population: 100,
        taxRate: 0.1
};

const players =  [
    { id: 0, name: "Mongols", gold: config.gold, population: config.population, taxRate: config.taxRate },
    { id: 1, name: "Romans", gold: config.gold, population: config.population, taxRate: config.taxRate },
    { id: 2, name: "French", gold: config.gold, population: config.population, taxRate: config.taxRate },
    { id: 3, name: "Spanish", gold: config.gold, population: config.population, taxRate: config.taxRate }
];


class Economy {
    constructor(players) {
        this.players = players;
    }

    getTaxRate(playerId) {
        if (!this.players[playerId]) return;
        return this.players[playerId].taxRate;
    }

    setTaxRate(playerId, rate) {
        if (!this.players[playerId]) return;

        if (rate < 0 || rate > 1) {
            console.log("Rate must be between 0 and 1.");
            return;
        } 
        this.players[playerId].taxRate = rate;
    }

    raiseTaxes(playerId) {
        if (!this.players[playerId]) return;

        if (this.players[playerId].taxRate < 1) {
            this.players[playerId].taxRate = Math.round((this.players[playerId].taxRate + 0.1) * 10) / 10;
        }
    }

    lowerTaxes(playerId) {
        if (!this.players[playerId]) return;

        if (this.players[playerId].taxRate > 0) {
            this.players[playerId].taxRate = Math.round((this.players[playerId].taxRate - 0.1) * 10) / 10;
        }
    }

    collectTaxes() {
        for (let i = 0; i < this.players.length; i++) {
            const taxes = this.players[i].population * this.players.taxRate;
            this.players[i].gold += taxes;
        }
    }

    transferGold(fromId, toId, goldAmount) {
        if (!this.players[fromId] || !this.players[toId]) return;

        if (goldAmount > this.players[fromId].gold) {
            console.log(`${this.players[fromId].name} has insufficient funds.`);
            return;
        }
        this.players[fromId].gold -= goldAmount;
        this.players[toId].gold += goldAmount;
    }
}

const economy = new Economy(players);
