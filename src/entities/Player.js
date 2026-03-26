export default class Player {
    constructor(name) {
        this.name = name;
        this.gold = 0;
        this.population = 0;
        this.taxRate = 0.1;
        this.happiness = 0;
        this.provinces = [];
    }

    addProvince(province) {
        this.provinces.push(province);
    }

    removeProvince(provinceName) {
        this.provinces = this.provinces.filter(p => p.name !== provinceName);
    }
}