import { useTranslation } from "react-i18next";

import { StrictPageIcon } from "@/shared/icons";

import { BlockStatusBase } from "./BlockStatusBase";
import type { BlockStatusBaseProps } from "./BlockStatusBase";

export type BlockStatusForbiddenProps = Pick<BlockStatusBaseProps, "className">;

export function BlockStatusForbidden({ className }: BlockStatusForbiddenProps) {
  const { t } = useTranslation(["common"]);

  return (
    <BlockStatusBase
      className={className}
      icon={<StrictPageIcon />}
      title={t("common:blockStatus.forbiddenTitle")}
      description={t("common:blockStatus.forbiddenDescription")}
    />
  );
}
