function getStartPlayer() {
	let p = {
		spirit: new Decimal(0),
		boosts: new Decimal(0),
		rapture: new Decimal(0),
		raptureTime: 0,
		raptureEnergy: new Decimal(0),
		spentRaptureEnergy: new Decimal(0),
		raptureUpgs: [],
		worldsSpent: new Decimal(0),
		worldBoosts: {},
		autos: {},
                autosave: true,
		arcana: {
			soul: new Decimal(0),
			spellTimes: {},
		},
	};
	return p;
}

function fixPlayer() {
	let start = getStartPlayer();
	fixPlayerObj(player, start);
	
	transformPlayerToDecimal();
}

function fixPlayerObj(obj, start) {
	for (let x in start) {
		if (obj[x] === undefined) obj[x] = start[x]
		else if (typeof start[x] == "object" && !(start[x] instanceof Decimal)) fixPlayerObj(obj[x], start[x])
		else if (start[x] instanceof Decimal) obj[x] = new Decimal(obj[x])
	}
}

function transformPlayerToDecimal() {
	player.spirit = new Decimal(player.spirit||0);
	player.boosts = new Decimal(player.boosts||0);
	player.rapture = new Decimal(player.rapture||0);
	player.raptureEnergy = new Decimal(player.raptureEnergy||0);
	player.spentRaptureEnergy = new Decimal(player.spentRaptureEnergy||0);
	player.worldsSpent = new Decimal(player.worldsSpent||0);
	for (let i=0;i<Object.keys(worlds).length;i++) player.worldBoosts[Object.keys(worlds)[i]] = new Decimal(player.worldBoosts[Object.keys(worlds)[i]]||0)
	for (let i=0;i<Object.keys(auto_data).length;i++) if (player.autos[Object.keys(auto_data)[i]] === undefined) player.autos[Object.keys(auto_data)[i]] = false;
	player.arcana.soul = new Decimal(player.arcana.soul||0);
	for (let i=0;i<Object.keys(player.arcana.spellTimes).length;i++) player.arcana.spellTimes[Object.keys(player.arcana.spellTimes)[i]] = new Decimal(player.arcana.spellTimes[Object.keys(player.arcana.spellTimes)[i]]||0);
}
