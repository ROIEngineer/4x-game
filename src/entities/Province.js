import Economy from "../systems/Economy.js";
import Population from "../systems/Population.js";
import terrains from "../config/terrains.js";

export default class Province {
    constructor(owner, nameGenerator, terrain = "plains") {
        this.name = nameGenerator.generateName();
        this.owner = owner;
        this.terrainType = terrain;
        this.terrain = terrains[terrain] ?? terrains.plains;

        const entity = [{
            name: this.name,
            gold: 0,
            population: 10,
            taxRate: 0.1,
            happiness: 0
        }];

        this.economy = new Economy(entity);
        this.population = new Population(entity);
    }

    capture(newOwner) {
        const previousOwner = this.owner;
        this.owner = newOwner;
        this.population.setHappiness(this.name, -50);

        return {
            success: true,
            province: this.name,
            previousOwner,
            newOwner,
            message: `${this.name} has been captured by ${newOwner}.`
        };
    }

    getInfo() {
        return {
            name: this.name,
            owner: this.owner,
            terrain: this.terrainType,
            gold: this.economy.getTotalGold(),
            population: this.population.getTotalPopulation()
        };
    }

    processTurn() {
        this.population.applyGrowthEffect(this.name, this.terrain.growthModifier);
        this.population.applyTaxEffect(this.name);
        this.economy.collectTaxes(this.terrain.taxModifier);
    }
}