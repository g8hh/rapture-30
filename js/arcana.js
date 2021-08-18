const spells = {
	timewarp: {
		id: "timewarp",
		name: "时间迁越",
		unl() { return true },
		cost: new Decimal(40),
		effect() { 
			let eff = new Decimal(60);
			if (worldBoostActive("arcana", 1)) eff = eff.times(worldBoostEff("arcana", 1));
			return eff;
		},
		effDesc(e) { return "立即获得 "+formatTime(e)+" 的进度." },
	},
	strikecontrol: {
		id: "strikecontrol",
		name: "突破控制",
		unl() { return worldBoostActive("arcana", 3) },
		cost: new Decimal(100),
		effect() { 
			let eff = new Decimal(3.25);
			if (worldBoostActive("arcana", 4)) eff = eff.times(worldBoostEff("arcana", 4));
			return eff;
		},
		effDesc(e) { return "在30秒内增加所有精神倍增器的等级 (+"+format(e)+"级)." },
		time: new Decimal(30),
	},
}

function getArcaneSoulLimit() {
	let lim = new Decimal(50);
	if (worldBoostActive("arcana", 2)) lim = lim.times(worldBoostEff("arcana", 2));
	return lim;
}

function activateSpell(id) {
	let data = spells[id];
	if (!data.unl()) return;
	if (player.arcana.soul.lt(data.cost)) return;
	if (player.arcana.spellTimes[id]?player.arcana.spellTimes[id].gt(0):false) return;
	player.arcana.soul = player.arcana.soul.sub(data.cost);
	if (data.time) player.arcana.spellTimes[id] = Decimal.add(player.arcana.spellTimes[id]||0, data.time);
	gameLoop(tmp.ase[id]);
}

function spellActive(id) { return player.arcana.spellTimes[id]?player.arcana.spellTimes[id].gt(0):false }