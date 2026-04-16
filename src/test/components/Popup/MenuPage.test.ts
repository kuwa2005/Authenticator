import "mocha";
import * as chai from "chai";
import { assert } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import Vuex, { Store } from "vuex";

import { loadI18nMessages } from "../../../store/i18n";
import MenuPage from "../../../components/Popup/MenuPage.vue";

import chrome from "sinon-chrome";

chai.should();
chai.use(sinonChai);
mocha.setup("bdd");
const localVue = createLocalVue();

describe("MenuPage", () => {
  before(async () => {
    localVue.prototype.i18n = await loadI18nMessages();
    localVue.use(Vuex);
  });

  let storeOpts = {
    menu: {
      state: {
        version: "1.2.3",
      },
      namespaced: true,
    },
  };

  let store: Store<{}>;

  let wrapper: Wrapper<any>;

  before(() => {
    // mock the chrome global object
    global.chrome.tabs.create = chrome.tabs.create;
    global.chrome.storage.managed.get = chrome.storage.managed.get;
  });

  beforeEach(async () => {
    store = new Vuex.Store({
      modules: storeOpts,
    });
    wrapper = mount(MenuPage, {
      store,
      localVue,
    });
  });

  const clickMenuPageButtonByTitle = async (
    wrapper: Wrapper<any>,
    title: string
  ) => wrapper.find(`*[title='${title}']`).trigger("click");

  describe("about button", () => {
    beforeEach(() => {
      wrapper = mount(MenuPage, {
        store,
        localVue,
      });
    });

    it("should open the fork README when About is clicked", async () => {
      (chrome.tabs.create as sinon.SinonStub).resetHistory();
      await clickMenuPageButtonByTitle(wrapper, "About");
      assert.ok(
        (chrome.tabs.create as sinon.SinonStub).calledOnceWith({
          url:
            "https://github.com/kuwa2005/Authenticator?tab=readme-ov-file#authenticator---",
          active: true,
        }),
        "Tab create should open the README URL"
      );
    });
  });

  describe("source code button", () => {
    beforeEach(() => {
      wrapper = mount(MenuPage, {
        store,
        localVue,
      });
    });

    it("should open the GitHub repository when Source Code is clicked", async () => {
      (chrome.tabs.create as sinon.SinonStub).resetHistory();
      await clickMenuPageButtonByTitle(wrapper, "Source Code");
      assert.ok(
        (chrome.tabs.create as sinon.SinonStub).calledOnceWith({
          url: "https://github.com/kuwa2005/Authenticator",
          active: true,
        }),
        "Tab create should open this repository URL"
      );
    });
  });

  describe("extension version", () => {
    it("should be displayed", () => {
      assert.equal(wrapper.find("#version").text(), "Version 1.2.3");
    });
  });
});
