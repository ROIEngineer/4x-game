import Economy from "./src/systems/Economy.js";
import Population from "./src/systems/Population.js";
import Player from "./src/entities/Player.js";

const config = {
    gold: 100, 
    population: 100,
    taxRate: 0.1,
    happiness: 0 
}

// Player Setup
const players = [
    new Player("Mongols", config),
    new Player("Romans", config),
    new Player("French", config),
    new Player("Spanish", config)
];

// System instances 
const economy = new Economy(players);
const population = new Population(players);

// Test
console.log(population.getAveragePopulation());
