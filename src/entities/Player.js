class Player {
  constructor(id, name, type = 'human') {
    this.id = id;
    this.name = name;
    this.type = type; // 'human' or 'ai'
    this.controlledNationIds = [];
  }

  // Example: send command to a nation
  issueCommand(nation, action, payload) {
    nation.receiveCommand({ action, payload, playerId: this.id });
  }
}