import "mocha";
import * as chai from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";
import { Dropbox } from "../../models/backup";
import { UserSettings } from "../../models/settings";

chai.should();
chai.use(sinonChai);
mocha.setup("bdd");

describe("Backup token session storage", () => {
  beforeEach(() => {
    (global as typeof globalThis & { chrome: chrome }).chrome =
      (global as typeof globalThis & { chrome: chrome }).chrome || ({} as chrome);
    global.chrome.storage = global.chrome.storage || ({} as chrome.storage.StorageArea);
    global.chrome.storage.session =
      global.chrome.storage.session || ({} as chrome.storage.StorageArea);

    global.chrome.storage.session.get = sinon.fake.resolves({});
    global.chrome.storage.session.set = sinon.fake.resolves();
    global.chrome.storage.session.remove = sinon.fake.resolves();

    sinon.stub(UserSettings, "updateItems").resolves();
    sinon.stub(UserSettings, "commitItems").resolves();
  });

  afterEach(() => {
    sinon.restore();
  });

  it("moves legacy Dropbox token to session storage", async () => {
    UserSettings.items = { dropboxToken: "legacy-dropbox-token" };
    const token = await (new Dropbox() as unknown as { getToken: () => Promise<string> }).getToken();

    token.should.eq("legacy-dropbox-token");
    (
      global.chrome.storage.session.set as unknown as sinon.SinonStub
    ).should.have.been.calledWith({
      dropboxToken: "legacy-dropbox-token",
    });
    UserSettings.items.dropboxToken.should.eq(undefined);
  });

});
