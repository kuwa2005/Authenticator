import "mocha";
import * as chai from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";
import { Accounts } from "../../store/Accounts";
import { BrowserStorage, EntryStorage } from "../../models/storage";
import { UserSettings, StorageLocation } from "../../models/settings";

chai.should();
chai.use(sinonChai);
mocha.setup("bdd");

describe("Accounts store security guards", () => {
  beforeEach(() => {
    const g = (globalThis as unknown) as { chrome: Record<string, unknown> };
    g.chrome = (g.chrome || {}) as Record<string, unknown>;
    const storage = (g.chrome.storage || {}) as Record<string, unknown>;
    g.chrome.storage = storage;
    storage.session = (storage.session || {}) as Record<string, unknown>;
    storage.local = (storage.local || {}) as Record<string, unknown>;
    storage.sync = (storage.sync || {}) as Record<string, unknown>;

    const session = storage.session as Record<string, unknown>;
    const local = storage.local as Record<string, unknown>;
    const sync = storage.sync as Record<string, unknown>;
    session.get = sinon.stub().resolves({});
    local.get = sinon.stub().resolves({});
    sync.get = sinon.stub().resolves({});
    sync.set = sinon.stub().resolves(undefined);
    local.clear = sinon.stub().resolves(undefined);
    ((globalThis as unknown) as { chrome: typeof g.chrome }).chrome = g.chrome;

    sinon.stub(UserSettings, "updateItems").resolves();
    sinon.stub(EntryStorage, "hasEncryptionKey").resolves(false);
    sinon.stub(EntryStorage, "get").resolves([]);
    sinon.stub(EntryStorage, "getExport").resolves({});
    sinon.stub(UserSettings, "commitItems").resolves();
  });

  afterEach(() => {
    sinon.restore();
  });

  it("blocks Local->Sync migration when encryption key does not exist", async () => {
    sinon.stub(BrowserStorage, "getKeys").resolves([]);

    UserSettings.items = {
      storageLocation: StorageLocation.Local,
    };

    const module = await new Accounts().getModule();
    const migrateStorage = module.actions?.migrateStorage;
    if (!migrateStorage) {
      throw new Error("migrateStorage action is missing");
    }

    let thrown: unknown;
    try {
      await migrateStorage(
        { state: {} } as never,
        (StorageLocation.Sync as unknown) as string
      );
    } catch (error) {
      thrown = error;
    }

    String(thrown).should.contain("Encryption is required");
  });

  it("allows Local->Sync migration when encryption key exists", async () => {
    sinon.stub(BrowserStorage, "getKeys").resolves([
      {
        dataType: "Key",
        id: "test-key-id",
        salt: "salt",
        hash: "hash",
        version: 3,
      },
    ]);

    const localData = {
      UserSettings: {
        storageLocation: StorageLocation.Local,
      },
      account1: {
        dataType: "OTPStorage",
      },
    };

    ((globalThis as unknown) as {
      chrome: { storage: { local: { get: sinon.SinonStub } } };
    }).chrome.storage.local.get.resolves(localData);
    ((globalThis as unknown) as {
      chrome: { storage: { sync: { get: sinon.SinonStub } } };
    }).chrome.storage.sync.get.resolves({
      account1: {
        dataType: "OTPStorage",
      },
    });

    UserSettings.items = {
      storageLocation: StorageLocation.Local,
    };

    const module = await new Accounts().getModule();
    const migrateStorage = module.actions?.migrateStorage;
    if (!migrateStorage) {
      throw new Error("migrateStorage action is missing");
    }

    const result = await migrateStorage(
      { state: {} } as never,
      (StorageLocation.Sync as unknown) as string
    );

    result.should.eq("updateSuccess");
    ((globalThis as unknown) as {
      chrome: { storage: { sync: { set: sinon.SinonStub } } };
    }).chrome.storage.sync.set.should.have.been.calledOnce;
  });
});
