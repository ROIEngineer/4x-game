import Economy from "./src/systems/Economy.js";
import Population from "./src/systems/Population.js";
import Player from "./src/entities/Player.js";

const config = {
    gold: 100, 
    population: 100,
    taxRate: 0.1,
    happiness: 100
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
const result = population.setHappiness("Mongols", -30);
if (result.success) console.log(result.happiness);

console.log(players[0].happiness);