const Discord = require("discord.js");
const { getLocationIcon, getStatsIcon, getWeaponIcon, getPlaceIcon, getGreenRedIcon, getResourceIcon } = require("../_CONSTS/icons");

// Dungeon boss invitation
const createDungeonBossInvitation = (dungeon, user)=>{
    const sideColor = "#45b6fe";
    const username = user.account.username;
    const { currentLocation } = user.world;
    const locationIcon = getLocationIcon(currentLocation);
    const dungeonIcon = getPlaceIcon("dungeon");
        const rules = `${getGreenRedIcon(dungeon.boss.rules.allowArmy)} \`Army allowed\`\n ${getGreenRedIcon(dungeon.boss.rules.canKill)} \`Dungeon deadly\`\n${getGreenRedIcon(dungeon.boss.rules.allowHelpers)} \`Helpers allowed\`\n\n**Unclocks**: ${getLocationIcon(dungeon.boss.unlocks)} **${dungeon.boss.unlocks}**\n`;
        const dungeonStats = `${getStatsIcon("health")} \`Health: ${dungeon.boss.stats.health}\`\n ${getStatsIcon("attack")} \`Attack: ${dungeon.boss.stats.attack}\`\n ${getGreenRedIcon(dungeon.boss.stats.healing)} \`Healing\`\n`;
        const bossRewards = `${getResourceIcon("gold")} \`Gold: ${dungeon.boss.rewards.gold}\`\n ${getResourceIcon("xp")} \`XP: ${dungeon.boss.rewards.xp}\`\n${getGreenRedIcon(dungeon.boss.rewards.drop)} \`Loot drop\`\n\n   `;
        const bossWeapons = dungeon.boss.bossWeapons.map(w=>{
            return `${getWeaponIcon(w)} \`${w}\``;
        });

        const fields = [{
            name: `${dungeon.boss.name}'s Boss stats:`,
            value: dungeonStats,
            inline:true,
        },
        {
            name: `${dungeon.boss.name}'s weapons:`,
            value: bossWeapons,
            inline: true,
        },

        {
            name: "\u200B",
            value: "\u200B",
            inline: false,
        },
        {
            name: "Rules",
            value: rules,
            inline: true,
        },

        {
            name: `${dungeon.boss.name}'s rewards:`,
            value: bossRewards,
            inline: true,
        }];

        const embedInvitation = new Discord.MessageEmbed()
            .setTitle(`${username} is going for the dungeon boss!!`)
            .setDescription(`Help taking out ${dungeonIcon} **${dungeon.boss.name}** in ${locationIcon} ${currentLocation}!`)
            .setColor(sideColor)
            .addFields(
                ...fields,
            )
            .setFooter(`React with a ${getPlaceIcon("dungeon")} within 20 seconds to participate! (max 5!)`);
        return embedInvitation;
    };

    const generateDungeonBossRound = (progress)=>{

        const weapons = progress.dungeon.boss.allowedWeapons;

        const initiativeTakerName = progress.initiativeTaker.account.username;
        const bottomLeft = progress.players.length > 1 ?
            progress.players
                .filter(p=> p.account.username !== initiativeTakerName)
                .map(p=> `${p.account.username} ${p.hero.currentHealth <= 0 ? "☠️" : ""} `)
                : ["You're fighting solo!"];

        const roundResults = progress.roundResults;
        if (roundResults.length) {
            bottomLeft.push("\n");
            bottomLeft.push(`\`Results from round ${progress.bossAttempts}:\``);
            bottomLeft.push(roundResults);
        }
        const dungeonName = progress.dungeon.name;
        const dungeonIcon = getPlaceIcon("dungeon");

        const bossName = progress.dungeon.boss.name;
        const dungeonHp = getDungeonHp(progress.dungeon.boss.stats);
        const playersHp = getPlayersHp(progress.players, progress.dungeon.boss.helpers);

        const weaponsTitle = "Choose your weapon:";
        const weaponsOverview = Object.keys(weapons).map(w=>{
            const { answer, name, description } = weapons[w];
            return `${getWeaponIcon(name)} ${answer}) **${name}** ${description}\n`;
        });
        const title = `${dungeonIcon} ${dungeonName}  ~~~  BOSS FIGHT \nround ${progress.bossAttempts + 1}`;
        const sideColor = "#45b6fe";
        const description = progress.dungeon.boss.roundDescriptions[progress.bossAttempts];
        const footer = "TIP: Write your weapon of choice in the chat. eg -> a or c";
        const fields = [
            {
                name: `${bossName} HP:`,
                value: dungeonHp,
                inline: true,
            },
            {
                name: `${initiativeTakerName}'s gang total HP:`,
                value: playersHp,
                inline: true,
            },
            {
                name: "\u200B",
                value: "\u200B",
                inline: false,
            },
            {
                name: `${initiativeTakerName}'s gang:`,
                value: bottomLeft,
                inline: true,
            },
            {
                name: `${weaponsTitle}`,
                value: weaponsOverview,
                inline: true,
            },
        ];

        const embedResult = new Discord.MessageEmbed()
            .setTitle(title)
            .setDescription(description)
            .setColor(sideColor)
            .addFields(
                ...fields,
            )
            .setFooter(footer);
        return embedResult;
    };


    const generateDungeonBossResult = (progress)=>{
        if (progress.win) {
            return createDungeonBossResultWin(progress);
        }
        return createDungeonBossResultLoss(progress);
    };

    const createDungeonBossResultWin = (progress) =>{

        const initiativeTakerName = progress.initiativeTaker.account.username;
        const initiativeTakerAlive = progress.initiativeTaker.hero.currentHealth > 0;
        const sideColor = "#45b6fe";

        const bossName = progress.dungeon.boss.name;

        const topLeft = progress.players
            .filter(p=> p.account.username !== initiativeTakerName)
            .map(p=> `${p.account.username} ${p.hero.currentHealth <= 0 ? "☠️" : ""} `);

        const { roundResults } = progress;
        if (roundResults.length) {
            topLeft.push("\n");
            topLeft.push("`Results from last round:`");
            topLeft.push(`\n ☠️ ☠️ ${bossName} ☠️ ☠️ `);
            topLeft.push(roundResults);
        }

        const rewards = [];

        if (initiativeTakerAlive) {
            rewards.push(`${initiativeTakerName}\n ${getResourceIcon("gold")} Gold: ${progress.rewards.initiativeTaker.gold}\n ${getResourceIcon("xp")}Xp: ${progress.rewards.initiativeTaker.xp} \n 🎲Drop: ${progress.rewards.initiativeTaker.drop}`);
        }
        if (progress.rewards.helpers.length) {
            progress.rewards.helpers.length.forEach(r=>{
                rewards.push(`${r.name}\n ${getResourceIcon("gold")} Gold: ${r.gold}\n ${getResourceIcon("xp")}Xp: ${r.xp} \n 🎲Drop: ${r.drop}`);
            });
        }

        const fields = [
            {
                name: `${initiativeTakerName}'s gang:`,
                value: topLeft,
                inline: true,
            },
            {
                name: "Rewards",
                value: rewards,
                inline: true,
            },
        ];


        const title = `${bossName} defeated!`;

        const unlockedLocation = progress.dungeon.boss.unlocks;
        const locationIcon = getLocationIcon(unlockedLocation);
        let description = `${initiativeTakerName} `;
        if (initiativeTakerAlive) {
            description += `has unlocked ${locationIcon} ${unlockedLocation}`;
        }
        else {
            description += "died trying to fight the boss";
        }

        const embedResult = new Discord.MessageEmbed()
            .setTitle(title)
            .setDescription(description)
            .setColor(sideColor)
            .addFields(
                ...fields,
            );
        return embedResult;
    };


    const createDungeonBossResultLoss = (progress) =>{
        const initiativeTakerName = progress.initiativeTaker.account.username;
        const sideColor = "#45b6fe";

        const bottomLeft = progress.players
            .filter(p=> p.account.username !== initiativeTakerName)
            .map(p=> `${p.account.username} ${p.hero.currentHealth <= 0 ? "☠️" : ""} `);

        const { roundResults } = progress;
        if (roundResults.length) {
            bottomLeft.push("\n");
            bottomLeft.push("`Results from last round:`");
            bottomLeft.push(roundResults);
        }

        const fields = [
            {
                name: `${initiativeTakerName}'s gang:`,
                value: bottomLeft,
                inline: false,
            },
        ];


        const bossName = progress.dungeon.boss.name;
        const title = `${bossName} defeated ${initiativeTakerName}!`;

        const description = "Heal up and try again later!";


        const embedResult = new Discord.MessageEmbed()
            .setTitle(title)
            .setDescription(description)
            .setColor(sideColor)
            .addFields(
                ...fields,
            );
        return embedResult;
        };

        const getPlayersHp = (players, currentDiscordIds)=>{
            // embed get's messed up if hp bar is longer than 20
            const MAX_REPEATING = 20;
            const totalPlayerHealth = players
                .reduce((acc, curr)=> acc + curr.hero.health, 0);
            const totalPlayerCurrentHealth = players
                .filter(p=> currentDiscordIds.includes(p.account.userId))
                .reduce((acc, curr)=> acc + curr.hero.currentHealth, 0);
            const percentageHealth = (totalPlayerCurrentHealth / totalPlayerHealth * 100) * MAX_REPEATING / 100;
            const percentageMissingHealth = MAX_REPEATING - percentageHealth;

            return `\`\`\`diff\n+ ${"|".repeat(percentageHealth)}${" ".repeat(percentageMissingHealth)} \n \`\`\``;
        };
        const getDungeonHp = (stats)=>{
            const MAX_REPEATING = 20;
            const percentageHealth = (stats.currentHealth / stats.health * 100) * MAX_REPEATING / 100;
            const percentageMissingHealth = MAX_REPEATING - percentageHealth;

            return `\`\`\`diff\n- ${"|".repeat(percentageHealth)}${" ".repeat(percentageMissingHealth)} \n \`\`\``;
        };


            module.exports = { createDungeonBossInvitation, generateDungeonBossRound, generateDungeonBossResult };