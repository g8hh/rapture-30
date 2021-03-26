const worlds = {
	heaven: {
		name: "heaven",
		cName: "Heaven",
		col: "#13615c",
		unl() { return true; },
		boosts: [
			"Spirit is gained 1e11x faster, but this decreases over time",
			"Purchasing a Spirit Boost gives 5s of production instantly",
			"The Rapture reduction is brought to the 1.1th root, but this weakens over time",
			"Spirit Boosts are cheaper based on your Hell Boosts",
			"Hell Boosts after 3 add to each Spirit Boost effect",
		],
		boostCurrent: {
			0() { return Decimal.div(1e11, Math.log(Math.max(player.raptureTime, 1)+1)/Math.log(1.0005)+1).max(1) },
			2() { return Decimal.div(0.1, Math.log(Math.max(player.raptureTime, 1)+1)/Math.log(2.25)+1).plus(1) },
			3() { return player.worldBoosts.hell.plus(1) },
			4() { return player.worldBoosts.hell.sub(3).max(0).div(1.75) },
		},
		boostEffSuffix: {
			0: "x",
			2: "th root",
			3: "x cheaper",
			4: " added",
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
		cName: "Arcana",
		col: "#50135e",
		unl() { return player.rapture.gte(25) },
		boosts: [
			"Time Warp's effect is stronger over time",
			"Raptures boost the Arcanic Soul limit",
			"Unlock a new Spell",
			"Strike Control's effect is stronger based on your Spirit",
			"Unspent Arcanic Soul boosts Spirit gain speed",
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
		cName: "Hell",
		col: "#5c1613",
		unl() { return true; },
		boosts: [
			"Spirit is gained 2,000x faster, and this increases over time",
			"Unlock Automation",
			"The Rapture reduction is brought to the 1.015th root, but this gets stronger over time",
			"Spirit Boosts are cheaper based on your Heaven Boosts",
			"Heaven Boosts after 3 add to each Spirit Boost effect",
		],
		boostCurrent: {
			0() { return Decimal.mul(2e3, Math.log(Math.max(player.raptureTime, 1)+1)/Math.log(1.0005)+1) },
			2() { return Decimal.mul(0.015, Math.log10(Math.log(Math.max(player.raptureTime, 1)+1)/Math.log(1.5)+1)+1).plus(1) },
			3() { return player.worldBoosts.heaven.plus(1) },
			4() { return player.worldBoosts.heaven.sub(3).max(0).div(1.75) },
		},
		boostEffSuffix: {
			0: "x",
			2: "th root",
			3: "x cheaper",
			4: " added",
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
	if (!confirm("Are you sure you want to respec your World Boosts? This will force a Rapture reset!")) return;
	player.worldsSpent = new Decimal(0);
	for (let i=0;i<Object.keys(player.worldBoosts).length;i++) player.worldBoosts[Object.keys(player.worldBoosts)[i]] = new Decimal(0);
	doRapture(true);
}