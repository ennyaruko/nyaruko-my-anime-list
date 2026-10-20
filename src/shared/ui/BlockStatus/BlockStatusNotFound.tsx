import { useTranslation } from "react-i18next";

import { NoPageIcon } from "@/shared/icons";

import { BlockStatusBase } from "./BlockStatusBase";
import type { BlockStatusBaseProps } from "./BlockStatusBase";

export type BlockStatusNotFoundProps = Pick<BlockStatusBaseProps, "className">;

export function BlockStatusNotFound({ className }: BlockStatusNotFoundProps) {
  const { t } = useTranslation(["common"]);

  return (
    <BlockStatusBase
      className={className}
      icon={<NoPageIcon />}
      title={t("common:errorBoundary.notFoundTitle")}
      description={t("common:blockStatus.notFoundDescription")}
    />
  );
}
