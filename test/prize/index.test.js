/* eslint-disable no-undef */

const { expect } = require("chai");
const dailyPrizeCommand = require("../../commands/dailyPrize");
const weeklyPrizeCommand = require("../../commands/weeklyPrize");
const { createTestUser, generateDiscordMessage, mockDays } = require("../helper");

describe("consecutive prizes commands", () => {
	it("daily prize should exist", () => {
		expect(dailyPrizeCommand).to.not.equal(undefined);
	});
	it("should run into cooldown if triggered too fast", async ()=>{
		const testUser = await createTestUser();
		const mockMessage = generateDiscordMessage(testUser);
		const result = await dailyPrizeCommand.execute(mockMessage, null, testUser);
		const result2 = await dailyPrizeCommand.execute(mockMessage, null, testUser);
        expect(result.footer.text).to.be.equal("This is your first consecutive day!");
        expect(result2.fields[0].name.startsWith("You can't use this command. Cooldown is")).to.be.equal(true);
    });
    it("should have different prices for each consecutive day", async ()=>{
        const goldResults = [];
        const testUser = await createTestUser({ resources:{ gold:0 } });
        const mockMessage = generateDiscordMessage(testUser);

        for (let i = 0; i < 5; i++) {
            await dailyPrizeCommand.execute(mockMessage, null, testUser);
            await testUser.setNewCooldown("dailyPrize", mockDays(i + 1));
            goldResults.push(testUser.resources.gold);
            testUser.resources.gold = 0;
            await testUser.save();
        }
		[50, 110, 250, 500, 1200].forEach((p, i)=>{
			expect(goldResults[i]).to.be.equal(p);
		});
    });

    it("should not give better prices after 5 days", async ()=>{
        const goldResults = [];
        const testUser = await createTestUser({ resources:{ gold:0 }, consecutivePrizes:{ dailyPrize:5 } });
        const mockMessage = generateDiscordMessage(testUser);
        for (let i = 0; i < 2; i++) {
            await dailyPrizeCommand.execute(mockMessage, null, testUser);
            await testUser.setNewCooldown("dailyPrize", mockDays(i + 1));
            goldResults.push(testUser.resources.gold);
            testUser.resources.gold = 0;
            await testUser.save();
        }
        expect(goldResults[0]).to.be.equal(1200);
        expect(goldResults[1]).to.be.equal(1200);
	});

	it("should give different user feedback based upon day", async ()=>{
        const footerResults = [];
        const testUser = await createTestUser();
        const mockMessage = generateDiscordMessage(testUser);

        for (let i = 0; i < 6; i++) {
            const result = await dailyPrizeCommand.execute(mockMessage, null, testUser);
			await testUser.setNewCooldown("dailyPrize", mockDays(i + 1));
            footerResults.push(result.footer.text.split(" ")[3]);
		}
		["first", "second", "third", "fourth", "fifth", "fifth"].forEach((n, i)=>{
			expect(n).to.be.equal(footerResults[i]);
		});
	});


	it("weekly prize should exist", () => {
		expect(weeklyPrizeCommand).to.not.equal(undefined);
	});
	it("should run into cooldown if triggered too fast", async ()=>{
		const testUser = await createTestUser();
		const mockMessage = generateDiscordMessage(testUser);
		const result = await weeklyPrizeCommand.execute(mockMessage, null, testUser);
		const result2 = await weeklyPrizeCommand.execute(mockMessage, null, testUser);
        expect(result.footer.text).to.be.equal("This is your first consecutive week!");
        expect(result2.fields[0].name.startsWith("You can't use this command. Cooldown is")).to.be.equal(true);
    });
    it("should have different prices for each consecutive week", async ()=>{
        const goldResults = [];
        const testUser = await createTestUser({ resources:{ gold:0 } });
        const mockMessage = generateDiscordMessage(testUser);

        for (let i = 0; i < 5; i++) {
            await weeklyPrizeCommand.execute(mockMessage, null, testUser);
            await testUser.setNewCooldown("weeklyPrize", mockDays((i + 1) * 7));
            goldResults.push(testUser.resources.gold);
            testUser.resources.gold = 0;
            await testUser.save();
		}
		[200, 2000, 5000, 10000, 20000].forEach((p, i)=>{
			expect(goldResults[i]).to.be.equal(p);
		});

    });

    it("should not give better prices after 5 weeks", async ()=>{
        const goldResults = [];
        const testUser = await createTestUser({ resources:{ gold:0 }, consecutivePrizes:{ weeklyPrize:5 } });
        const mockMessage = generateDiscordMessage(testUser);
        for (let i = 0; i < 2; i++) {
            await weeklyPrizeCommand.execute(mockMessage, null, testUser);
            await testUser.setNewCooldown("weeklyPrize", mockDays((i + 1) * 7));
            goldResults.push(testUser.resources.gold);
            testUser.resources.gold = 0;
            await testUser.save();
        }
        expect(goldResults[0]).to.be.equal(20000);
        expect(goldResults[1]).to.be.equal(20000);
	});

	it("should give different user feedback based upon week", async ()=>{
        const footerResults = [];
        const testUser = await createTestUser();
        const mockMessage = generateDiscordMessage(testUser);

        for (let i = 0; i < 6; i++) {
            const result = await weeklyPrizeCommand.execute(mockMessage, null, testUser);
			await testUser.setNewCooldown("weeklyPrize", mockDays((i + 1) * 7));
            footerResults.push(result.footer.text.split(" ")[3]);
		}
		["first", "second", "third", "fourth", "fifth", "fifth"].forEach((n, i)=>{
			expect(n).to.be.equal(footerResults[i]);
		});
	});
});
