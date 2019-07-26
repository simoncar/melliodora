import { reloadApp } from "detox-expo-helpers";

describe('Authentication tests', () => {
    beforeEach(async () => {
        await reloadApp();
        await device.setURLBlacklist(['.*firestore.*', '.*19001/onchange.*']);
        await device.disableSynchronization();

    });

    it('Test HomeNav', async () => {
        await device.setURLBlacklist(['.*firestore.*', '.*19001/onchange.*']);
        await device.disableSynchronization();
        await waitFor(element(by.label("Text for test"))).toBeVisible().withTimeout(20000);
        await expect(element(by.label("Text for test"))).toBeVisible();
    });

});