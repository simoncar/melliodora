import { reloadApp } from "detox-expo-helpers";

describe("tests", () => {
  beforeEach(async () => {
    await reloadApp();
  });

  console.log("tests - here ");

  it("Test HomeNav", async () => {
    await waitFor(element(by.label("PTA Welcome (Back) Coffee")))
      .toBeVisible()
      .withTimeout(20000);
    await expect(element(by.label("PTA Welcome (Back) Coffee"))).toBeVisible();
    await element(by.id("Calendar")).tap();
    //await element(by.id("safeguardnav")).tap();
  });

  // it('Test Safeguarding', async () => {

  //     await waitFor(element(by.id("safeguardnav"))).toBeVisible().withTimeout(20000);
  //     await element(by.id("safeguardnav")).tap();
  // });
});
