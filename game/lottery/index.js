const Lottery = require("../../models/Lottery");
const { PRIZE_FOR_LOTTERY_TICKET, MAX_ALLOWED_TICKETS } = require("./CONTS");
const { findOrSetupLottery, validatePurchase } = require("./helper");
const { generateLotteryPurchaseEmbed, generateLotteryInformationEmbed } = require("./embedGenerator");

/* Todo. Add carrots as consumable object */

const handlePurchaseLottery = async (user, amountOfTickets = 1)=>{
	const amount = amountOfTickets;
	const prizeToPay = amount * PRIZE_FOR_LOTTERY_TICKET;
	const { userId, username } = user.account;


	// checks if player have enough gold and shop level x
	const cantBeBought = validatePurchase(user, prizeToPay, amount);
	if (cantBeBought) {
		return cantBeBought;
	}


	// finds the last created lottery
	const latestLotteryRaffle = await findOrSetupLottery();
	if (!latestLotteryRaffle) {
		return "The Lottery is currently down for maintance";
	}


	// checks if the player have more tickets than allowed
	if (latestLotteryRaffle.currentContestors.length) {
		const contestor = latestLotteryRaffle.currentContestors.find(c=> c.userId === userId);
		if (contestor && contestor.ticketAmount + amount > MAX_ALLOWED_TICKETS) {
			return `Max ${MAX_ALLOWED_TICKETS} tickets can be purchased for each lottery raffle\nYou currently have ${contestor.ticketAmount} `;
		}
	}

	// removes gold from user and add user to lottery
	try{
		await user.removeManyResources({ gold:prizeToPay });
		await latestLotteryRaffle.addContestor(username, userId, amount, PRIZE_FOR_LOTTERY_TICKET);
	}
	catch (err) {
		console.error("Error: ", err);
	}

	await user.save();
	await latestLotteryRaffle.save();

	const purchaseEmbed = generateLotteryPurchaseEmbed(username, userId, amount, latestLotteryRaffle);

	return purchaseEmbed;

};
const getLotteryInformation = async ()=>{

	// This to check if winner needs to be picked
	await findOrSetupLottery();
	let latestLotteryRaffles;
	try {
		latestLotteryRaffles = await Lottery
			.find()
			.limit(2)
			.sort({ nextDrawing: -1 });
	}
	catch (err) {
		console.error("Error: ", err);
	}
	if (!latestLotteryRaffles || latestLotteryRaffles.length === 0) {
		return "The Lottery is currently down for maintance";
	}

	const lotteryInformationEmbed = generateLotteryInformationEmbed(latestLotteryRaffles);

	return lotteryInformationEmbed;

};

module.exports = { handlePurchaseLottery, getLotteryInformation };

