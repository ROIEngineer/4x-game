class Population {
    constructor(provinceId, totalPopulation = 1000) {
        this.provinceId = provinceId;
        this.totalPopulation = totalPopulation;
        this.cultureDistribution = {};
        this.religionDistribution = {};
        this.happiness = 100;
        this.growthRate = 0.01;
        this.unrest = 0;
    }

    grow() {
        this.totalPopulation += Math.floor(this.totalPopulation * this.growthRate);
    }

    changeHappiness(amount) {
        this.happiness = Math.max(0, Math.min(100, this.happiness + amount));
    }
}