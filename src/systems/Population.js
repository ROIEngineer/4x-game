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
}
