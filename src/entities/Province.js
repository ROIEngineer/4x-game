import Economy from "../systems/Economy";
import Population from "../systems/Population";

export default class Province {
    constructor(name, economy, population terrain, owner) {
        this.name = getName();
        this.economy = new Economy();
        this.population = new Population();
        this.terrain = terrain;
        this.owner = owner;
    }
}