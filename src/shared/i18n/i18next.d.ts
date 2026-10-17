import type { resources } from "./resources";

import "i18next";

declare module "i18next" {
  interface CustomTypeOptions {
    returnNull: false;
    defaultNS: "common";
    enableSelector: false;
    resources: (typeof resources)["ru"];
  }
}
