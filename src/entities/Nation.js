class Nation {
    constructor(id, name, governmentType, leader) {
        this.id = id;
        this.name = name;
        this.governmentType = governmentType;
        this.leader = leader;
        this.capitalProvinceId = null;
        this.provinceIds = [];
        this.populationIds = [];
        this.treasury = 1000;
        this.income = 0;
        this.expenses = 0;
        this.stability = 100;
        this.legitimacy = 100;
        this.relations = new Map(); // other nation id -> relation score
        this.activePolicies = [];
        this.economy = new Economy(this.id);
    }

    addProvince(province) {
        this.provinces.push(province);
    }

    removeProvince(provinceName) {
        this.provinces = this.provinces.filter(p => p.name !== provinceName);
    }

    receiveCommand(command) {
        // For now, just pass it to systems
        CommandSystem.handleCommand(this, command);
    }
}