class Nation {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.gold = 0;
        this.provinceIds = [];
        this.stability = 100;
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