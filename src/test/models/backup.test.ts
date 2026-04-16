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
    const g = (globalThis as unknown) as { chrome: Record<string, unknown> };
    g.chrome = (g.chrome || {}) as Record<string, unknown>;
    const storage = (g.chrome.storage || {}) as Record<string, unknown>;
    g.chrome.storage = storage;
    const session = (storage.session || {}) as Record<string, unknown>;
    storage.session = session;

    session.get = sinon.stub().resolves({});
    session.set = sinon.stub().resolves(undefined);
    session.remove = sinon.stub().resolves(undefined);
    ((globalThis as unknown) as { chrome: typeof g.chrome }).chrome = g.chrome;

    sinon.stub(UserSettings, "updateItems").resolves();
    sinon.stub(UserSettings, "commitItems").resolves();
  });

  afterEach(() => {
    sinon.restore();
  });

  it("moves legacy Dropbox token to session storage", async () => {
    UserSettings.items = { dropboxToken: "legacy-dropbox-token" };
    const token = await ((new Dropbox() as unknown) as {
      getToken: () => Promise<string>;
    }).getToken();

    token.should.eq("legacy-dropbox-token");
    const sessionSet = ((globalThis as unknown) as {
      chrome: { storage: { session: { set: unknown } } };
    }).chrome.storage.session.set as sinon.SinonStub;
    sessionSet.should.have.been.calledWith({
      dropboxToken: "legacy-dropbox-token",
    });
    chai.expect(UserSettings.items.dropboxToken).to.equal(undefined);
  });
});
