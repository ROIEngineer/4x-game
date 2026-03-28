import GameMap from "./GameMap.js";

export default class Game {
    constructor(players, nations, maxTurns = null) {
        this.players = players;
        this.nations = nations;
        this.maxTurns = maxTurns;
        this.gameStarted = false;
        this.gameOver = false;
        this.currentTurn = 0;
        this.totalProvinces = 0;
        this.map = new GameMap();
    }

    startGame() {
        if (this.gameStarted) return { success: false, message: "Game has already started." };

        this.gameStarted = true;
        this.map.generate();
        this.totalProvinces = this.map.getTotalProvinces();
        this.currentTurn = 1;

        this.nations.forEach(nation => {
            const province = this.map.getStartingProvince(nation.name);
            if (province) nation.addProvince(province);
        });

        return {
            success: true,
            message: "Game started.",
            totalProvinces: this.totalProvinces,
            maxTurns: this.maxTurns,
            nations: this.nations.map(n => ({
                name: n.name,
                provinces: n.provinces.length
            }))
        };
    }

    processTurn() {
        if (!this.gameStarted) return { success: false, message: "Game has not started yet." };
        if (this.gameOver) return { success: false, message: "Game is already over." };

        // Process every nation's provinces and build nation summaries
        const nationSummaries = this.nations.map(nation => {
            const provinceSummaries = nation.provinces.map(province => {
                const previousGold = province.economy.getTotalGold();
                const previousPopulation = province.population.getTotalPopulation();

                province.processTurn();

                const newGold = province.economy.getTotalGold();
                const newPopulation = province.population.getTotalPopulation();
                const happiness = province.population.getHappiness(province.name).happiness;

                return {
                    name: province.name,
                    terrain: province.terrainType,
                    gold: newGold,
                    population: newPopulation,
                    happiness,
                    goldGeneratedThisTurn: newGold - previousGold,
                    populationGrowthThisTurn: newPopulation - previousPopulation
                };
            });

            const totalGold = provinceSummaries.reduce((sum, p) => sum + p.gold, 0);
            const totalPopulation = provinceSummaries.reduce((sum, p) => sum + p.population, 0);
            const averageHappiness = Math.round(
                provinceSummaries.reduce((sum, p) => sum + p.happiness, 0) / provinceSummaries.length
            );

            return {
                name: nation.name,
                totalGold,
                totalPopulation,
                averageHappiness,
                provinces: provinceSummaries
            };
        });

        // Check win condition before incrementing turn
        const winResult = this.checkWinCondition();

        if (winResult) {
            this.gameOver = true;
        }

        this.currentTurn++;

        return {
            success: true,
            turn: this.currentTurn - 1,
            nations: nationSummaries,
            winner: winResult,
            gameOver: this.gameOver
        };
    }

    checkWinCondition() {
        // Check domination — one nation owns all provinces
        for (const nation of this.nations) {
            if (nation.provinces.length === this.totalProvinces) {
                return { name: nation.name, reason: "domination" };
            }
        }

        // Check turn limit
        if (this.maxTurns !== null && this.currentTurn >= this.maxTurns) {
            const winner = this.nations.reduce((best, nation) => {
                if (nation.provinces.length > best.provinces.length) return nation;
                if (nation.provinces.length === best.provinces.length) {
                    const nationGold = nation.provinces.reduce((sum, p) => sum + p.economy.getTotalGold(), 0);
                    const bestGold = best.provinces.reduce((sum, p) => sum + p.economy.getTotalGold(), 0);
                    return nationGold > bestGold ? nation : best;
                }
                return best;
            });

            return { name: winner.name, reason: "turn limit reached" };
        }

        return null;
    }
}