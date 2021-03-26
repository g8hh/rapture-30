var player;
var tmp = {};
var intervals = {};
var version = 0.1;
var gameID = "raptureThingy";
var tab = "Main";
var allTabs = ["Options", "Main", "Auto", "Rapture", "Greater Worlds", "Arcana"] // shhhhhhhhhh, you're seeing spoilers...
var tabUnlocks = {
	Options() { return true },
	Main() { return true },
	Auto() { return worldBoostActive("hell", 2) },
	Rapture() { return player.rapture.gte(1) || player.spirit.gte(tmp.sc) },
	'Greater Worlds'() { return player.rapture.gte(15) },
	Arcana() { return player.rapture.gte(25) },
}

function loadGame() {
	let get = localStorage.getItem(gameID)
	if (get) player = JSON.parse(atob(get));
	else player = getStartPlayer();
	
	fixPlayer();
	updateTemp();
	updateTemp();
	updateTemp();
	updateTemp();
	updateTemp();
	loadVue();
	
	intervals.game = setInterval(function() { gameLoop(50/1000) }, 50)
	intervals.save = setInterval(function() { if (player.autosave) save(); }, 2500)
}

function save() {
	localStorage.setItem(gameID, btoa(JSON.stringify(player)));
}

function importSave() {
	let data = prompt("Paste save data: ")
	if (data===undefined||data===null||data=="") return;
	try {
		player = JSON.parse(atob(data));
		save()
		window.location.reload();
	} catch(e) {
		console.log("Import failed!");
		console.error(e);
		return;
	}
}

function exportSave() {
	let data = btoa(JSON.stringify(player))
	const a = document.createElement('a');
	a.setAttribute('href', 'data:text/plain;charset=utf-8,' + data);
	a.setAttribute('download', "rapturehundred.txt");
	a.setAttribute('id', 'downloadSave');

	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}

function toggleAutosave() {
	player.autosave = !player.autosave;
}

function hardReset() {
	if (!confirm("Are you sure you want to reset everything???")) return;
	player = getStartPlayer();
	save();
	window.location.reload();
}

function gameLoop(diff) {
	updateTemp();
	
	gainSpirit(diff);
	player.raptureTime += new Decimal(diff).toNumber();
	for (let i=0;i<Object.keys(player.arcana.spellTimes).length;i++) {
		let id = Object.keys(player.arcana.spellTimes)[i];
		player.arcana.spellTimes[id] = player.arcana.spellTimes[id].sub(diff).max(0);
	}
	
	doAutoTick(diff);
}

function gainSpirit(diff) { return player.spirit = player.spirit.pow(tmp.sr).plus(tmp.sg.times(diff)).root(tmp.sr).min(tmp.sc); }

function getNextFeatureDisplay() {
	if (player.rapture.lt(1)) return "Unlock Rapture: Reach the Spirit limit.";
	else if (player.rapture.lt(15)) return "Unlock Greater Worlds: Reach Rapture 15.";
	else if (player.rapture.lt(25)) return "Unlock Arcana: Reach Rapture 25.";
	else return "All Features Unlocked!";
}