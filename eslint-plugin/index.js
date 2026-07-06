import indexBarrelOnly from "./rules/index-barrel-only.js";
import matchExported from "./rules/match-exported.js";
import noMultipleParametersInEndpoint from "./rules/no-multiple-parameters-in-endpoint.js";

const plugin = {
  meta: {
    name: "@kristiandupont/eslint-plugin",
    version: "1.0.0",
  },
  rules: {
    "no-multiple-parameters-in-endpoint": noMultipleParametersInEndpoint,
    "match-exported": matchExported,
    "index-barrel-only": indexBarrelOnly,
  },
};

plugin.configs = {
  recommended: {
    plugins: { "@kristiandupont": plugin },
    rules: {
      "@kristiandupont/no-multiple-parameters-in-endpoint": "error",
      "@kristiandupont/match-exported": "error",
      "@kristiandupont/index-barrel-only": "error",
    },
  },
};

export default plugin;
