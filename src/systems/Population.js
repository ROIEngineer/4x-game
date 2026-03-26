/* Population Class
population growth, deaths, birth rates, happiness 

Economy class referencing population size to 
calculate taxes, while Population tracks how tax rates 
affect citizen happiness or growth.

A Population class is still unwritten — growth, happiness, and how tax rates affect citizens would be a natural next step.
*/

export default class Population {
    constructor(players) {
        this.players = new Map (players.map(p => [p.name, p]));
    }

    // Private helper 
    #getPlayer(name) {
        return this.players.get(name) ?? null;
    }

    // Growth & Decline
    growPopulation(name, amount) {
        const player = this.#getPlayer(name);
        if (!player) return { success: false, message: "Player not found." };
        if (amount <= 0) return { success: false, message: "Amount must be greater than 0." };
        player.population += amount;
        return { success: true, newPopulation: player.population };
    }

    shrinkPopulation(name, amount) {
        const player = this.#getPlayer(name);
        if (!player) return { success: false, message: "Player not found." };

        if (amount <= 0) return { success: false, message: "Amount must be greater than zero." };
        if (amount > player.population) return { success: false, message: "Population cannot go below zero." };
        
        player.population -= amount;
        return { success: true, newPopulation: player.population };
    }

    applyPlagueEvent(name, rate) {
        const player = this.#getPlayer(name);
        if (!player) return { success: false, message: "Player not found." };
        if (rate < 0 || rate > 1) return { success: false, message: "Rate must be between 0 and 1." };

        const populationLost = Math.floor(player.population * rate);
        player.population -= populationLost;

        return { success: true, populationLost, newPopulation: player.population };
    }

    getHappiness(name) {
        const player = this.#getPlayer(name);
        if (!player) return { success: false, message: "Player not found." };
        return { success: true, happiness: player.happiness };
    }

    setHappiness(name, value) {
        const player = this.#getPlayer(name);
        if (!player) return { success: false, message: "Player not found." };
        if (value < 0 || value > 10) return { success: false, message: "Happiness must be between 0 and 10." };

        player.happiness = value;
        return { success: true, happiness: player.happiness };
    }

    applyTaxEffect(name, taxRate) {
        const player = this.#getPlayer(name);
        if (!player) return { success: false, message: "Player not found." };

        if (taxRate >= 0.5) {
            this.setHappiness(player, 50);
        } else if (taxRate <= 0.4) {
            this.setHappiness(player, 100);
        }
    }
}

