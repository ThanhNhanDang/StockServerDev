/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { registry } from "@web/core/registry";
import { rpc, rpcBus } from "@web/core/network/rpc";

patch(registry.category("services").get("action"), {
  start(env) {
    const base = super.start(env);
    const doActionButtonDef = base.doActionButton;
    const doActionDef = base.doAction;
    async function doAction(actionRequest, options = {}) {
      const uuid_client = localStorage.getItem("uuid_client");
      options.additionalContext = {
        ...options.additionalContext??{},
        uuid_client: uuid_client,
      };
      
      const result = await doActionDef(actionRequest, options);
      return result;

    }
    async function doActionButton(params) {
      const uuid_client = localStorage.getItem("uuid_client");
      params.context = { ...params.context, uuid_client: uuid_client };
      if (params.context.isDontClose) {
        let action;
        if (params.special) {
          action = {
            type: "ir.actions.act_window_close",
            infos: { special: true },
          };
        } else if (params.type === "object") {
          // call a Python Object method, which may return an action to execute
          let args = params.resId ? [[params.resId]] : [params.resIds];
          if (params.args) {
            let additionalArgs;
            try {
              // warning: quotes and double quotes problem due to json and xml clash
              // maybe we should force escaping in xml or do a better parse of the args array
              additionalArgs = JSON.parse(params.args.replace(/'/g, '"'));
            } catch {
              browser.console.error(
                "Could not JSON.parse arguments",
                params.args
              );
            }
            args = args.concat(additionalArgs);
          }
          const callProm = rpc(
            `/web/dataset/call_button/${params.resModel}/${params.name}`,
            {
              args,
              kwargs: { context: params.context },
              method: params.name,
              model: params.resModel,
            }
          );
          return;
        }
      }
      // For all other actions, use the original implementation
      const result = await doActionButtonDef(params);
    }

    // Replace the original function with our enhanced version
    base.doActionButton = doActionButton;
    base.doAction = doAction;
    return base;
  },
});
