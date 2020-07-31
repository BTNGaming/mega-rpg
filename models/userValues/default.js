const cooldowns = {
	duel:{
		type: Date,
		default: 0,
	},
	dailyPrize:{
		type:Date,
		default:0,
	},
	dungeon:{
		type:Date,
		default:0,
	},
	explore: {
		type:Date,
		default:0,
	},
	fish:{
		type:Date,
		default:0,
	},
	hunt:{
		type:Date,
		default:0,
	},
	race:{
		type:Date,
		default:0,
	},
	raid:{
		type:Date,
		default:0,
	},
	tower:{
		type:Date,
		default:0,
	},
	weeklyPrize:{
		type:Date,
		default:0,
	},
};
// key must be equal to commands
const statistics = {
	army: {
		type: Number,
		default:0,
	},
	build: {
		type: Number,
		default:0,
	},
	buy: {
		type: Number,
		default:0,
	},
	collect: {
		type: Number,
		default:0,
	},
	cooldown: {
		type: Number,
		default:0,
	},
	craft: {
		type: Number,
		default:0,
	},
	daily: {
		type: Number,
		default:0,
	},
	duel: {
		type: Number,
		default:0,
	},
	dungeon: {
		type: Number,
		default:0,
	},
	equip: {
		type: Number,
		default:0,
	},
	explore: {
		type: Number,
		default:0,
	},
	fish: {
		type: Number,
		default:0,
	},
	grid: {
		type: Number,
		default:0,
	},
	help: {
		type: Number,
		default:0,
	},
	hunt: {
		type: Number,
		default:0,
	},
	info: {
		type: Number,
		default:0,
	},
	look: {
		type: Number,
		default:0,
	},
	miniboss: {
		type: Number,
		default:0,
	},
	produce: {
		type: Number,
		default:0,
	},
	profile: {
		type: Number,
		default:0,
	},
	quest: {
		type: Number,
		default:0,
	},
	race: {
		type: Number,
		default:0,
	},
	raid: {
		type: Number,
		default:0,
	},
	rank: {
		type: Number,
		default:0,
	},
	recruit: {
		type: Number,
		default:0,
	},
	resources: {
		type: Number,
		default:0,
	},
	stake: {
		type: Number,
		default:0,
	},
	travel: {
		type: Number,
		default:0,
	},
	use: {
		type: Number,
		default:0,
	},
	weekly:{
		type: Number,
		default:0,
	},
};

module.exports = { cooldowns, statistics };