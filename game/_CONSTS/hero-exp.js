// An array of level up requirements
const heroExpToNextLevel = [
	100,
	300,
	600,
	1000,
	1500,
	2100,
	2700,
	3400,
	4200,
	5000,
	6200,
	8800,
	12000,
	17500,
	25000,
	39000,
	71000,
	124000,
];

const heroStatIncreaseOnLevel = [
	{ health: 5, attack: 5 },
	{ health: 30, attack: 30 },
	{ health: 35, attack: 40 },
	{ health: 40, attack: 30 },
	{ health: 85, attack: 65 },
	{ health: 100, attack: 80 },
	{ health: 120, attack: 90 },
	{ health: 130, attack: 110 },
	{ health: 150, attack: 130 },
	{ health: 170, attack: 140 },
	{ health: 190, attack: 155 },
	{ health: 200, attack: 160 },
	{ health: 215, attack: 165 },
	{ health: 230, attack: 170 },
	{ health: 240, attack: 185 },
	{ health: 245, attack: 200 },
	{ health: 270, attack: 220 },
	{ health: 290, attack: 240 },
];

// A function that adds the exp to the hero and checks if he gains a new level
// Returns the updated user (updatedUser) and a bolean (levelUp) if the hero gained a level or not
const gainHeroExp = async (user, exp, message) => {
	if(typeof exp !== "number" || isNaN(exp)) {
		console.error("Exp needs to be a number");
		return;
	}
	else if(exp <= 0) {
		console.error("Exp needs to be higher than zero");
		return;
	}

	// Check if level up
	let levelUp = false;
	let statGains = false;
	const { currentExp, expToNextRank, level } = user.hero;
	if(
		currentExp + exp >= expToNextRank &&
        heroExpToNextLevel.length >= level &&
        heroStatIncreaseOnLevel.length >= level
	) {
		levelUp = heroExpToNextLevel[level + 1];
		statGains = heroStatIncreaseOnLevel[level + 1];
	}

	const updatedUser = await user.gainExp(exp, levelUp, statGains);

	// Send a congrats level up message
	if(levelUp) {
		try{
			let statMessage = "";
			for(const stat in statGains) {
				statMessage += `${statGains[stat]} ${stat}, `;
			}
			message.channel.send(
				`<@${user.account.userId}>: Congratulations your hero just reached level ${updatedUser.hero.rank} and gained ${statMessage}your next level is in ${heroExpToNextLevel[level + 1] - currentExp} exp`,
			);
		}
		catch(err) {
			console.error("Was not able to send new hero level message", err);
		}
	}

	return { updatedUser, levelUp: levelUp ? true : false };
};

// A function that removes the exp to the hero and checks if he lost a new level
// Returns the updated user (updatedUser) and a bolean (levelRemoved) if the hero lost a level or not
const removeHeroExp = async (user, exp, message) => {
	if(typeof exp !== "number" || isNaN(exp)) {
		console.error("Exp needs to be a number");
		return;
	}
	else if(exp <= 0) {
		console.error("Exp needs to be higher than zero");
		return;
	}

	// Check if level down
	let levelDown = false;
	let statRemoved = false;
	const { currentExp, level } = user.hero;
	if(
		currentExp - exp < heroExpToNextLevel[level - 1] ? heroExpToNextLevel[level - 1] : 0
	) {
		levelDown = heroExpToNextLevel[level];
		statRemoved = heroStatIncreaseOnLevel[level];
	}

	const updatedUser = await user.removeExp(exp, levelDown, statRemoved);

	// Send a level down message
	if(levelDown) {
		try{
			let statMessage = "";
			for(const stat in statRemoved) {
				statMessage += `${statRemoved[stat]} ${stat}, `;
			}
			message.channel.send(
				`<@${user.account.userId}>: Your hero lost a level in the battle and is now level ${updatedUser.hero.rank} and lost stats: ${statMessage}`,
			);
		}
		catch(err) {
			console.error("Was not able to send new hero level message", err);
		}
	}

	return { updatedUser, levelDown: levelDown ? true : false };
};


module.exports = { gainHeroExp, heroStatIncreaseOnLevel, removeHeroExp, heroExpToNextLevel };