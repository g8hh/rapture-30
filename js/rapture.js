var raptureUpgs = {
	rows: 4,
	cols: 5,
	11: {
		unl() { return player.rapture.gte(1) },
		desc: "每个情感都会使精神三倍化.",
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
		desc: "精神会使精神倍增器更便宜.",
		cost: new Decimal(1),
		effect() { return player.spirit.plus(1).log(Math.E).plus(1) },
		effDesc(e) { return "÷"+format(e) },
	},
	13: {
		unl() { return player.rapture.gte(2) },
		desc: "精神倍增器减弱情感减益.",
		cost: new Decimal(1),
		effect() { return player.boosts.plus(1).log10().plus(1).log10().plus(1) },
		effDesc(e) { return format(e)+"th root" },
	},
	14: {
		unl() { return player.rapture.gte(9) },
		desc: "花费的情感能量减少情感重置的要求.",
		cost: new Decimal(2),
		effect() { return player.spentRaptureEnergy.plus(1).log2().plus(1) },
		effDesc(e) { return "÷"+format(e) },
	},
	15: {
		unl() { return player.rapture.gte(15) },
		desc: "情感debuff变为其1.03次根.",
		cost: new Decimal(30),
	},
	21: {
		unl() { return player.rapture.gte(3) },
		desc: "未使用的情感能量倍增精神获取.",
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
		desc: "情感加成精神倍增器的效果.",
		cost: new Decimal(3),
		effect() { return player.rapture.times(player.raptureUpgs.includes(25)?0.65:0.5) },
		effDesc(e) { return "+"+format(e) },
	},
	23: {
		unl() { return player.rapture.gte(4) },
		desc: "精神减弱情感减益.",
		cost: new Decimal(3),
		effect() { return player.spirit.plus(1).log10().plus(1).log10().plus(1).log10().times(6).plus(1).cbrt() },
		effDesc(e) { return format(e)+"th root" },
	},
	24: {
		unl() { return player.rapture.gte(9) },
		desc: "精神x10000.",
		cost: new Decimal(6),
	},
	25: {
		unl() { return player.rapture.gte(15) && player.raptureUpgs.includes(15) },
		desc: "精神升级22加强30%.",
		cost: new Decimal(35),
	},
	31: {
		unl() { return player.rapture.gte(8) },
		desc: "第一个精神倍增器的效果在任何一次精神倍增器获得的时候都会被加成, 同时精神x10.",
		cost: new Decimal(5),
	},
	32: {
		unl() { return player.rapture.gte(5) },
		desc: "未使用的情感能量减缓精神倍增器的价格增长.",
		cost: new Decimal(5),
		effect() { return Decimal.sub(1, Decimal.div(1, player.raptureEnergy.plus(1).log(4.5).plus(1).log2().plus(1))) },
		effDesc(e) { return format(e.times(100))+"%" },
	},
	33: {
		unl() { return player.rapture.gte(7) },
		desc: "情感重置的要求/3, 情感减益变为其1.05次根.",
		cost: new Decimal(5),
	},
	34: {
		unl() { return player.rapture.gte(10) },
		desc: "情感升级11和21的效果^2.25.",
		cost: new Decimal(10),
	},
	35: {
		unl() { return player.rapture.gte(15) && player.raptureUpgs.includes(25) },
		desc: "购买的情感升级数加成精神获取速率.",
		cost: new Decimal(75),
		effect() { return Decimal.pow(8, player.raptureUpgs.length) },
		effDesc(e) { return format(e)+"x" },
	},
	41: {
		unl() { return player.rapture.gte(11) },
		desc: "第一个精神倍增器的效果+0.19/倍增器.",
		size: "12px",
		cost: new Decimal(11),
		effect() { return player.boosts.times(0.19) },
		effDesc(e) { return "+"+format(e)+"x" },
	},
	42: {
		unl() { return player.rapture.gte(11) },
		desc: "第二个精神倍增器的效果+1%/倍增器.",
		size: "12px",
		cost: new Decimal(11),
		effect() { return player.boosts.times(0.01) },
		effDesc(e) { return "+"+formatWhole(e.times(100))+"%" },
	},
	43: {
		unl() { return player.rapture.gte(11) },
		desc: "第三个精神倍增器的效果在每次获得情感倍增器的时候都会被加成, 同时它获得4.5个免费等级.",
		cost: new Decimal(11),
	},
	44: {
		unl() { return player.rapture.gte(14) },
		desc: "精神倍增器价格增长减缓20%.",
		cost: new Decimal(16),
	},
	45: {
		unl() { return player.rapture.gte(15) && player.raptureUpgs.includes(35) },
		desc: "总计的世界倍增器加成精神获取速率.",
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
	if (!confirm("你确定你要重置你的情感升级吗? 这会进行一次情感重置!")) return;
	player.raptureEnergy = player.raptureEnergy.plus(player.spentRaptureEnergy);
	player.spentRaptureEnergy = new Decimal(0);
	player.raptureUpgs = [];
	doRapture(true);
}