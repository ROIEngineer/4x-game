class Economy {
    constructor(nationId) {
        this.nationId = nationId;
        this.gold = 1000;
        this.incomePerTurn = 0;
        this.expensesPerTurn = 0;
        this.taxRate = 0.1;
        this.resourceStockpiles = {};
    }

    collectTaxes(population) {
        const taxCollected = Math.floor(population.totalPopulation * this.taxRate);
        this.gold += taxCollected;
        this.incomePerTurn = taxCollected;
    }
}