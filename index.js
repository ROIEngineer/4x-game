import Economy from "./src/systems/Economy.js";
import Population from "./src/systems/Population.js";

const config = {
        gold: 100,
        population: 100,
        taxRate: 0.1
};

const players =  [
    { name: "Mongols", gold: config.gold, population: config.population, taxRate: config.taxRate },
    { name: "Romans", gold: config.gold, population: config.population, taxRate: config.taxRate },
    { name: "French", gold: config.gold, population: config.population, taxRate: config.taxRate },
    { name: "Spanish", gold: config.gold, population: config.population, taxRate: config.taxRate }
];


// System instances 
const economy = new Economy(players);
const population = new Population(players);

const result = population.shrinkPopulation("Mongols", 200);
if (!result.success) console.log(result.message);