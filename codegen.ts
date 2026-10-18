import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  ignoreNoDocuments: true,
  schema: "https://graphql.anilist.co",
  documents: ["src/shared/api/anilist/**/*.graphql"],
  generates: {
    "src/shared/api/anilist/generated/": {
      preset: "client",
      config: { useTypeImports: true },
    },
  },
};

export default config;
