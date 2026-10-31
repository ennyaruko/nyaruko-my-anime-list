import { useTranslation } from "react-i18next";

import { NoContentIcon } from "@/shared/icons";

import { BlockStatusBase } from "./BlockStatusBase";
import type { BlockStatusBaseProps } from "./BlockStatusBase";

export type BlockStatusEmptyProps = Pick<BlockStatusBaseProps, "className">;

export function BlockStatusEmpty({ className }: BlockStatusEmptyProps) {
  const { t } = useTranslation(["common"]);

  return (
    <BlockStatusBase
      className={className}
      icon={<NoContentIcon />}
      title={t("common:emptyResults")}
      description={t("common:blockStatus.emptyDescription")}
    />
  );
}
