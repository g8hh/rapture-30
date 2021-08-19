const auto_data = {
	spirit_boosts: {
		id: "spirit_boosts",
		name: "自动精神倍增器",
		unl() { return worldBoostActive("hell", 2) },
		tick() { buySpiritBoost(true); },
	},
}

function doAutoTick(diff) {
	for (let i=0;i<Object.keys(auto_data).length;i++) {
		let name = Object.keys(auto_data)[i];
		if (player.autos[name] && auto_data[name].unl()) auto_data[name].tick();
	}
}