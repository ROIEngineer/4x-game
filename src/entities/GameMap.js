export default class GameMap {
    constructor() {
        this.provinces = [];
    }

    generate() {
        // Will generate tiles, terrain, and provinces later
        return this;
    }

    getTotalProvinces() {
        return this.provinces.length;
    }
}