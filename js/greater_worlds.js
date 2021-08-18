const worlds = {
	heaven: {
		name: "heaven",
		cName: "天堂",
		col: "#13615c",
		unl() { return true; },
		boosts: [
			"精神x1e11, 该效果随时间变弱",
			"购买精神倍增器后立即获得5秒的进度",
			"情感减益变为其1.1次根,但该效果随时间变弱",
			"基于地狱减少精神倍增器的价格",
			"大于3的地狱加成精神倍增器效果",
		],
		boostCurrent: {
			0() { return Decimal.div(1e11, Math.log(Math.max(player.raptureTime, 1)+1)/Math.log(1.0005)+1).max(1) },
			2() { return Decimal.div(0.1, Math.log(Math.max(player.raptureTime, 1)+1)/Math.log(2.25)+1).plus(1) },
			3() { return player.worldBoosts.hell.plus(1) },
			4() { return player.worldBoosts.hell.sub(3).max(0).div(1.75) },
		},
		boostEffSuffix: {
			0: "x",
			2: "次根",
			3: "x 便宜",
			4: " 增加",
		},
		buyBoost() {
			if (player.worldBoosts[this.name].gte(this.boosts.length)) return;
			if (tmp.wc.lt(1)) return;
			player.worldsSpent = player.worldsSpent.plus(1);
			player.worldBoosts[this.name] = player.worldBoosts[this.name].plus(1);
		},
		displayBoosts() {
			let amt = player.worldBoosts[this.name];
			let disp = "";
			if (amt.gt(0)) for (let i=0;i<amt.min(this.boosts.length).toNumber();i++) {
				disp += this.boosts[i]
				if (this.boostCurrent[i]) disp += ":  "+format(tmp.wb[this.name][i])+this.boostEffSuffix[i];
				disp += "<br><br>"
			}
			return disp;
		},
	},
	arcana: {
		name: "arcana",
		cName: "奥秘",
		col: "#50135e",
		unl() { return player.rapture.gte(25) },
		boosts: [
			"时间迁越效果随时间变强",
			"情感加成奥秘灵魂上限",
			"解锁新法术",
			"突破控制的效果随精神变强",
			"未使用的奥秘灵魂加成精神获取",
		],
		boostCurrent: {
			0() { return Decimal.log2(player.raptureTime+1).plus(1) },
			1() { return player.rapture.div(5).plus(1) },
			3() { return player.spirit.plus(1).log10().plus(1).log10().times(4).plus(1) },
			4() { return player.arcana.soul.plus(1).pow(6) },
		},
		boostEffSuffix: {
			0: "x",
			1: "x",
			3: "x",
			4: "x",
		},
		buyBoost() {
			if (player.worldBoosts[this.name].gte(this.boosts.length)) return;
			if (tmp.wc.lt(1)) return;
			player.worldsSpent = player.worldsSpent.plus(1);
			player.worldBoosts[this.name] = player.worldBoosts[this.name].plus(1);
		},
		displayBoosts() {
			let amt = player.worldBoosts[this.name];
			let disp = "";
			if (amt.gt(0)) for (let i=0;i<amt.min(this.boosts.length).toNumber();i++) {
				disp += this.boosts[i]
				if (this.boostCurrent[i]) disp += ":  "+format(tmp.wb[this.name][i])+this.boostEffSuffix[i]
				disp += "<br><br>"
			}
			return disp;
		},
	},
	hell: {
		name: "hell",
		cName: "地狱",
		col: "#5c1613",
		unl() { return true; },
		boosts: [
			"精神x2000，效果随时间变强",
			"解锁自动化",
			"情感减益变为其1.015次根，该效果随时间变强",
			"精神倍增器基于天堂变得更便宜",
			"大于3的天堂加成精神倍增器效果",
		],
		boostCurrent: {
			0() { return Decimal.mul(2e3, Math.log(Math.max(player.raptureTime, 1)+1)/Math.log(1.0005)+1) },
			2() { return Decimal.mul(0.015, Math.log10(Math.log(Math.max(player.raptureTime, 1)+1)/Math.log(1.5)+1)+1).plus(1) },
			3() { return player.worldBoosts.heaven.plus(1) },
			4() { return player.worldBoosts.heaven.sub(3).max(0).div(1.75) },
		},
		boostEffSuffix: {
			0: "x",
			2: "次根",
			3: "x 便宜",
			4: " 增加",
		},
		buyBoost() {
			if (player.worldBoosts[this.name].gte(this.boosts.length)) return;
			if (tmp.wc.lt(1)) return;
			player.worldsSpent = player.worldsSpent.plus(1);
			player.worldBoosts[this.name] = player.worldBoosts[this.name].plus(1);
		},
		displayBoosts() {
			let amt = player.worldBoosts[this.name];
			let disp = "";
			if (amt.gt(0)) for (let i=0;i<amt.min(this.boosts.length).toNumber();i++) {
				disp += this.boosts[i]
				if (this.boostCurrent[i]) disp += ":  "+format(tmp.wb[this.name][i])+this.boostEffSuffix[i]
				disp += "<br><br>"
			}
			return disp;
		},
	},
}

function worldBoostActive(type, n) { return player.worldBoosts[type].gte(n) && worlds[type].unl() }
function worldBoostEff(type, n) { return tmp.wb?tmp.wb[type][n-1]:new Decimal(1) }

function respecWorldBoosts() {
	if (!confirm("您确定您要重置世界吗?这会进行一次情感重置!")) return;
	player.worldsSpent = new Decimal(0);
	for (let i=0;i<Object.keys(player.worldBoosts).length;i++) player.worldBoosts[Object.keys(player.worldBoosts)[i]] = new Decimal(0);
	doRapture(true);
}