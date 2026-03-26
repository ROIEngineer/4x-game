export default class Player {
    constructor(name, config) {
        this.name = name;
        this.gold = config.gold;
        this.population = config.population;
        this.taxRate = config.taxRate;
        this.happiness = config.happiness;
    }
}