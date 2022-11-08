import { expect } from "chai";

describe("test first in book page", () => {
  it("should be no books", async () => {
    const configProvider = await $(".n-config-provider");
    const isExisting = await configProvider.isExisting();
    expect(isExisting).to.be.true;

    const el = await $(".n-result-header__title");
    const text = await el.getText();
    expect(text).to.equal("暂无书本可读");
  });
});
