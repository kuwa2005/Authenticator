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
    (global as typeof globalThis & { chrome: chrome }).chrome =
      (global as typeof globalThis & { chrome: chrome }).chrome || ({} as chrome);

    global.chrome.storage = global.chrome.storage || ({} as chrome.storage.StorageArea);
    global.chrome.storage.session =
      global.chrome.storage.session || ({} as chrome.storage.StorageArea);
    global.chrome.storage.local =
      global.chrome.storage.local || ({} as chrome.storage.StorageArea);
    global.chrome.storage.sync =
      global.chrome.storage.sync || ({} as chrome.storage.StorageArea);

    global.chrome.storage.session.get = sinon.fake.resolves({});
    global.chrome.storage.local.get = sinon.fake.resolves({});
    global.chrome.storage.sync.get = sinon.fake.resolves({});
    global.chrome.storage.sync.set = sinon.fake.resolves();
    global.chrome.storage.local.clear = sinon.fake.resolves();

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
        StorageLocation.Sync as unknown as string
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

    (global.chrome.storage.local.get as sinon.SinonStub).resolves(localData);
    (global.chrome.storage.sync.get as sinon.SinonStub).resolves({
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
      StorageLocation.Sync as unknown as string
    );

    result.should.eq("updateSuccess");
    (
      global.chrome.storage.sync.set as unknown as sinon.SinonStub
    ).should.have.been.calledOnce;
  });
});
