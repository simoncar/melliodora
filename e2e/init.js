const detox = require("detox");
const adapter = require("detox/runners/jest/adapter");
const config = require("../package.json").detox;

jest.setTimeout(200000);
jasmine.getEnv().addReporter(adapter);

beforeAll(async () => {
  // await detox.init(config);
  await detox.init(config, { launchApp: false });
  await device.launchApp({ permissions: { notifications: 'YES' }, launchArgs: { detoxURLBlacklistRegex: ' \\(".*19001/onchange.*", ".*firestore.*"\\)' },});
  await device.setURLBlacklist(['.*firestore.*', '.*19001/onchange.*']);
});

beforeEach(async () => {
  await adapter.beforeEach();
});

afterAll(async () => {
  await adapter.afterAll();
  await detox.cleanup();
});