var spiritBoosts = [
	[1, 4, "加倍精神获取速率", function(x) { return Decimal.pow(getSpiritBoostEffectEach(1), x) }],
	[2, 4, "每一个精神倍增器使您的精神增长快10%", function(x) { return Decimal.pow(getSpiritBoostEffectEach(2), player.boosts.times(x)) }],
	[3, 4, "精神倍增自身", function(x) { return player.spirit.plus(1).log10().plus(1).pow(x) }],
	[4, 4, "精神增长速度基于精神倍增器总量获得加成", function(x) { return player.boosts.max(1).pow(x) }],
]

function getSpiritBoostEffectEach(n) {
	if (n==1) {
		let each = new Decimal(2);
		if (player.raptureUpgs.includes(41) && tmp.ru) each = each.plus(tmp.ru[41]);
		return each;
	} else if (n==2) {
		let each = new Decimal(1.1);
		if (player.raptureUpgs.includes(42) && tmp.ru) each = each.plus(tmp.ru[42]);
		return each;
	} else return undefined;
}

function getSpiritBoostEffDesc(n) {
	if (n==1) return "Multiply Spirit gain speed by "+format(getSpiritBoostEffectEach(1))
	else if (n==2) return "每一个精神倍增器使得精神获取+ "+formatWhole(getSpiritBoostEffectEach(2).sub(1).times(100))+"%";
	else return spiritBoosts[n-1][2];
}

function getSpiritBoostRewards(n) {
	let data = spiritBoosts[n-1];
	let toDiv = data[1];
	if (player.raptureUpgs.includes(31) && n==1) toDiv = 1;
	else if (player.raptureUpgs.includes(43) && n==3) toDiv = 1;
	return player.boosts.sub(data[0]).div(toDiv).plus(1).floor().max(0);
}

function getSpiritBoostEffect(n) {
	let data = spiritBoosts[n-1];
	return data[3](tmp.sb[n].rewards.plus(tmp.esb[n]));
}

function getSpiritBoostDesc() {
	let b = player.boosts.plus(1);
	if (b.div(4).sub(.25).eq(b.div(4).floor())) return getSpiritBoostEffDesc(1);
	else if (b.div(4).sub(.5).eq(b.div(4).floor())) return getSpiritBoostEffDesc(2);
	else if (b.div(4).sub(.75).eq(b.div(4).floor())) return getSpiritBoostEffDesc(3);
	else return getSpiritBoostEffDesc(4);
}

function getSpiritBoostDiv() {
	let div = new Decimal(1);
	if (player.raptureUpgs.includes(12) && tmp.ru) div = div.times(tmp.ru[12]);
	if (worldBoostActive("heaven", 4)) div = div.times(worldBoostEff("heaven", 4));
	if (worldBoostActive("hell", 4)) div = div.times(worldBoostEff("hell", 4));
	return div;
}

function getSpiritBoostReq(adj=0) { 
	let b = player.boosts.plus(adj);
	if (b.gte(18)) b = b.pow(2.35).div(Decimal.pow(18, 1.35));
	if (player.raptureUpgs.includes(32) && tmp.ru) b = b.times(Decimal.sub(1, tmp.ru[32]));
	if (player.raptureUpgs.includes(44)) b = b.times(0.8);
	let req = Decimal.pow(2, b.times(b.div(10).plus(1)).times(b.div(100).plus(1))); 
	return req.div(getSpiritBoostDiv());
};

function initialSpiritBoostB(s) {
	let b = new Decimal(0);
	let y = s.max(1).log2();
	let internal = y.pow(2).times(27).sub(y.times(3344)).sub(8100);
	if (internal.lt(0)) {
		let increment = new Decimal(0.5);
		var check = new Decimal(0);
		while (player.spirit.gte(getSpiritBoostReq(increment.times(2)))) increment = increment.times(2);
		while (increment.gte(1)) {
			check = b.plus(increment)
			if (player.spirit.gte(getSpiritBoostReq(check))) b = b.plus(increment);
			increment = increment.div(2);
		}
		b = b.plus(player.boosts);
	} else {
		let a = Decimal.cbrt(Decimal.mul(5.1962, internal.sqrt()).plus(y.times(27)).sub(1672));
		b = Decimal.mul(2.6457, a).plus(Decimal.div(382.18, a)).sub(36.667);
	}
	return {b: b, i: internal.gte(0)};
}

function getSpiritBoostBulk() {
	let s = player.spirit.times(getSpiritBoostDiv());
	let data = initialSpiritBoostB(s);
	if (data.i) {
		if (player.raptureUpgs.includes(44)) b = b.div(0.8);
		if (player.raptureUpgs.includes(32) && tmp.ru) b = b.div(Decimal.sub(1, tmp.ru[32]));
		if (b.gte(18)) b = b.times(Decimal.pow(18, 1.35)).root(2.35);
		return b.plus(1).floor();
	} else return data.b.plus(1).floor();
}

function buySpiritBoost(max=false) {
	let cost = getSpiritBoostReq();
	if (player.spirit.lt(cost)) return;
	if (max) {
		let target = getSpiritBoostBulk();
		let bulk = target.sub(player.boosts);
		player.boosts = player.boosts.max(target);
		if (worldBoostActive("heaven", 2)) gainSpirit(bulk.times(5));
	} else {
		player.spirit = player.spirit.sub(cost);
		player.boosts = player.boosts.plus(1);
		if (worldBoostActive("heaven", 2)) gainSpirit(5);
	}
}

function getExtraSpiritBoostEffs(n) {
	let extra = new Decimal(0);
	if (player.raptureUpgs.includes(22) && tmp.ru) extra = extra.plus(tmp.ru[22]);
	if (player.raptureUpgs.includes(43) && n==3) extra = extra.plus(4.5);
	if (worldBoostActive("heaven", 5)) extra = extra.plus(worldBoostEff("heaven", 5));
	if (worldBoostActive("hell", 5)) extra = extra.plus(worldBoostEff("hell", 5));
	if (spellActive("strikecontrol") && tmp.ase) extra = extra.plus(tmp.ase["strikecontrol"]);
	return extra;
}

function getSpiritGain() {
	let gain = new Decimal(.1);
	gain = gain.times(tmp.sb[1].eff);
	gain = gain.times(tmp.sb[2].eff);
	gain = gain.times(tmp.sb[3].eff);
	gain = gain.times(tmp.sb[4].eff);
	if (player.raptureUpgs.includes(11) && tmp.ru) gain = gain.times(tmp.ru[11]);
	if (player.raptureUpgs.includes(21) && tmp.ru) gain = gain.times(tmp.ru[21]);
	if (player.raptureUpgs.includes(31)) gain = gain.times(10);
	if (player.raptureUpgs.includes(24)) gain = gain.times(1e4);
	if (player.raptureUpgs.includes(35) && tmp.ru) gain = gain.times(tmp.ru[35]);
	if (player.raptureUpgs.includes(45) && tmp.ru) gain = gain.times(tmp.ru[45]);
	if (worldBoostActive("heaven", 1)) gain = gain.times(worldBoostEff("heaven", 1));
	if (worldBoostActive("hell", 1)) gain = gain.times(worldBoostEff("hell", 1));
	if (worldBoostActive("arcana", 5)) gain = gain.times(worldBoostEff("arcana", 5));
	return gain;
}

function getSpiritCap() {
	let cap = player.rapture.pow(2).times(100).plus(100);
	if (player.raptureUpgs.includes(33)) cap = cap.div(3);
	if (player.raptureUpgs.includes(14) && tmp.ru) cap = cap.div(tmp.ru[14]);
	return cap;
}

function getSpiritRoot() {
	let rp = player.rapture;
	if (rp.gte(29)) rp = Decimal.pow(29, rp.log(29).pow(1.5));
	if (rp.gte(2)) rp = Decimal.pow(2, rp.log2().pow(4/3));
	let rt = rp.pow(2).div(5).plus(1);
	if (player.raptureUpgs.includes(13) && tmp.ru) rt = rt.root(tmp.ru[13]);
	if (player.raptureUpgs.includes(23) && tmp.ru) rt = rt.root(tmp.ru[23]);
	if (player.raptureUpgs.includes(33)) rt = rt.root(1.05);
	if (player.raptureUpgs.includes(15)) rt = rt.root(1.03);
	if (worldBoostActive("heaven", 3)) rt = rt.root(worldBoostEff("heaven", 3));
	if (worldBoostActive("hell", 3)) rt = rt.root(worldBoostEff("hell", 3));
	return rt;
}