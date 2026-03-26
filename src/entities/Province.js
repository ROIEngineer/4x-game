import Economy from "../systems/Economy.js";
import Population from "../systems/Population.js";
import terrains from "../config/terrains.js";

export default class Province {
    constructor(owner, nameGenerator, config) {
        this.name = nameGenerator.generateName();
        this.owner = owner;
        this.terrain = terrains[config.terrain] ?? terrains.plains;

        // Province acts as its own entity for Economy and Population
        const entity = [{
            name: this.name,
            gold: config.gold,
            population: config.population,
            taxRate: config.taxRate,
            happiness: config.happiness
        }];

        this.economy = new Economy(entity);
        this.population = new Population(entity);
    }

    capture(newOwner) {
        const previousOwner = this.owner;
        this.owner = newOwner;

        // Happiness penalty for newly captured province
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
            terrain: this.terrain,
            gold: this.economy.getTotalGold(),
            population: this.population.getTotalPopulation(),
        };
    }

    processTurn() {
        this.economy.collectTaxes(this.terrain.taxModifier);
        this.population.applyGrowthEffect(this.name, this.terrain.growthModifier);
        this.population.applyTaxEffect(this.name);
    }
}