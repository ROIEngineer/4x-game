/*
🚀 Next Level (What AAA games do)

If you want to level this up:

1. Add Production

Sellers regenerate inventory each tick

2. Add Consumption Needs

Buyers regenerate demand (population growth)

3. Add Multiple Commodities

Food, Iron, Oil, etc.

4. Add Province Markets

Each province has its own market → trade between them
*/

class Commodity {
    constructor(name, basePrice) {
        this.name = name;
        this.basePrice = basePrice;
    }
}


class Seller {
    constructor(commodity) {
        this.commodity = commodity;
        this.cost = this.getRandom(5, 20);
        this.margin = this.getRandom(0.1, 0.5); // 10%–50%
        this.inventory = this.getRandom(50, 150);
    }

    getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }

    getPrice(marketMultiplier) {
        // price reacts to market conditions
        return this.cost * (1 + this.margin) * marketMultiplier;
    }

    sell(quantity) {
        const sold = Math.min(this.inventory, quantity);
        this.inventory -= sold;
        return sold;
    }
}

class Buyer {
    constructor(commodity) {
        this.commodity = commodity;
        this.demand = this.getRandom(20, 100);
        this.budget = this.getRandom(500, 2000);
    }

    getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }

    buy(price) {
        const affordable = this.budget / price;
        const quantity = Math.min(this.demand, affordable);

        this.budget -= quantity * price;
        this.demand -= quantity;

        return quantity;
    }
}


class Market {
    constructor(commodity) {
        this.commodity = commodity;
        this.sellers = [];
        this.buyers = [];
        this.priceMultiplier = 1;
    }

    addSeller(seller) {
        this.sellers.push(seller);
    }

    addBuyer(buyer) {
        this.buyers.push(buyer);
    }

    getTotalSupply() {
        return this.sellers.reduce((sum, s) => sum + s.inventory, 0);
    }

    getTotalDemand() {
        return this.buyers.reduce((sum, b) => sum + b.demand, 0);
    }

    updatePrice() {
        const supply = this.getTotalSupply();
        const demand = this.getTotalDemand();

        if (supply === 0) return;

        const ratio = demand / supply;

        // Clamp to avoid insanity
        this.priceMultiplier = Math.max(0.5, Math.min(2, ratio));
    }

    simulateStep() {
        this.updatePrice();

        for (const buyer of this.buyers) {
            for (const seller of this.sellers) {
                if (buyer.demand <= 0) break;

                const price = seller.getPrice(this.priceMultiplier);
                const quantityWanted = buyer.buy(price);
                const quantitySold = seller.sell(quantityWanted);

                // adjust if seller couldn't fulfill full order
                if (quantitySold < quantityWanted) {
                    buyer.demand += (quantityWanted - quantitySold);
                }
            }
        }
    }
}


const food = new Commodity("Food", 10);

const market = new Market(food);

// Create sellers
for (let i = 0; i < 5; i++) {
    market.addSeller(new Seller(food));
}

// Create buyers
for (let i = 0; i < 10; i++) {
    market.addBuyer(new Buyer(food));
}

// Simulate multiple ticks
for (let i = 0; i < 10; i++) {
    console.log(`--- Step ${i} ---`);
    market.simulateStep();

    console.log("Price Multiplier:", market.priceMultiplier);
    console.log("Supply:", market.getTotalSupply());
    console.log("Demand:", market.getTotalDemand());
}
