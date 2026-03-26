export default class Player {
    constructor(name, config, nameGenerator) {
        this.name = name;
        this.gold = config.gold;
        this.population = config.population;
        this.taxRate = config.taxRate;
        this.happiness = config.happiness;
        this.provinces = [];
    }

    addProvince(province) {
        this.provinces.push(province);
    }

    removeProvince(provinceName) {
        this.provinces = this.provinces.filter(p => p.name !== provinceName);
    }
}