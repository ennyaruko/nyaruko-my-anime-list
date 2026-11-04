import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  ignoreNoDocuments: false,
  schema: "https://graphql.anilist.co",
  documents: [
    "src/app/integrations/anilist/api/operations/**/*.graphql",
  ],
  generates: {
    "src/app/integrations/anilist/api/generated/": {
      preset: "client",
      config: { useTypeImports: true },
      presetConfig: { fragmentMasking: false },
    },
  },
};

export default config;
