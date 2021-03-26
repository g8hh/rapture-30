var raptureUpgs = {
	rows: 4,
	cols: 5,
	11: {
		unl() { return player.rapture.gte(1) },
		desc: "Each Rapture triples Spirit gain speed.",
		cost: new Decimal(1),
		effect() { 
			let eff = Decimal.pow(3, player.rapture);
			if (player.raptureUpgs.includes(34)) eff = eff.pow(2.25);
			return eff;
		},
		effDesc(e) { return format(e)+"x" },
	},
	12: {
		unl() { return player.rapture.gte(1) },
		desc: "Spirit cheapens Spirit Boosts.",
		cost: new Decimal(1),
		effect() { return player.spirit.plus(1).log(Math.E).plus(1) },
		effDesc(e) { return "÷"+format(e) },
	},
	13: {
		unl() { return player.rapture.gte(2) },
		desc: "Spirit Boosts weaken the Rapture reduction.",
		cost: new Decimal(1),
		effect() { return player.boosts.plus(1).log10().plus(1).log10().plus(1) },
		effDesc(e) { return format(e)+"th root" },
	},
	14: {
		unl() { return player.rapture.gte(9) },
		desc: "Spent Rapture Energy reduces the Rapture requirement.",
		cost: new Decimal(2),
		effect() { return player.spentRaptureEnergy.plus(1).log2().plus(1) },
		effDesc(e) { return "÷"+format(e) },
	},
	15: {
		unl() { return player.rapture.gte(15) },
		desc: "The Rapture reduction is brought to the 1.03th root.",
		cost: new Decimal(30),
	},
	21: {
		unl() { return player.rapture.gte(3) },
		desc: "Unspent Rapture Energy boosts Spirit gain speed.",
		cost: new Decimal(3),
		effect() { 
			let eff = player.raptureEnergy.times(10).max(1);
			if (player.raptureUpgs.includes(34)) eff = eff.pow(2.25);
			return eff;
		},
		effDesc(e) { return formatWhole(e)+"x" },
	},
	22: {
		unl() { return player.rapture.gte(2) },
		desc: "Raptures add to each Spirit Boost effect.",
		cost: new Decimal(3),
		effect() { return player.rapture.times(player.raptureUpgs.includes(25)?0.65:0.5) },
		effDesc(e) { return "+"+format(e) },
	},
	23: {
		unl() { return player.rapture.gte(4) },
		desc: "Spirit weakens the Rapture reduction.",
		cost: new Decimal(3),
		effect() { return player.spirit.plus(1).log10().plus(1).log10().plus(1).log10().times(6).plus(1).cbrt() },
		effDesc(e) { return format(e)+"th root" },
	},
	24: {
		unl() { return player.rapture.gte(9) },
		desc: "Spirit is gained 10,000x faster.",
		cost: new Decimal(6),
	},
	25: {
		unl() { return player.rapture.gte(15) && player.raptureUpgs.includes(15) },
		desc: "The effect of Rapture Upgrade 22 is 30% stronger.",
		cost: new Decimal(35),
	},
	31: {
		unl() { return player.rapture.gte(8) },
		desc: "The first Spirit Boost effect is applied on each Spirit Boost, and Spirit is gained 10x faster.",
		cost: new Decimal(5),
	},
	32: {
		unl() { return player.rapture.gte(5) },
		desc: "Unspent Rapture Energy weakens the Spirit Boost cost formula.",
		cost: new Decimal(5),
		effect() { return Decimal.sub(1, Decimal.div(1, player.raptureEnergy.plus(1).log(4.5).plus(1).log2().plus(1))) },
		effDesc(e) { return format(e.times(100))+"%" },
	},
	33: {
		unl() { return player.rapture.gte(7) },
		desc: "The Rapture requirement is divided by 3, and the Rapture reduction is brought to the 1.05th root.",
		cost: new Decimal(5),
	},
	34: {
		unl() { return player.rapture.gte(10) },
		desc: "The effects of Rapture Upgrades 11 & 21 are raised ^2.25.",
		cost: new Decimal(10),
	},
	35: {
		unl() { return player.rapture.gte(15) && player.raptureUpgs.includes(25) },
		desc: "Bought Rapture Upgrades boost Spirit gain speed.",
		cost: new Decimal(75),
		effect() { return Decimal.pow(8, player.raptureUpgs.length) },
		effDesc(e) { return format(e)+"x" },
	},
	41: {
		unl() { return player.rapture.gte(11) },
		desc: "The first Spirit Boost effect is increased by 0.19x for every Spirit Boost.",
		size: "12px",
		cost: new Decimal(11),
		effect() { return player.boosts.times(0.19) },
		effDesc(e) { return "+"+format(e)+"x" },
	},
	42: {
		unl() { return player.rapture.gte(11) },
		desc: "The second Spirit Boost effect is increased by 1% for every Spirit Boost.",
		size: "12px",
		cost: new Decimal(11),
		effect() { return player.boosts.times(0.01) },
		effDesc(e) { return "+"+formatWhole(e.times(100))+"%" },
	},
	43: {
		unl() { return player.rapture.gte(11) },
		desc: "The third Spirit Boost effect is applied on every Spirit Boost, and it gains 4.5 levels.",
		cost: new Decimal(11),
	},
	44: {
		unl() { return player.rapture.gte(14) },
		desc: "The Spirit Boost cost formula is 20% weaker.",
		cost: new Decimal(16),
	},
	45: {
		unl() { return player.rapture.gte(15) && player.raptureUpgs.includes(35) },
		desc: "Total World Boosts boost Spirit gain speed.",
		cost: new Decimal(100),
		effect() { 
			let b = Decimal.add(player.worldBoosts.heaven||0, player.worldBoosts.hell||0).plus(player.worldBoosts.arcana||0);
			return Decimal.pow(2, b.pow(2));
		},
		effDesc(e) { return format(e)+"x" },
	},
}

function doRapture(force=false) {
	if (!force) {
		if (player.spirit.lt(tmp.sc)) return;
		player.rapture = player.rapture.plus(1);
		player.raptureEnergy = player.raptureEnergy.plus(player.rapture);
	}
	player.spirit = new Decimal(0);
	player.boosts = new Decimal(0);
	player.raptureTime = 0;
	player.arcana.soul = tmp.asl;
	player.arcana.spellTimes = {};
	updateTemp();
}

function buyRaptureUpg(x) {
	if (player.raptureUpgs.includes(x)) return;
	let cost = raptureUpgs[x].cost;
	if (player.raptureEnergy.lt(cost)) return;
	player.raptureEnergy = player.raptureEnergy.sub(cost);
	player.spentRaptureEnergy = player.spentRaptureEnergy.plus(cost);
	player.raptureUpgs.push(x);
}

function respecRaptureUpgs() {
	if (!confirm("Are you sure you want to respec your Rapture Upgrades? This will force a Rapture reset!")) return;
	player.raptureEnergy = player.raptureEnergy.plus(player.spentRaptureEnergy);
	player.spentRaptureEnergy = new Decimal(0);
	player.raptureUpgs = [];
	doRapture(true);
}