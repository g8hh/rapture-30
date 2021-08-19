function updateTemp() {
	updateMainTemp();
	updateRaptureTemp();
	updateWorldsTemp();
	updateArcanaTemp();
}

function updateMainTemp() {
	if (!tmp.sb) tmp.sb = {};
	if (!tmp.esb) tmp.esb = {};
	for (let i=1;i<=spiritBoosts.length;i++) {
		if (!tmp.sb[i]) tmp.sb[i] = {}
		tmp.esb[i] = getExtraSpiritBoostEffs(i);
		tmp.sb[i].rewards = getSpiritBoostRewards(i);
		tmp.sb[i].eff = getSpiritBoostEffect(i);
	}
	tmp.sg = getSpiritGain();
	tmp.sc = getSpiritCap();
	tmp.sr = getSpiritRoot();
}

function updateRaptureTemp() {
	if (!tmp.ru) tmp.ru = {};
	for (let r=1;r<=raptureUpgs.rows;r++) {
		for (let c=1;c<=raptureUpgs.cols;c++) {
			let id = r*10+c;
			if (raptureUpgs[id] && raptureUpgs[id].effect) tmp.ru[id] = raptureUpgs[id].effect();
		}
	}
}

function updateWorldsTemp() {
	tmp.twc = player.rapture.sub(14).max(0).floor()
	tmp.wc = tmp.twc.sub(player.worldsSpent);
	tmp.ntwc = tmp.twc.plus(1).plus(14).ceil();
	if (!tmp.wb) tmp.wb = {};
	for (let i=0;i<Object.keys(worlds).length;i++) {
		let name = Object.keys(worlds)[i];
		if (!tmp.wb[name]) tmp.wb[name] = {};
		for (let b=0;b<Object.keys(worlds[name].boostCurrent).length;b++) {
			let id = Object.keys(worlds[name].boostCurrent)[b];
			tmp.wb[name][id] = worlds[name].boostCurrent[id]();
		}
	}
}

function updateArcanaTemp() {
	tmp.asl = getArcaneSoulLimit();
	if (!tmp.ase) tmp.ase = {};
	for (let i=0;i<Object.keys(spells).length;i++) {
		let name = Object.keys(spells)[i];
		tmp.ase[name] = spells[name].effect();
	}
}