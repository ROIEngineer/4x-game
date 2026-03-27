import Economy from "../systems/Economy.js";
import Population from "../systems/Population.js";

class Province {
    constructor(id, name, terrainType, ownerNationId = null) {
        this.id = id;
        this.name = name.generateName();
        this.ownerNationId = ownerNationId;
        this.terrainType = terrainType;
        this.population = new Population(this.id);
        this.stability = 100;
        this.infrastructure = {};
        this.resourceOutputs = {};
        this.buildings = [];
        this.adjacentProvinceIds = [];
    }
}