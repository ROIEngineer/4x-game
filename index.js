import Economy from "./src/systems/Economy.js";
import Population from "./src/systems/Population.js";
import Player from "./src/entities/Player.js";
import Province from "./src/entities/Province.js";
import ProvinceNameGenerator from "./src/utils/ProvinceNameGenerator.js";

const nameGenerator = new ProvinceNameGenerator();

// Player setup
const players = [
    new Player("Mongols"),
    new Player("Romans"),
    new Player("French"),
    new Player("Spanish")
];

// Assign each player a starting province
players.forEach(player => {
    const province = new Province(player.name, nameGenerator, "plains");
    player.addProvince(province);
});

// Player level systems
const economy = new Economy(players);
const population = new Population(players);

// Test
players.forEach(player => {
    console.log(`${player.name}'s province: ${player.provinces[0].name}`);
    console.log(player.provinces[0].getInfo());
});

// Process a turn for all provinces
players.forEach(player => {
    player.provinces.forEach(province => province.processTurn());
});

console.log("\nAfter turn:");
players.forEach(player => {
    console.log(player.provinces[0].getInfo());
});