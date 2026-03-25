const config = {
        gold: 100,
        population: 100,
        taxRate: 0.1
};

const players =  [
    { name: "Mongols", gold: config.gold, population: config.population, taxRate: config.taxRate },
    { name: "Romans", gold: config.gold, population: config.population, taxRate: config.taxRate },
    { name: "French", gold: config.gold, population: config.population, taxRate: config.taxRate },
    { name: "Spanish", gold: config.gold, population: config.population, taxRate: config.taxRate }
];


class Economy {
    constructor(players) {
        this.players = players;
    }

    // Tax related
    getTaxRate(player) {
        if (!this.players[player]) return;
        return this.players[player].taxRate;
    }

    setTaxRate(player, rate) {
        if (!this.players[player]) return;

        if (rate < 0 || rate > 1) {
            console.log("Rate must be between 0 and 1.");
            return;
        } 
        this.players[player].taxRate = rate;
    }

    raiseTaxes(player) {
        if (!this.players[player]) return;

        if (this.players[player].taxRate < 1) {
            this.players[player].taxRate = Math.round((this.players[player].taxRate + 0.1) * 10) / 10;
        }
    }

    lowerTaxes(player) {
        if (!this.players[player]) return;

        if (this.players[player].taxRate > 0) {
            this.players[player].taxRate = Math.round((this.players[player].taxRate - 0.1) * 10) / 10;
        }
    }

    collectTaxes() {
        for (let i = 0; i < this.players.length; i++) {
            const taxes = this.players[i].population * this.players[i].taxRate;
            this.players[i].gold += taxes;
        }
    }

    // Gold related 
    transferGold(fromPlayer, toPlayer, goldAmount) {
        if (!this.players[fromPlayer] || !this.players[toPlayer]) return;

        if (goldAmount > this.players[fromPlayer].gold) {
            console.log(`${this.players[fromPlayer].name} has insufficient funds.`);
            return;
        }
        this.players[fromPlayer].gold -= goldAmount;
        this.players[toPlayer].gold += goldAmount;
    }

    deductGold(player, goldAmount) {
        if (!this.players[player]) return;

        if (goldAmount > this.players[player].gold) {
            console.log(`${this.players[player].name} has insufficient funds.`);
            return;
        }
        this.players[player].gold -= goldAmount;
    }

    isAffordable(player, cost) {
        if (!this.players[player]) return;

        if (cost > this.players[player].gold) {
            console.log("Insufficient funds.");
            return false;
        }
        return true;
    }

    // Reporting related 
    getWealthRanking() {
        return this.players.toSorted((a, b) => b.gold - a.gold);
    }

    getTotalGold() {
        return this.players.reduce((total, current) => total + current.gold, 0);
    }

    getAverageGold() {
        const total = this.getTotalGold();
        return total / this.players.length;
    }

    // Validation 
    isBankrupt(player) {
        if (!this.players[player]) return;
        return this.players[player].gold <= 0;
    }

    getBankruptPlayers() {
        return this.players.filter(player => player.gold <= 0);
    }

}

const economy = new Economy(players);

economy.deductGold(0, 10);
economy.deductGold(1, 20);
economy.deductGold(2, 40);
economy.deductGold(3, 80);

console.log(economy.getWealthRanking());