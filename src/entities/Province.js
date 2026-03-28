export default class Province {
    constructor(id, name, points) {
        this.id = id;
        this.name = name;
        this.points = points;
        this.ownerNationId = null;
        this.gold = 0;
        this.population = 0;
        this.taxRate = 0.1;
        this.stability = 0;
        this.adjacentProvinceIds = [];
    }

    processTurn() {
        this.population++;
        this.gold += Math.floor(this.population * this.taxRate);

        return {
            success: true,
            id: this.id,
            name: this.name,
            ownerNationId: this.ownerNationId,
            gold: this.gold,
            population: this.population,
            stability: this.stability,
            goldGeneratedThisTurn: Math.floor(this.population * this.taxRate),
            populationGrowthThisTurn: 1
        }
    }

    setOwner(nationId) {
        const previousOwner = this.ownerNationId;
        const previousGold = this.gold;
        const previousPopulation = this.population;
        
        this.ownerNationId = nationId;
        this.stability = Math.max(-100, this.stability - 30);
        this.gold = 0;
        this.population = 0;

        return {
            success: true,
            provinceId: this.id,
            name: this.name,
            previousOwner,
            newOwner: nationId,
            lostGold: previousGold,
            lostPopulation: previousPopulation,
            stability: this.stability
        }
    }

    getInfo() {
        return {
            success: true,
            id: this.id,
            name: this.name,
            ownerNationId: this.ownerNationId,
            gold: this.gold,
            population: this.population,
            stability: this.stability,
        }        
    }
}