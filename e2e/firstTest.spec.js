import { reloadApp } from "detox-expo-helpers";


describe('tests', () => {
    beforeEach(async () => {
        await reloadApp();
    });

    it('Test HomeNav', async () => {
        await waitFor(element(by.label("Text for test"))).toBeVisible().withTimeout(20000);
        await expect(element(by.label("Text for test"))).toBeVisible();
        await element(by.id("safeguardnav")).tap();
    });

    // it('Test Safeguarding', async () => {
        
    //     await waitFor(element(by.id("safeguardnav"))).toBeVisible().withTimeout(20000);
    //     await element(by.id("safeguardnav")).tap();
    // });


});