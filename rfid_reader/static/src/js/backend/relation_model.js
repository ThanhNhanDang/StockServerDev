import { RelationalModel } from "@web/model/relational_model/relational_model";
import { patch } from "@web/core/utils/patch";
import { useBus } from "@web/core/utils/hooks";

patch(RelationalModel.prototype, {
  setup() {
    super.setup(...arguments);
    useBus(this.env.bus, "N:Reload", async({ detail }) => {
      await this.root.model.load()
    });
  },
});
